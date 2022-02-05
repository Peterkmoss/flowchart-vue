/* eslint-disable no-console */

import Point from './Point';
import { OFFSET } from '..';

export class BottomPoint extends Point {
  constructor(x, y, node) {
    super(x, y, node);
    this.offsetPoint = { x: this.x, y: this.y + OFFSET };
  }

  /**
    * @param { Point[] } acc
    * @param { Point } toPoint
    */
  connect(acc, toPoint) {
    super.connect(acc, toPoint);

    toPoint.bottom(acc, this);
  }

  /**
    * @param { { x: number, y: number }[] } acc
    * @param { Point } toPoint
    */
  bottom(acc, fromPoint) {
    this.setupConnection(fromPoint);

    const rightOfThis = Math.max(this.node.x + this.node.width + OFFSET, this.connectStart.x);
    const leftOfThis = Math.min(this.node.x - OFFSET, this.connectStart.x);
    const leftOfFrom = Math.min(this.connectStart.x, fromPoint.node.x - OFFSET);
    const rightOfFrom = Math.max(fromPoint.node.x + fromPoint.node.width + OFFSET, this.connectStart.x);

    const direction = this._getDirection();
    switch (direction) {
      case 'd':
      case 'rd': {
        if (this.connectStart.x > fromPoint.node.x - OFFSET) {
          acc.push({ x: leftOfFrom, y: this.connectEnd.y });
          acc.push({ x: leftOfFrom, y: this.middle.y });
          acc.push({ x: this.connectStart.x, y: this.middle.y });
        } else {
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      }
      case 'ld': {
        if (this.connectStart.x < fromPoint.node.x + fromPoint.node.width + OFFSET) {
          acc.push({ x: rightOfFrom, y: this.connectEnd.y });
          acc.push({ x: rightOfFrom, y: this.middle.y });
          acc.push({ x: this.connectStart.x, y: this.middle.y });
        } else {
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      }
      case 'l': {
        acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        return;
      }
      case 'r': {
        acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        return;
      }
      case 'u':
      case 'ru': {
        if (this.node.x + this.node.width + OFFSET > this.connectEnd.x) {
          acc.push({ x: rightOfThis, y: this.connectEnd.y });
          acc.push({ x: rightOfThis, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        }
        return;
      }
      case 'lu': {
        if (this.node.x - OFFSET < this.connectEnd.x) {
          acc.push({ x: leftOfThis, y: this.connectEnd.y });
          acc.push({ x: leftOfThis, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
        }
        return;
      }
    }
  }

  /**
    * @param { { x: number, y: number }[] } acc
    * @param { Point } toPoint
    */
  left(acc, fromPoint) {
    this.setupConnection(fromPoint);

    const belowFrom = Math.max(this.connectStart.y, fromPoint.node.y + fromPoint.node.height + OFFSET);
    const leftOfThis = Math.min(this.node.x - OFFSET, this.connectStart.x);
    const rightOfThis = Math.max(this.middle.x + OFFSET, this.connectStart.x);

    const direction = this._getDirection();
    switch (direction) {
      case 'l':
      case 'lu': {
        if (this.connectEnd.x > this.node.x - OFFSET) {
          acc.push({ x: leftOfThis, y: this.connectEnd.y });
          acc.push({ x: leftOfThis, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectEnd.x, y: belowFrom });
          acc.push({ x: this.connectStart.x, y: belowFrom });
        }
        return;
      }
      case 'ld': {
        if (this.connectStart.y + OFFSET > fromPoint.node.y - OFFSET) {
          acc.push({ x: this.connectEnd.x, y: belowFrom });
          if (this.connectStart.x <= fromPoint.node.x + fromPoint.node.width + OFFSET) {
            acc.push({ x: fromPoint.node.x + fromPoint.node.width + OFFSET, y: belowFrom });
            acc.push({ x: fromPoint.node.x + fromPoint.node.width + OFFSET, y: this.connectStart.y });
            return;
          }
          acc.push({ x: this.connectStart.x, y: belowFrom });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.middle.y });
          acc.push({ x: this.connectStart.x, y: this.middle.y });
        }
        return;
      }
      case 'r':
      case 'rd': {
        acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        return;
      }
      case 'u':
      case 'ru': {
        if (this.connectEnd.x > this.node.x + this.node.width + OFFSET * 2) {
          acc.push({ x: rightOfThis, y: this.connectEnd.y });
          acc.push({ x: rightOfThis, y: this.connectStart.y });
        } else if (this.connectEnd.x >= this.node.x) {
          if (this.connectEnd.y > this.node.y - OFFSET) {
            acc.push({ x: this.connectEnd.x, y: this.node.y - OFFSET });
            acc.push({ x: leftOfThis, y: this.node.y - OFFSET });
            acc.push({ x: leftOfThis, y: this.connectStart.y });
          } else {
            acc.push({ x: leftOfThis, y: this.connectEnd.y });
            acc.push({ x: leftOfThis, y: this.connectStart.y });
          }
        } else {
          acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        }
        return;
      }
      case 'd': {
        acc.push({ x: this.connectEnd.x, y: this.middle.y });
        acc.push({ x: this.connectStart.x, y: this.middle.y });
        return;
      }
    }
  }

  /**
    * @param { { x: number, y: number }[] } acc
    * @param { Point } toPoint
    */
  right(acc, fromPoint) {
    this.setupConnection(fromPoint);

    const direction = this._getDirection();
    switch (direction) {
      case 'l':
      case 'ld': {
        acc.push({ x: this.connectStart.x, y: this.connectEnd.y });
        return;
      }
      case 'lu': {
        if (this.fromPointBox.r > this.pointBox.l) {
          if (this.connectEnd.y > this.pointBox.t) {
            acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
            acc.push({ x: this.pointBox.r, y: this.pointBox.t });
            acc.push({ x: this.pointBox.r, y: this.connectStart.y });
          } else {
            acc.push({ x: this.pointBox.r, y: this.connectEnd.y });
            acc.push({ x: this.pointBox.r, y: this.connectStart.y });
          }
        } else {
          acc.push({ x: Math.min(this.middle.x, this.pointBox.l), y: this.connectEnd.y });
          acc.push({ x: Math.min(this.middle.x, this.pointBox.l), y: this.connectStart.y });
        }
        return;
      }
      case 'r':
      case 'rd': {
        if (this.connectStart.y > this.fromPointBox.t) {
          acc.push({ x: this.connectEnd.x, y: this.fromPointBox.t });
          acc.push({ x: this.middle.x, y: this.fromPointBox.t });
          acc.push({ x: this.middle.x, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.middle.y });
          acc.push({ x: this.connectStart.x, y: this.middle.y });
        }
        return;
      }
      case 'u':
      case 'ru': {
        if (this.connectStart.y > this.fromPointBox.b) {
          if (this.connectEnd.x < this.pointBox.r) {
            acc.push({ x: this.pointBox.r, y: this.connectEnd.y });
            acc.push({ x: this.pointBox.r, y: this.connectStart.y });
          } else {
            acc.push({ x: this.connectEnd.x, y: this.connectStart.y });
          }
        } else {
          acc.push({ x: this.connectEnd.x, y: this.fromPointBox.b });
          acc.push({ x: this.middle.x, y: this.fromPointBox.b });
          acc.push({ x: this.middle.x, y: this.connectStart.y });
        }
        return;
      }
      case 'd': {
        acc.push({ x: this.connectEnd.x, y: this.middle.y });
        acc.push({ x: this.connectStart.x, y: this.middle.y });
        return;
      }
    }
  }

  /**
    * @param { { x: number, y: number }[] } acc
    * @param { Point } toPoint
    */
  top(acc, fromPoint) {
    this.setupConnection(fromPoint);

    const direction = this._getDirection();
    switch (direction) {
      case 'l':
      case 'ld': {
        acc.push({ x: this.connectEnd.x, y: this.middle.y });
        acc.push({ x: this.connectStart.x, y: this.middle.y });
        return;
      }
      case 'u':
      case 'lu': {
        if (this.fromPointBox.r > this.pointBox.l) {
          if (this.connectEnd.y > this.pointBox.t) {
            acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
            acc.push({ x: this.pointBox.r, y: this.pointBox.t });
            acc.push({ x: this.pointBox.r, y: this.connectStart.y });
          } else {
            acc.push({ x: this.pointBox.r, y: this.connectEnd.y });
            acc.push({ x: this.pointBox.r, y: this.connectStart.y });
          }
        } else {
          acc.push({ x: Math.min(this.middle.x, this.pointBox.l), y: this.connectEnd.y });
          acc.push({ x: Math.min(this.middle.x, this.pointBox.l), y: this.connectStart.y });
        }
        return;
      }
      case 'r':
      case 'rd': {
        if (this.connectStart.y > this.fromPointBox.t) {
          acc.push({ x: this.connectEnd.x, y: this.fromPointBox.t });
          acc.push({ x: this.middle.x, y: this.fromPointBox.t });
          acc.push({ x: this.middle.x, y: this.connectStart.y });
        } else {
          acc.push({ x: this.connectEnd.x, y: this.middle.y });
          acc.push({ x: this.connectStart.x, y: this.middle.y });
        }
        return;
      }
      case 'ru': {
        if (this.pointBox.r > this.fromPointBox.l) {
          if (this.connectEnd.y > this.pointBox.t) {
            acc.push({ x: this.connectEnd.x, y: this.pointBox.t });
            acc.push({ x: this.pointBox.l, y: this.pointBox.t });
            acc.push({ x: this.pointBox.l, y: this.connectStart.y });
          } else {
            acc.push({ x: this.pointBox.l, y: this.connectEnd.y });
            acc.push({ x: this.pointBox.l, y: this.connectStart.y });
          }
        } else {
          acc.push({ x: this.middle.x, y: this.connectEnd.y });
          acc.push({ x: this.middle.x, y: this.connectStart.y });
        }
        return;
      }
      case 'd': {
        acc.push({ x: this.connectEnd.x, y: this.middle.y });
        acc.push({ x: this.connectStart.x, y: this.middle.y });
        return;
      }
    }
  }
}
