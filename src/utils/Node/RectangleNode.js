import Node from './Node';
import { borderColor } from './helpers';
import { roundTo20 } from "../math";

export default class RectangleNode extends Node {
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
    super.render(g, isSelected);

    g.append("rect").attr("class", "body")
     .style("width", this.width + "px")
     .style("fill", "white")
     .style("stroke-width", "1px")
     .attr("x", this.x)
     .attr("y", this.y)
     .style("height", roundTo20(this.height) + "px")
     .attr("stroke", borderColor(isSelected));

    this.renderText(g);
  }
}
