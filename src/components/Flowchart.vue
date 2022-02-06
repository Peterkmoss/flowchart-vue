<template>
  <div
    id="chart"
    tabindex="0"
    :style="{
      width: isNaN(width) ? width : width + 'px',
      height: isNaN(height) ? height : height + 'px',
      cursor: cursor,
    }"
    @mousemove="handleChartMouseMove"
    @mouseup="handleChartMouseUp"
    @dblclick="handleChartDblClick($event)"
    @mousewheel="handleChartMouseWheel"
    @mousedown="handleChartMouseDown($event)"
  >
    <svg id="svg">
      <rect class="selection" height="0" width="0"></rect>
    </svg>
  </div>
</template>
<style src="./index.css"></style>
<script>
import { lineTo } from "../utils/svg";
import * as d3 from "d3";
import * as handlers from "../handlers";
import {
  between,
  distanceOfPointToLine,
  getEdgeOfPoints,
  pointRectangleIntersection,
} from "../utils/math";

export default {
  props: {
    nodes: {
      type: Array,
      default: () => [],
    },
    connections: {
      type: Array,
      default: () => [],
    },
    width: {
      type: [String, Number],
      default: 800,
    },
    height: {
      type: [String, Number],
      default: 600,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      connectStart: {
        node: null,
        position: null,
      },
      selectionStartPoint: null,
      currentNodes: [],
      currentConnections: [],
      /**
       * Mouse position(relative to chart div)
       */
      cursorToChartOffset: { x: 0, y: 0 },
      clickedOnce: false,
      pathClickedOnce: false,
      /**
       * lines of all connections
       */
      lines: [],
    };
  },
  methods: {

    add(node) {
      if (this.readonly) { return; }
      this.nodes.push(node);
      this.$emit("addNode", node, this.nodes, this.connections);
    },

    connect(connection) {
      if (this.readonly) { return; }
      this.connections.push(connection);
      this.$emit("connected", connection, this.nodes, this.connections);
    },

    remove() {
      if (this.readonly) { return; }
      for (const conn of this.currentConnections) {
        this.removeConnection(conn);
      }
      this.currentConnections.splice(0, this.currentConnections.length);
      for (const node of this.currentNodes) {
        this.removeNode(node);
      }
      this.currentNodes.splice(0, this.currentNodes.length);
    },

    removeNode(node) {
      const connections = this.connections.filter(conn => conn.from.node.id === node.id || conn.to.node.id === node.id);
      for (const connection of connections) {
        this.connections.splice(this.connections.indexOf(connection), 1);
      }
      this.nodes.splice(this.nodes.indexOf(node), 1);
      this.$emit("removeNode", node, this.nodes, this.connections);
    },

    removeConnection(conn) {
      this.connections.splice(this.connections.indexOf(conn), 1);
      this.$emit("removeConnection", conn, this.nodes, this.connections);
    },

    editCurrent() {
      if (this.currentNodes.length === 1) {
        this.editNode(this.currentNodes[0]);
        return;
      } 
      if (this.currentConnections.length === 1) {
        this.editConnection(this.currentConnections[0]);
        return;
      }
    },

    editNode(node) {
      if (this.readonly) { return; }
      this.$emit("editNode", node);
    },

    editConnection(connection) {
      if (this.readonly) { return; }
      this.$emit("editConnection", connection);
    },

    handleChartMouseWheel(event) {
      handlers.chartMouseWheel(this, event);
    },

    async handleChartMouseUp() {
      handlers.chartMouseUp(this);
    },

    async handleChartMouseMove(event) {
      handlers.chartMouseMove(this, event);
    },
    
    async handleChartDblClick(event) {
      handlers.chartDblClick(this, event);
    },

    async handleChartMouseDown(event) {
      handlers.chartMouseDown(this, event);
    },

    async renderSelection() {
      if (!this.selectionStartPoint) {
        // If not selecting anything currently remove selection rectangle
        d3.selectAll("#svg > .selection").classed("active", false);
        return;
      }

      // Clear current selection
      this.currentNodes = [];
      this.currentConnections = [];

      // Get selection boundary box
      const edge = getEdgeOfPoints([
        { x: this.selectionStartPoint.x, y: this.selectionStartPoint.y },
        { x: this.cursorToChartOffset.x, y: this.cursorToChartOffset.y },
      ]);

      // Create selection rectangle
      const svg = d3.select("#svg");
      const rect = svg.select(".selection").classed("active", true);
      rect
        .attr("x", edge.start.x)
        .attr("y", edge.start.y)
        .attr("width", edge.end.x - edge.start.x)
        .attr("height", edge.end.y - edge.start.y);

      // Add all nodes completely within the selection to currentNodes
      for (const node of this.nodes) {
        if (node.boundaryBox.every(point => pointRectangleIntersection(point, edge))) {
          this.currentNodes.push(node);
        }
      }

      // Add all connections completely within the selection to currentConnections
      for (const line of this.lines) {
        if (line.boundaryBox.every(point => pointRectangleIntersection(point, edge))) {
          const connection = this.connections.find(conn => conn.id === line.id);
          this.currentConnections.push(connection);
        }
      }
    },

    async renderConnections() {
      // Clear currently rendered connections
      d3.selectAll("#svg > g.connection").remove();

      this.lines = [];

      const promises = []
      for (const connection of this.connections) {
        promises.push(this.renderConnection(connection));
      }
      await Promise.all(promises);
    },

    async renderConnection(connection) {
      const g = this.append("g");

      const fromNode = this.getNodeById(connection.from.id);
      const from = {
        ...fromNode.connectorPosition(connection.from.position),
        position: connection.from.position,
        node: fromNode,
      };
      const toNode = this.getNodeById(connection.to.id);
      const to = {
        ...toNode.connectorPosition(connection.to.position),
        position: connection.to.position,
        node: toNode,
      };

      const isSelected = !!this.currentConnections.find(item => item === connection);

      const { paths, lines } = connection.render(g, from, to, isSelected);

      for (const path of paths) {
        path.on("mousedown", () => {
            handlers.pathMouseDown(this, connection);
            });
      }
      for (const { from, to } of lines) {
        const boundaryBox = [
        { x: from.x, y: from.y },
        { x: to.x, y: to.y },
        ];
        this.lines.push({ id: connection.id, from, to, boundaryBox });
      }
    },

    async renderNodes() {
      // Clear currently rendered nodes
      d3.selectAll("#svg > g.node").remove();

      const promises = [];
      for (const node of this.nodes) {
        const isSelected = !!this.currentNodes.find(item => item === node);
        promises.push(this.renderNode(node, isSelected));
      }
      await Promise.all(promises);
    },

    async renderNode(node, isSelected) {
      const g = this.append("g")
        .attr("cursor", "move")
        .classed("node", true);

      node.render(g, isSelected);

      const drag = d3.drag()
        .on("start", async () => { handlers.nodeDragStart(this, node) })
        .on("drag", async () => { handlers.nodeDragMove(this, node) })
        .on("end", async () => { handlers.nodeDragEnd(this, node) });
      g.call(drag);
      g.on("mousedown", () => {
        // handle ctrl+mousedown
        if (!d3.event.ctrlKey) { return; }
        // Add to currentNodes if not selected and remove if selected
        if (!this.currentNodes.find(item => item === node)) {
          this.currentNodes.push(node);
        } else {
          this.currentNodes.splice(this.currentNodes.indexOf(node), 1);
        }
      });

      node.renderConnectors(g, this);
    },

    getNodeById(id) {
      return this.nodes.find(node => node.id === id);
    },

    append(element) {
      const svg = d3.select("#svg");
      return svg.insert(element, ".selection");
    },

    guideLine(from, to) {
      const g = this.append("g");
      g.classed("guideline", true);
      lineTo(g, from, to, 1, "#a3a3a3", [5]);
    },

    getConnectorPositions(node) {
      const halfWidth = node.width / 2;
      const halfHeight = node.height / 2;
      const top = { x: node.x + halfWidth, y: node.y };
      const left = { x: node.x, y: node.y + halfHeight };
      const bottom = { x: node.x + halfWidth, y: node.y + node.height };
      const right = { x: node.x + node.width, y: node.y + halfHeight };
      return { left, right, top, bottom };
    },

    getCurrentNodesEdge() {
      const points = this.currentNodes.map(node => node.boundaryBox);
      return getEdgeOfPoints(points);
    },

    save() {
      if (this.readonly) {
        return;
      }
      this.$emit("save", this.nodes, this.connections);
    },

    moveCurrentNode(x, y) {
      if (!this.readonly) { return; }
      if (this.currentNodes.length > 0) {
        for (const node of this.currentNodes) {
          if (node.x + x < 0) {
            x = -node.x;
          }
          node.x += x;
          if (node.y + y < 0) {
            y = -node.y;
          }
          node.y += y;
        }
      }
    },
  },
  mounted() {
    this.renderNodes()
    this.renderConnections()
    document.onkeydown = (event) => {
      switch (event.keyCode) {
        case 37:
          this.moveCurrentNode(-10, 0);
          break;
        case 38:
          this.moveCurrentNode(0, -10);
          break;
        case 39:
          this.moveCurrentNode(10, 0);
          break;
        case 40:
          this.moveCurrentNode(0, 10);
          break;
        case 27:
          this.currentNodes.splice(0, this.currentNodes.length);
          this.currentConnections.splice(0, this.currentConnections.length);
          break;
        case 65:
          if (document.activeElement === document.getElementById("chart")) {
            this.currentNodes.splice(0, this.currentNodes.length);
            this.currentConnections.splice(0, this.currentConnections.length);
            this.currentNodes.push(...this.nodes);
            this.currentConnections.push(...this.connections);
            event.preventDefault();
          }
          break;
        case 46:
          this.remove();
          break;
        default:
          break;
      }
    };
  },
  computed: {
    hoveredConnector() {
      for (const node of this.nodes) {
        const connectorPosition = this.getConnectorPositions(node);
        for (const prop in connectorPosition) {
          const entry = connectorPosition[prop];
          if (Math.hypot(entry.x - this.cursorToChartOffset.x, entry.y - this.cursorToChartOffset.y) < 20) {
            return { position: prop, node: node };
          }
        }
      }
      return null;
    },
    hoveredConnection() {
      for (const line of this.lines) {
        let distance = distanceOfPointToLine(
          line.from.x,
          line.from.y,
          line.to.x,
          line.to.y,
          this.cursorToChartOffset.x,
          this.cursorToChartOffset.y
        );
        if (
          distance < 20 &&
          between(
            line.from.x - 2,
            line.to.x + 2,
            this.cursorToChartOffset.x
          ) &&
          between(
            line.from.y - 2,
            line.to.y + 2,
            this.cursorToChartOffset.y
          )
        ) {
          return this.connections.find(item => item.id === line.id);
        }
      }
      return null;
    },
    cursor() {
      if (this.connectStart.node || this.hoveredConnector) {
        return "crosshair";
      }
      if (this.hoveredConnection != null) {
        return "pointer";
      }
      return null;
    },
  },
  watch: {
    selectionStartPoint: {
      immediate: true,
      deep: true,
      handler() {
        this.renderSelection();
      },
    },
    connectStart: {
      immediate: true,
      deep: true,
      handler() {
        this.renderConnections();
      },
    },
    currentNodes: {
      immediate: true,
      deep: true,
      handler() {
        this.$emit('select', this.currentNodes);
        this.renderNodes();
      },
    },
    currentConnections: {
      immediate: true,
      deep: true,
      handler() {
        this.$emit('selectConnection', this.currentConnections);
        this.renderConnections();
      },
    },
    nodes: {
      immediate: true,
      deep: true,
      handler() {
        this.renderNodes();
        this.renderConnections();
      },
    },
    connections: {
      immediate: true,
      deep: true,
      handler() {
        this.renderConnections();
      },
    },
    cursorToChartOffset: {
      immediate: true,
      deep: true,
      handler() {
        if (this.selectionStartPoint) {
          this.renderSelection();
        }
      },
    },
  },
};
</script>
