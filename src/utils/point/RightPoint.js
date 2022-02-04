import Point from './Point';
import { OFFSET } from '../svg';
import { TopPoint } from './TopPoint';
import { BottomPoint } from './BottomPoint';
import { LeftPoint } from './LeftPoint';
import * as path from '../path';

export class RightPoint extends Point {
  constructor(x, y) {
    super(x, y);
    this.offsetPoint = { x: this.x + OFFSET, y: this.y };
  }

  connectDown(acc, toPoint) {
    super.connectDown(acc, toPoint);

    if (toPoint instanceof TopPoint) {
      if (this.connectStart.y > this.centerY) { 
        this.connectStart.y = this.centerY; 
      }
      if (this.connectStart.y < this.centerY) { 
        this.connectEnd.y = this.centerY; 
      }
    }
  }

  connectLeft(acc, toPoint) {
    super.connectLeft(acc, toPoint);

    if (toPoint instanceof RightPoint) {
      if (this.connectStart.x < this.centerX) {
        this.connectStart.x = this.centerX;
      }
      if (this.connectEnd.x > this.centerX) {
        this.connectEnd.x = this.centerX;
      }
    }
  }

  connectRight(acc, toPoint) {
    super.connectRight(acc, toPoint);

    if (this.connectStart.x > this.centerX) {
      this.connectStart.x = this.centerX;
    }
    if (this.connectEnd.x < this.centerX) {
      this.connectEnd.x = this.centerX;
    }
  }

  connectUp(acc, toPoint) {
    super.connectUp(acc, toPoint);

    if (toPoint instanceof BottomPoint) {
      if (this.connectStart.y < this.centerY) {
        this.connectStart.y = this.centerY;
      }
      if (this.connectEnd.y > this.centerY) {
        this.connectEnd.y = this.centerY;
      }
    }
  }

  connectLeftUp(acc, toPoint) {
    super.connectLeftUp(acc, toPoint);

    if (toPoint instanceof TopPoint || toPoint instanceof RightPoint) {
      return path.addSecondXPenultY(acc, this.connectStart, this.connectEnd);
    }
    if (toPoint instanceof LeftPoint || toPoint instanceof BottomPoint) {
      return path.addHorizontalLine(acc, this.centerY, this.connectStart, this.connectEnd);
    }
  }
}
