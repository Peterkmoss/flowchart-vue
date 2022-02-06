import * as d3 from "d3";
import { PassConnection, TmpConnection } from './utils/Connection';

export const nodeDragStart = (_this, node) => {
  const isSelected = _this.currentNodes.find(item => item === node);
  if (!isSelected) {
    _this.currentNodes = [node];
  }

  if (_this.clickedOnce) {
    _this.currentNodes = [];
    _this.editNode(node);
    return;
  }

  // Double click support. Reset clickedOnce after 300ms
  const timer = setTimeout(() => {
    _this.clickedOnce = false;
    clearTimeout(timer);
  }, 300);
  _this.clickedOnce = true;
}

export const nodeDragMove = (_this) => {
  if (_this.readonly) { return; }

  const zoom = parseFloat(document.getElementById("svg").style.zoom || 1);
  for (const currentNode of _this.currentNodes) {
    let x = d3.event.dx / zoom;
    if (currentNode.x + x < 0) {
      x = -currentNode.x;
    }
    currentNode.x += x;
    let y = d3.event.dy / zoom;
    if (currentNode.y + y < 0) {
      y = -currentNode.y;
    }
    currentNode.y += y;
  }

  // Clear guide lines
  d3.selectAll("#svg > g.guideline").remove();

  const edge = _this.getCurrentNodesEdge();
  const expectX = Math.round(Math.round(edge.start.x) / 10) * 10;
  const expectY = Math.round(Math.round(edge.start.y) / 10) * 10;

  const guideNodes = _this.nodes.filter(node => _this.currentNodes.find(currentNode => currentNode !== node))
  for (const node of guideNodes) {
    if (node.x === expectX) {
      // vertical guideline
      if (node.y < expectY) {
        _this.guideLine(
          { x: node.x, y: node.y + node.height },
          { x: expectX, y: expectY },
        );
      } else {
        _this.guideLine(
          { x: expectX, y: expectY + node.height },
          { x: node.x, y: node.y },
        );
      }
    }
    if (node.y === expectY) {
      // horizontal guideline
      if (node.x < expectX) {
        _this.guideLine(
          { x: node.x + node.width, y: node.y },
          { x: expectX, y: expectY },
        );
      } else {
        _this.guideLine(
          { x: expectX + node.width, y: expectY },
          { x: node.x, y: node.y },
        );
      }
    }
  }
}

export const nodeDragEnd = (_this) => {
  d3.selectAll("#svg > g.guideline").remove();

  for (const currentNode of _this.currentNodes) {
    currentNode.x = Math.round(Math.round(currentNode.x) / 10) * 10;
    currentNode.y = Math.round(Math.round(currentNode.y) / 10) * 10;
  }
}

export const chartMouseDown = async (_this, event) => {
  if (event.ctrlKey) { return; }
  // Set starting point of selection to where the user clicked
  _this.selectionStartPoint = { x: event.offsetX, y: event.offsetY };
}

export const chartDblClick = async (_this, event) => {
  if (_this.readonly) {
    return;
  }
  _this.$emit("dblclick", { x: event.offsetX, y: event.offsetY });
}

export const chartMouseMove = async (_this, event) => {
  // calc offset of cursor to chart
  const boundingClientRect = event.currentTarget.getBoundingClientRect();
  const actualX = event.pageX - boundingClientRect.left - window.scrollX;
  _this.cursorToChartOffset.x = Math.trunc(actualX);
  const actualY = event.pageY - boundingClientRect.top - window.scrollY;
  _this.cursorToChartOffset.y = Math.trunc(actualY);

  if (_this.connectStart.node) {
    await _this.renderConnections();

    d3.selectAll("#svg .connector").classed("active", true);

    const fromNode = _this.getNodeById(_this.connectStart.node.id);
    const from = {
      ...fromNode.connectorPosition(_this.connectStart.position),
      position: _this.connectStart.position,
      node: fromNode,
    };

    if (_this.hoveredConnector) {
      const toNode = _this.getNodeById(_this.hoveredConnector.node.id);
      const to = {
        ...toNode.connectorPosition(_this.hoveredConnector.position),
        position: _this.hoveredConnector.position,
        node: toNode,
      };

      const line = new PassConnection('tmp', from, to);
      const g = _this.append("g");
      line.render(g, from, to, false);
    } else {
      const to = {
        x: _this.cursorToChartOffset.x,
        y: _this.cursorToChartOffset.y,
      };

      const line = new TmpConnection('tmp', from, to);

      const g = _this.append("g");
      line.render(g, from, to, false);
    }
  }
}

export const chartMouseUp = async (_this) => {
  d3.selectAll("#svg .connector").classed("active", false);
  if (_this.connectStart) {
    _this.connectStart.node = null;
    _this.connectStart.position = null;
  }
  if (_this.selectionStartPoint) {
    _this.selectionStartPoint = null;
  }
}

export const chartMouseWheel = async (_this, event) => {
  if (!event.ctrlKey) { return; }

  event.stopPropagation();
  event.preventDefault();
  const svg = document.getElementById("svg");
  let zoom = parseFloat(svg.style.zoom || 1);
  if (event.deltaY > 0 && zoom === 0.1) {
    return;
  }
  zoom -= event.deltaY / 100 / 10;
  svg.style.zoom = zoom;
}

export const pathMouseDown = async (_this, conn) => {
  d3.event.stopPropagation();
  if (_this.pathClickedOnce) {
    _this.editConnection(conn);
  } else {
    let timer = setTimeout(() => {
      _this.pathClickedOnce = false;
      clearTimeout(timer);
    }, 300);
    _this.pathClickedOnce = true;
  }
  _this.currentNodes = [];
  _this.currentConnections = [ conn ];
}
