// eslint-disable-next-line
import { Point } from './Point';
import { lineTo, arrowTo } from './svg';

export class Line {
  fromPoint;
  toPoint;
  /** @type { Point[] } */
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
    this.lineWidth = 2;
    this.lineColor = color | '#000';
  }

  createPath() {
    // Add starting point
    this.points.push(this.fromPoint);
    this.points.push(this.fromPoint.offsetPoint);

    // Add middle
    this.fromPoint.connect(this.points, this.toPoint);

    // Add end
    this.points.push(this.toPoint.offsetPoint);
    this.points.push(this.toPoint);

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
    return lineTo(g, from, to, this.lineWidth, this.lineColor);
  }
}

export class DashedLine extends Line {
  constructor(fromPoint, toPoint, color) {
    super(fromPoint, toPoint, color);
  }

  renderPath() {}
  renderPoint() {}
}

export class ArrowLine extends Line {
  constructor(fromPoint, toPoint, color) {
    super(fromPoint, toPoint, color);
    this.lineColor = color;
  }

  renderPath(g) {
    return super.renderPath(g);
  }
  renderPoint(g, from, to) {
    const last = this.points.indexOf(to) === this.points.length - 1
    if (last) {
      return arrowTo(g, from, to, this.lineWidth, this.lineColor);
    }
    return lineTo(g, from, to, this.lineWidth, this.lineColor);
  }
}

export const addVerticalLine = (points, center, second, penult) => {
  points.push({ x: center, y: second.y });
  points.push({ x: center, y: penult.y });
};

export const addVerticalLeftLine = (points, pos, second, penult) => {
  addVerticalLine(points, pos.x - 80, second, penult);
};

export const addVerticalRightLine = (points, pos, second, penult) => {
  addVerticalLine(points, pos.x + 80, second, penult);
};

export const addHorizontalLine = (points, center, second, penult) => {
  points.push({ x: second.x, y: center });
  points.push({ x: penult.x, y: center });
};

export const addHorizontalTopLine = (points, pos, second, penult) => {
  addHorizontalLine(points, pos.y - 50, second, penult);
};

export const addHorizontalBottomLine = (points, pos, second, penult) => {
  addHorizontalLine(points, pos.y + 50, second, penult);
};

export const addSecondXPenultY = (points, second, penult) => {
  points.push({ x: second.x, y: penult.y });
};

export const addPenultXSecondY = (points, second, penult) => {
  points.push({ x: penult.x, y: second.y });
};
