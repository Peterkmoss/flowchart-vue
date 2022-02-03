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
import { connect, lineTo } from "../../utils/svg";
import * as d3 from "d3";
import * as handlers from "../../handlers";
import {
  between,
  distanceOfPointToLine,
  getEdgeOfPoints,
  pointRectangleIntersection,
} from "../../utils/math";

/* eslint-disable */

export default {
  name: "flowchart",
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
      connectingInfo: {
        source: null,
        sourcePosition: null,
      },
      selectionInfo: null,
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
      if (this.readonly) {
        return;
      }
      this.nodes.push(node);
      this.$emit("add", node, this.nodes, this.connections);
    },

    editCurrent() {
      if (this.currentNodes.length === 1) {
        this.editNode(this.currentNodes[0]);
      } else if (this.currentConnections.length === 1) {
        this.editConnection(this.currentConnections[0]);
      }
    },

    editNode(node) {
      if (this.readonly) {
        return;
      }
      this.$emit("editnode", node);
    },

    editConnection(connection) {
      if (this.readonly) {
        return;
      }
      this.$emit("editconnection", connection);
    },

    handleChartMouseWheel(event) {
      event.stopPropagation();
      event.preventDefault();
      if (event.ctrlKey) {
        let svg = document.getElementById("svg");
        let zoom = parseFloat(svg.style.zoom || 1);
        if (event.deltaY > 0 && zoom === 0.1) {
          return;
        }
        zoom -= event.deltaY / 100 / 10;
        svg.style.zoom = zoom;
      }
    },

    async handleChartMouseUp() {
      if (this.connectingInfo.source) {
        if (this.hoveredConnector) {
          if (this.connectingInfo.source.id !== this.hoveredConnector.node.id) {
            // Node can't connect to itself
            let tempId = +new Date();
            let conn = {
              source: {
                id: this.connectingInfo.source.id,
                position: this.connectingInfo.sourcePosition,
              },
              destination: {
                id: this.hoveredConnector.node.id,
                position: this.hoveredConnector.position,
              },
              id: tempId,
              type: "pass",
              name: "Pass",
            };
            this.connections.push(conn);
            this.$emit("connect", conn, this.nodes, this.connections);
          }
        }
        this.connectingInfo.source = null;
        this.connectingInfo.sourcePosition = null;
      }
      if (this.selectionInfo) {
        this.selectionInfo = null;
      }
    },

    async handleChartMouseMove(event) {
      // calc offset of cursor to chart
      let boundingClientRect = event.currentTarget.getBoundingClientRect();
      let actualX = event.pageX - boundingClientRect.left - window.scrollX;
      this.cursorToChartOffset.x = Math.trunc(actualX);
      let actualY = event.pageY - boundingClientRect.top - window.scrollY;
      this.cursorToChartOffset.y = Math.trunc(actualY);

      if (this.connectingInfo.source) {
        await this.renderConnections();

        d3.selectAll("#svg .connector").classed("active", true);

        let sourceOffset = this.getNodeConnectorOffset(
          this.connectingInfo.source.id,
          this.connectingInfo.sourcePosition
        );
        let destinationPosition = this.hoveredConnector
          ? this.hoveredConnector.position
          : null;
        this.arrowTo(
          sourceOffset.x,
          sourceOffset.y,
          this.cursorToChartOffset.x,
          this.cursorToChartOffset.y,
          this.connectingInfo.sourcePosition,
          destinationPosition
        );
      }
    },
    
    handleChartDblClick(event) {
      if (this.readonly) {
        return;
      }
      this.$emit("dblclick", { x: event.offsetX, y: event.offsetY });
    },

    handleChartMouseDown(event) {
      if (event.ctrlKey) {
        return;
      }
      this.selectionInfo = { x: event.offsetX, y: event.offsetY };
    },

    getConnectorPosition(node) {
      const halfWidth = node.width / 2;
      const halfHeight = node.height / 2;
      const top = { x: node.x + halfWidth, y: node.y };
      const left = { x: node.x, y: node.y + halfHeight };
      const bottom = { x: node.x + halfWidth, y: node.y + node.height };
      const right = { x: node.x + node.width, y: node.y + halfHeight };
      return { left, right, top, bottom };
    },

    renderSelection() {
      if (this.selectionInfo) {
        this.currentNodes.splice(0, this.currentNodes.length);
        this.currentConnections.splice(0, this.currentConnections.length);
        let edge = getEdgeOfPoints([
          { x: this.selectionInfo.x, y: this.selectionInfo.y },
          { x: this.cursorToChartOffset.x, y: this.cursorToChartOffset.y },
        ]);
        let svg = d3.select("#svg");
        let rect = svg.select(".selection").classed("active", true);
        rect
          .attr("x", edge.start.x)
          .attr("y", edge.start.y)
          .attr("width", edge.end.x - edge.start.x)
          .attr("height", edge.end.y - edge.start.y);

        this.nodes.forEach(item => {
          const points = [
            { x: item.x, y: item.y },
            { x: item.x, y: item.y + item.height },
            { x: item.x + item.width, y: item.y },
            { x: item.x + item.width, y: item.y + item.height },
          ];
          if (points.every(point => pointRectangleIntersection(point, edge))) {
            this.currentNodes.push(item);
          }
        });
        this.lines.forEach(line => {
          const points = [
            { x: line.sourceX, y: line.sourceY },
            { x: line.destinationX, y: line.destinationY },
          ];
          if (
            points.every(point => pointRectangleIntersection(point, edge)) &&
            this.currentConnections.every(item => item.id !== line.id)
          ) {
            const connection = this.connections.find(conn => conn.id === line.id);
            this.currentConnections.push(connection);
          }
        });
      } else {
        d3.selectAll("#svg > .selection").classed("active", false);
      }
    },

    async renderConnections() {
        this.$nextTick(() => {
          d3.selectAll("#svg > g.connection").remove();
          // render lines
          this.lines = [];
          this.connections.forEach((conn) => {
            let sourcePosition = this.getNodeConnectorOffset(
              conn.source.id,
              conn.source.position
            );
            let destinationPosition = this.getNodeConnectorOffset(
              conn.destination.id,
              conn.destination.position
            );
            let colors = {
              pass: "#52c41a",
              reject: "red",
            };
            if (
              this.currentConnections.filter(item => item === conn).length > 0
            ) {
              colors = {
                pass: "#12640a",
                reject: "darkred",
              };
            }
            let result = this.arrowTo(
              sourcePosition.x,
              sourcePosition.y,
              destinationPosition.x,
              destinationPosition.y,
              conn.source.position,
              conn.destination.position,
              colors[conn.type]
            );
            for (const path of result.paths) {
              path.on("mousedown", () => {
                d3.event.stopPropagation();
                if (this.pathClickedOnce) {
                  this.editConnection(conn);
                } else {
                  let timer = setTimeout(() => {
                    this.pathClickedOnce = false;
                    clearTimeout(timer);
                  }, 300);
                  this.pathClickedOnce = true;
                }
                this.currentNodes.splice(0, this.currentNodes.length);
                this.currentConnections.splice(
                  0,
                  this.currentConnections.length
                );
                this.currentConnections.push(conn);
              });
            }
            for (const line of result.lines) {
              this.lines.push({
                sourceX: line.sourceX,
                sourceY: line.sourceY,
                destinationX: line.destinationX,
                destinationY: line.destinationY,
                id: conn.id,
              });
            }
          });
        });
    },

    async renderNodes() {
      d3.selectAll("#svg > g.node").remove();
      this.nodes.forEach(node => {
        this.renderNode(
          node,
          this.currentNodes.filter(item => item === node).length > 0
        )
      })
    },

    getNodeConnectorOffset(nodeId, connectorPosition) {
      let node = this.nodes.filter((item) => item.id === nodeId)[0];
      return this.getConnectorPosition(node)[connectorPosition];
    },

    append(element) {
      let svg = d3.select("#svg");
      return svg.insert(element, ".selection");
    },

    guideLineTo(x1, y1, x2, y2) {
      let g = this.append("g");
      g.classed("guideline", true);
      lineTo(g, x1, y1, x2, y2, 1, "#a3a3a3", [5, 3]);
    },

    arrowTo(x1, y1, x2, y2, startPosition, endPosition, color) {
      let g = this.append("g");
      g.classed("connection", true);
      connect(
        g,
        x1,
        y1,
        x2,
        y2,
        startPosition,
        endPosition,
        1,
        color || "#a3a3a3",
        true
      );
      // a 10px cover to make mouse operation conveniently
      return connect(
        g,
        x1,
        y1,
        x2,
        y2,
        startPosition,
        endPosition,
        5,
        "transparent",
        false
      );
    },

    renderNode(node, isSelected) {
      let g = this.append("g").attr("cursor", "move").classed("node", true);

      if (node.render) {
        node.render(g, isSelected);
      }

      const drag = d3.drag()
        .on("start", () => { handlers.dragStart(this, node) })
        .on("drag", async () => { handlers.dragMove(this, node) })
        .on("end", () => { handlers.dragEnd(this, node) });
      g.call(drag);
      g.on("mousedown", () => {
        // handle ctrl+mousedown
        if (!d3.event.ctrlKey) {
          return;
        }
        let isNotCurrentNode = !this.currentNodes.find(item => item === node);
        if (isNotCurrentNode) {
          this.currentNodes.push(node);
        } else {
          this.currentNodes.splice(this.currentNodes.indexOf(node), 1);
        }
      });

      const connectors = [];
      const connectorPosition = this.getConnectorPosition(node);
      for (const position in connectorPosition) {
        const positionElement = connectorPosition[position];
        const connector = g
          .append("circle")
          .attr("cx", positionElement.x)
          .attr("cy", positionElement.y)
          .attr("r", 4)
          .attr("class", "connector");
        connector
          .on("mousedown", () => {
            d3.event.stopPropagation();
            if (node.type === "end" || this.readonly) {
              return;
            }
            this.connectingInfo.source = node;
            this.connectingInfo.sourcePosition = position;
          })
          .on("mouseup", () => {
            d3.event.stopPropagation();
            if (this.connectingInfo.source) {
              if (this.connectingInfo.source.id !== node.id) {
                // Node can't connect to itself
                let tempId = +new Date();
                let conn = {
                  source: {
                    id: this.connectingInfo.source.id,
                    position: this.connectingInfo.sourcePosition,
                  },
                  destination: {
                    id: node.id,
                    position: position,
                  },
                  id: tempId,
                  type: "pass",
                  name: "Pass",
                };
                this.connections.push(conn);
                this.$emit("connect", conn, this.nodes, this.connections);
              }
              this.connectingInfo.source = null;
              this.connectingInfo.sourcePosition = null;
            }
          })
          .on("mouseover", () => {
            connector.classed("active", true);
          })
          .on("mouseout", () => {
            connector.classed("active", false);
          });
        connectors.push(connector);
      }
      g.on("mouseover", () => {
        connectors.forEach((conn) => conn.classed("active", true));
      }).on("mouseout", () => {
        connectors.forEach((conn) => conn.classed("active", false));
      });
    },

    getCurrentNodesEdge() {
      let points = this.currentNodes.map((node) => ({
        x: node.x,
        y: node.y,
      }));
      points.push(
        ...this.currentNodes.map((node) => ({
          x: node.x + node.width,
          y: node.y + node.height,
        }))
      );
      return getEdgeOfPoints(points);
    },

    save() {
      if (this.readonly) {
        return;
      }
      this.$emit("save", this.nodes, this.connections);
    },

    async remove() {
      if (this.readonly) {
        return;
      }
      if (this.currentConnections.length > 0) {
        for (let conn of this.currentConnections) {
          this.removeConnection(conn);
        }
        this.currentConnections.splice(0, this.currentConnections.length);
      }
      if (this.currentNodes.length > 0) {
        for (let node of this.currentNodes) {
          this.removeNode(node);
        }
        this.currentNodes.splice(0, this.currentNodes.length);
      }
    },

    removeNode(node) {
      const connections = this.connections.filter(
        (item) => item.source.id === node.id || item.destination.id === node.id
      );
      for (const connection of connections) {
        this.connections.splice(
          this.connections.indexOf(connection),
          1
        );
      }
      this.nodes.splice(this.nodes.indexOf(node), 1);
      this.$emit("delete", node, this.nodes, this.connections);
    },

    removeConnection(conn) {
      const index = this.connections.indexOf(conn);
      this.connections.splice(index, 1);
      this.$emit("disconnect", conn, this.nodes, this.connections);
    },

    moveCurrentNode(x, y) {
      if (this.currentNodes.length > 0 && !this.readonly) {
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
  created() {},
  computed: {
    hoveredConnector() {
      for (const node of this.nodes) {
        let connectorPosition = this.getConnectorPosition(node);
        for (let prop in connectorPosition) {
          let entry = connectorPosition[prop];
          if (
            Math.hypot(
              entry.x - this.cursorToChartOffset.x,
              entry.y - this.cursorToChartOffset.y
            ) < 10
          ) {
            return { position: prop, node: node };
          }
        }
      }
      return null;
    },
    hoveredConnection() {
      for (const line of this.lines) {
        let distance = distanceOfPointToLine(
          line.sourceX,
          line.sourceY,
          line.destinationX,
          line.destinationY,
          this.cursorToChartOffset.x,
          this.cursorToChartOffset.y
        );
        if (
          distance < 5 &&
          between(
            line.sourceX - 2,
            line.destinationX + 2,
            this.cursorToChartOffset.x
          ) &&
          between(
            line.sourceY - 2,
            line.destinationY + 2,
            this.cursorToChartOffset.y
          )
        ) {
          let connections = this.connections.filter(
            (item) => item.id === line.id
          );
          return connections.length > 0 ? connections[0] : null;
        }
      }
      return null;
    },
    cursor() {
      if (this.connectingInfo.source || this.hoveredConnector) {
        return "crosshair";
      }
      if (this.hoveredConnection != null) {
        return "pointer";
      }
      return null;
    },
  },
  watch: {
    selectionInfo: {
      immediate: true,
      deep: true,
      handler() {
        this.renderSelection();
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
        this.$emit('selectconnection', this.currentConnections);
        this.renderConnections();
      },
    },
    cursorToChartOffset: {
      immediate: true,
      deep: true,
      handler() {
        if (this.selectionInfo) {
          this.renderSelection();
        }
      },
    },
    connectingInfo: {
      immediate: true,
      deep: true,
      handler() {
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
  },
};
</script>
