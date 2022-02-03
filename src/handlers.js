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
