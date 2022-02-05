// eslint-disable-next-line
import { Point } from '../Point';
import { lineTo } from '../svg';

export default class Line {
  fromPoint;
  toPoint;
  /** @type { { x: number, y: number }[] } */
  points;
  /** @type { string } */
  lineColor;
  /** @type { string } */
  lineWidth;

  /**
    * @param { Point } fromPoint
    * @param { Point } toPoint
    * @param { string } color
    */
  constructor(fromPoint, toPoint, color) {
    this.fromPoint = fromPoint;
    this.toPoint = toPoint;
    this.points = [];
    this.lineWidth = 1;
    this.lineColor = color | '#000';
  }

  createPath() {
    // Add starting point
    this.points.push({ x: this.fromPoint.x, y: this.fromPoint.y });
    this.points.push(this.fromPoint.offsetPoint);

    // Add middle
    this.fromPoint.connect(this.points, this.toPoint);

    // Add end
    this.points.push(this.toPoint.offsetPoint);
    this.points.push({ x: this.toPoint.x, y: this.toPoint.y });

    // Create lines
    const lines = [];
    for (let i = 0; i < this.points.length - 1; i++) {
      const from = this.points[i];
      const to = this.points[i + 1];
      lines.push({ from, to });
    }
    return lines;
  }

  renderPath(g) {
    const paths = [];
    for (let i = 0; i < this.points.length - 1; i++) {
      const from = this.points[i];
      const to = this.points[i + 1];
      const rendered = this.renderPoint(g, from, to);
      paths.push(rendered);
    }
    return paths;
  }

  renderPoint(g, from, to) {
    return this.lineTo(g, from, to);
  }

  line(g, from, to) {
    lineTo(g, from, to, this.lineWidth, this.lineColor);
    return lineTo(g, from, to, 10, 'transparent');
  }
}
