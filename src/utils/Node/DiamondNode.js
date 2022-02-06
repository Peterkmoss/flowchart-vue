import Node from './Node';
import { borderColor } from './helpers';

export default class DiamondNode extends Node {
  /**
    * @param { any } id
    * @param { number } x
    * @param { number } y
    * @param { string } text
    */
  constructor(id, x, y, text) {
    super(id, x, y, text);
  }

  render(g, isSelected) {
    super.render(g, isSelected)
    g.append("polygon").attr("class", "body")
     .attr("points", [
       `${this.x}, ${this.y + this.height / 2}`,
       `${this.x + this.width / 2}, ${this.y}`,
       `${this.x + this.width}, ${this.y + this.height / 2}`,
       `${this.x + this.width / 2}, ${this.y + this.height}`,
       `${this.x}, ${this.y + this.height / 2}`,
     ].join(' '))
     .style("fill", "white")
     .style("stroke-width", "1px")
     .classed(this.type, true)
     .attr("stroke", borderColor(isSelected));

    this.renderText(g);
  }

  renderText(g) {
    super.renderText(g, this.width - 2 * 15);
  }
}
