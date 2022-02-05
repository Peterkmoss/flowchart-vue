import Line from './Line'
import { arrowTo } from '../svg';

export default class ArrowLine extends Line {
  constructor(fromPoint, toPoint, color) {
    super(fromPoint, toPoint, color);
    this.lineColor = color;
  }

  renderPoint(g, from, to) {
    const last = this.points.indexOf(to) === this.points.length - 1
    if (last) {
      return this.arrow(g, from, to);
    }
    return this.line(g, from, to);
  }

  arrow(g, from, to) {
    arrowTo(g, from, to, this.lineWidth, this.lineColor);
    return arrowTo(g, from, to, 5, 'transparent');
  }
}
