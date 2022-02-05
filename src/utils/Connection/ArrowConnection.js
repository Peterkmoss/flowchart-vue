import { ArrowLine } from '../Line';
import { Builder } from '../Point';

import AbstractConnection from './AbstractConnection';

export default class ArrowConnection extends AbstractConnection {
  constructor(id, source, destination) {
    super(id, source, destination);
  }

  /**
    * @param { any } g
    * @param { { x: number, y: number, node: Node, position: string } } from
    * @param { { x: number, y: number, node: Node, position: string } } to
    * @param { boolean } isSelected
    */
  render(g, from, to, isSelected) {
    super.render(g, from, to, isSelected);

    const fromPoint = new Builder(from.x, from.y, from.node)
      .fromPosition(from.position)
      .build();

    const toPoint = new Builder(to.x, to.y, to.node)
      .fromPosition(to.position)
      .build();
    
    const color = this.getColor(isSelected);
    const line = new ArrowLine(fromPoint, toPoint, color);

    const lines = line.createPath();
    const paths = line.renderPath(g);

    return { lines, paths };
  }
}
