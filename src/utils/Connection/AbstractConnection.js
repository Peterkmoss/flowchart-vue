/* eslint-disable no-unused-vars */
import { Node } from "../Node";

export default class AbstractConnection {
  id;
  from;
  to;

  /**
    * @param { any } id
    * @param { { id: any, position: string } } from
    * @param { { id: any, position: string } } to
    */
  constructor(id, from, to) {
    this.id = id;
    this.from = from;
    this.to = to;
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
