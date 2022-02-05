import Line from './Line'

export default class DashedLine extends Line {
  constructor(fromPoint, toPoint, color) {
    super(fromPoint, toPoint, color);
  }

  renderPoint() {}
}

