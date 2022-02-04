// eslint-disable-next-line
import { Point } from './point';

export class Line {
  fromPoint;
  toPoint;
  points;

  /**
    * @param { Point } fromPoint
    * @param { Point } toPoint
    */
  constructor(fromPoint, toPoint) {
    this.fromPoint = fromPoint;
    this.toPoint = toPoint;
    this.points = [];
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

    return this.points;
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
