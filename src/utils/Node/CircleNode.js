import Node from './Node';
import { borderColor } from './helpers';

export default class CircleNode extends Node {
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
    g.append("ellipse").attr("class", "body")
     .attr("cx", this.x + this.width / 2)
     .attr("cy", this.y + this.height / 2)
     .attr("rx", this.width / 2)
     .attr("ry", this.height / 2)
     .style("fill", "white")
     .style("stroke-width", "1px")
     .classed(this.type, true)
     .attr("stroke", borderColor(isSelected));

    this.renderText(g);
  }
}
