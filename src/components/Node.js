import * as d3 from "d3";
import { roundTo20 } from "../utils/math";

const borderColor = (isSelected) => isSelected ? '#666666' : '#bbbbbb';

class AbstractNode {
  id;
  width;
  height;
  x;
  y;
  text;
  type;

  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = 120;
    this.height = 80;
  }

  // eslint-disable-next-line
  render(g, isSelected) { }
}

export class StartNode extends AbstractNode {
  constructor(id, x, y) {
    super(id, x, y);
    this.name = "Start";
    this.type = "start";
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

// For now the same as StartNode
export class EndNode extends StartNode {
  constructor(id, x, y) {
    super(id, x, y);
    this.name = "End";
    this.type = "end";
  }

  render(g, isSelected) { super.render(g, isSelected) }
}

export class OperationNode extends AbstractNode {
  constructor(id, x, y, name) {
    super(id, x, y);
    this.name = name;
    this.type = "operation";
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

export class DesicionNode extends AbstractNode {
  constructor(id, x, y, name) {
    super(id, x, y);
    this.name = name;
    this.type = "desicion";
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
