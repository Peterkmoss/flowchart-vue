/* eslint-disable */
import * as d3 from "d3";
import { roundTo20 } from "../math";
import Connector from '../Connector';
import DisabledConnector from '../DisabledConnector';

const borderColor = (isSelected) => isSelected ? '#666666' : '#bbbbbb';

const halfWidth = (node) => node.width / 2;
const halfHeight = (node) => node.height / 2;
const positionMap = (node) => ({
  top: { x: node.x + halfWidth(node), y: node.y },
  left: { x: node.x, y: node.y + halfHeight(node) },
  bottom: { x: node.x + halfWidth(node), y: node.y + node.height },
  right: { x: node.x + node.width, y: node.y + halfHeight(node) },
});

const createBoundaryBox = (node) => [
  { x: node.x, y: node.y },
  { x: node.x + node.width, y: node.y + node.height },
];

export class Node {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = 120;
    this.height = 80;
  }

  // eslint-disable-next-line
  render(g, isSelected) { }

  /**
    * @param { 'top' | 'left' | 'right' | 'bottom' } position
    */
  connectorPosition(position) {
    return positionMap(this)[position];
  }

  get connectorPositions() {
    return positionMap(this);
  }

  get boundaryBox() {
    return createBoundaryBox(this);
  }

  renderConnectors(g, flowChart) {
    const connectors = [];
    for (const [key, position] of Object.entries(this.connectorPositions)) {
      connectors.push(new Connector(g, key, position, this, flowChart));
    }
    g.on("mouseover", () => {
      connectors.forEach(conn => conn.setActive());
    }).on("mouseout", () => {
      connectors.forEach(conn => conn.setInactive());
    });
  }
}

export class StartNode extends Node {
  constructor(id, x, y) {
    super(id, x, y);
    this.name = "Start";
  }

  render(g, isSelected) {
    super.render(g, isSelected);

    const body = g.append("rect").attr("class", "body");
    body.style("width", this.width + "px");
    body.style("fill", "white");
    body.style("stroke-width", "1px");
    body.attr("x", this.x)
    body.attr("y", this.y)
    body.attr("rx", 30);
    body.style("height", roundTo20(this.height) + "px");
    body.attr("stroke", borderColor(isSelected));
    renderText(this, g)
  }
}

export class EndNode extends StartNode {
  constructor(id, x, y) {
    super(id, x, y);
    this.name = "End";
  }

  renderConnectors(g, flowChart) {
    const connectors = [];
    for (const [key, position] of Object.entries(this.connectorPositions)) {
      connectors.push(new DisabledConnector(g, key, position, this, flowChart));
    }
    g.on("mouseover", () => {
      connectors.forEach(conn => conn.setActive());
    }).on("mouseout", () => {
      connectors.forEach(conn => conn.setInactive());
    });
  }
}

export class OperationNode extends Node {
  constructor(id, x, y, name) {
    super(id, x, y);
    this.name = name;
  }

  render(g, isSelected) { 
    super.render(g, isSelected) 

    g.append("rect").attr("class", "body")
      .style("width", this.width + "px")
      .style("fill", "white")
      .style("stroke-width", "1px")
      .attr("x", this.x)
      .attr("y", this.y)
      .style("height", roundTo20(this.height) + "px")
      .attr("stroke", borderColor(isSelected));
    renderText(this, g)
  }
}

export class DecisionNode extends Node {
  constructor(id, x, y, name) {
    super(id, x, y);
    this.name = name;
  }

  render(g, isSelected) {
    super.render(g, isSelected)
    const body = g.append("polygon").attr("class", "body");
    body.attr("points", [
      `${this.x}, ${this.y + this.height / 2}`,
      `${this.x + this.width / 2}, ${this.y}`,
      `${this.x + this.width}, ${this.y + this.height / 2}`,
      `${this.x + this.width / 2}, ${this.y + this.height}`,
      `${this.x}, ${this.y + this.height / 2}`,
    ].join(' '));
    body.style("fill", "white");
    body.style("stroke-width", "1px");
    body.classed(this.type, true);
    body.attr("stroke", borderColor(isSelected));
    renderText(this, g)
  }
}

const renderText = (node, g) => {
  g.append("text")
    .attr("x", node.x + node.width / 2)
    .attr("y", node.y + 5 + roundTo20(node.height) / 2)
    .attr("class", "unselectable")
    .attr("text-anchor", "middle")
    .text(function () { return node.name; })
    .each(function wrap() {
      let self = d3.select(this);
      let textLength = self.node().getComputedTextLength();
      let text = self.text();

      while (textLength > node.width - 2 * 4 && text.length > 0) {
        text = text.slice(0, -1);
        self.text(text + "...");
        textLength = self.node().getComputedTextLength();
      }
    });
}
