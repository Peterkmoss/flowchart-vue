import * as d3 from "d3";
import Connector from '../Connector';
import { roundTo20 } from "../math";
import { positionMap, createBoundaryBox } from './helpers';

export default class Node {
  /** @type { any } */
  #id;
  /** @type { number } */
  x;
  /** @type { number } */
  y;
  /** @type { number } */
  width;
  /** @type { number } */
  height;
  /** @type { string } */
  text;

  /**
    * @param { any } id
    * @param { number } x
    * @param { number } y
    * @param { string } text
    */
  constructor(id, x, y, text) {
    this.#id = id;
    this.x = x;
    this.y = y;
    this.width = 120;
    this.height = 80;
    this.text = text || 'Text';
  }

  get id() {
    return this.#id;
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

  renderText(g, maxWidth = this.width - 2 * 4) { 
    const _this = this;

    g.append("text")
      .attr("x", this.x + this.width / 2)
      .attr("y", this.y + 5 + roundTo20(this.height) / 2)
      .attr("class", "unselectable")
      .attr("text-anchor", "middle")
      .text(() => { return this.text; })
      .each(function() { _this.wrapText(this, maxWidth); });
  }

  wrapText(_this, maxWidth) {
    const node = d3.select(_this);
    let textLength = node.node().getComputedTextLength();
    let text = node.text();

    while (textLength > maxWidth && text.length > 0) {
      text = text.slice(0, -1);
      node.text(text + "...");
      textLength = node.node().getComputedTextLength();
    }
  }
}
