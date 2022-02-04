import * as d3 from "d3";

export const dragStart = (_this, node) => {
  // handle mousedown
  let isNotCurrentNode = !_this.currentNodes.find(item => item === node);
  if (isNotCurrentNode) {
    _this.currentConnections.splice(0, _this.currentConnections.length);
    _this.currentNodes.splice(0, _this.currentNodes.length);
    _this.currentNodes.push(node);
  }

  if (_this.clickedOnce) {
    _this.currentNodes.splice(0, _this.currentNodes.length);
    _this.editNode(node);
  } else {
    let timer = setTimeout(function () {
      _this.clickedOnce = false;
      clearTimeout(timer);
    }, 300);
    _this.clickedOnce = true;
  }
}

export const dragMove = (_this) => {
  if (_this.readonly) {
    return;
  }

  let zoom = parseFloat(document.getElementById("svg").style.zoom || 1);
  for (let currentNode of _this.currentNodes) {
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

  d3.selectAll("#svg > g.guideline").remove();
  let edge = _this.getCurrentNodesEdge();
  let expectX = Math.round(Math.round(edge.start.x) / 10) * 10;
  let expectY = Math.round(Math.round(edge.start.y) / 10) * 10;
  _this.nodes.forEach(item => {
    if (
      _this.currentNodes.filter(currentNode => currentNode === item)
      .length === 0
    ) {
      if (item.x === expectX) {
        // vertical guideline
        if (item.y < expectY) {
          _this.guideLineTo(
            item.x,
            item.y + item.height,
            expectX,
            expectY
          );
        } else {
          _this.guideLineTo(
            expectX,
            expectY + item.height,
            item.x,
            item.y
          );
        }
      }
      if (item.y === expectY) {
        // horizontal guideline
        if (item.x < expectX) {
          _this.guideLineTo(
            item.x + item.width,
            item.y,
            expectX,
            expectY
          );
        } else {
          _this.guideLineTo(
            expectX + item.width,
            expectY,
            item.x,
            item.y
          );
        }
      }
    }
  });
}

export const dragEnd = (_this) => {
  d3.selectAll("#svg > g.guideline").remove();
  for (let currentNode of _this.currentNodes) {
    currentNode.x = Math.round(Math.round(currentNode.x) / 10) * 10;
    currentNode.y = Math.round(Math.round(currentNode.y) / 10) * 10;
  }
}

export const chartMouseDown = async (_this, event) => {
  if (event.ctrlKey) {
    return;
  }
  _this.selectionInfo = { x: event.offsetX, y: event.offsetY };
}

export const chartDblClick = async (_this, event) => {
  if (_this.readonly) {
    return;
  }
  _this.$emit("dblclick", { x: event.offsetX, y: event.offsetY });
}

export const chartMouseMove = async (_this, event) => {
  // calc offset of cursor to chart
  let boundingClientRect = event.currentTarget.getBoundingClientRect();
  let actualX = event.pageX - boundingClientRect.left - window.scrollX;
  _this.cursorToChartOffset.x = Math.trunc(actualX);
  let actualY = event.pageY - boundingClientRect.top - window.scrollY;
  _this.cursorToChartOffset.y = Math.trunc(actualY);

  if (_this.connectingInfo.source) {
    await _this.renderConnections();

    d3.selectAll("#svg .connector").classed("active", true);

    let sourceOffset = _this.getNodeConnectorOffset(
      _this.connectingInfo.source.id,
      _this.connectingInfo.sourcePosition
    );
    let destinationPosition = _this.hoveredConnector
      ? _this.hoveredConnector.position
      : null;
    _this.arrowTo(
      sourceOffset.x,
      sourceOffset.y,
      _this.cursorToChartOffset.x,
      _this.cursorToChartOffset.y,
      _this.connectingInfo.sourcePosition,
      destinationPosition
    );
  }
}

export const chartMouseUp = async (_this) => {
  if (_this.connectingInfo.source) {
    if (_this.hoveredConnector) {
      if (_this.connectingInfo.source.id !== _this.hoveredConnector.node.id) {
        // Node can't connect to itself
        let tempId = +new Date();
        let conn = {
          source: {
            id: _this.connectingInfo.source.id,
            position: _this.connectingInfo.sourcePosition,
          },
          destination: {
            id: _this.hoveredConnector.node.id,
            position: _this.hoveredConnector.position,
          },
          id: tempId,
          type: "pass",
          name: "Pass",
        };
        _this.connections.push(conn);
        _this.$emit("connect", conn, _this.nodes, _this.connections);
      }
    }
    _this.connectingInfo.source = null;
    _this.connectingInfo.sourcePosition = null;
  }
  if (_this.selectionInfo) {
    _this.selectionInfo = null;
  }
}

export const chartMouseWheel = async (_this, event) => {
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
  _this.currentNodes.splice(0, _this.currentNodes.length);
  _this.currentConnections.splice(0, _this.currentConnections.length);
  _this.currentConnections.push(conn);
}
