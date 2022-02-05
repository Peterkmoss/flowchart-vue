/* eslint-disable no-unused-vars */
import { Node } from "../Node";

export default class AbstractConnection {
  id;
  source;
  destination;

  constructor(id, source, destination) {
    this.id = id;
    this.source = source;
    this.destination = destination;
  }

  getColor() {
    return 'black';
  }

  /**
    * @param { any } g
    * @param { { x: number, y: number, node: Node, position: string } } from
    * @param { { x: number, y: number, node: Node, position: string } } to
    * @param { boolean } isSelected
    */
  render(g, from, to, isSelected) {
    g.classed("connection", true);
  }
}
