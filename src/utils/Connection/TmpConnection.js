import { Line } from '../Line';
import { Builder } from '../Point';

import AbstractConnection from './AbstractConnection';

export default class TmpConnection extends AbstractConnection {
  constructor(id, from, to) {
    super(id, from, to);
  }

  /**
    * @param { any } g
    * @param { boolean } isSelected
    */
  render(g, from, to, isSelected) {
    super.render(g, isSelected);

    const fromPoint = new Builder(from.x, from.y, from.node)
      .fromPosition(from.position)
      .build();

    const toPoint = new Builder(to.x, to.y, null)
      .tmp()
      .build();
    
    const line = new Line(fromPoint, toPoint);

    const lines = line.createPath();
    const paths = line.renderPath(g);

    return { lines, paths };
  }
}
