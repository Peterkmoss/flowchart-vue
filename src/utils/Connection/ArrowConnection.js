import { ArrowLine } from '../Line';
import { Builder } from '../Point';

import AbstractConnection from './AbstractConnection';

export default class ArrowConnection extends AbstractConnection {
  constructor(id, source, destination) {
    super(id, source, destination);
  }

  render(g, from, to, isSelected) {
    super.render(g, from, to, isSelected);

    const fromPoint = new Builder().setX(from.x).setY(from.y).fromPosition(from.position).build();
    const toPoint = new Builder().setX(to.x).setY(to.y).fromPosition(to.position).build();
    
    const color = this.getColor(isSelected);
    const line = new ArrowLine(fromPoint, toPoint, color);
    const lines = line.createPath();

    const paths = line.renderPath(g);
    return { lines, paths };
  }
}
