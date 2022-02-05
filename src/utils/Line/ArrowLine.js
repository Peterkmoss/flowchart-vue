import Line from './Line'
import { lineTo, arrowTo } from '../svg';

export default class ArrowLine extends Line {
  constructor(fromPoint, toPoint, color) {
    super(fromPoint, toPoint, color);
    this.lineColor = color;
  }

  renderPoint(g, from, to) {
    const last = this.points.indexOf(to) === this.points.length - 1
    if (last) {
      return arrowTo(g, from, to, this.lineWidth, this.lineColor);
    }
    return lineTo(g, from, to, this.lineWidth, this.lineColor);
  }
}
