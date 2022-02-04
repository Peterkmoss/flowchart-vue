import Point from './Point';
import { OFFSET } from '../svg';
import { LeftPoint } from './LeftPoint';
import { RightPoint } from './RightPoint';

export class BottomPoint extends Point {
  constructor(x, y) {
    super(x, y);
    this.offsetPoint = { x: this.x, y: this.y + OFFSET };
  }

  connectDown(acc, toPoint) {
    super.connectDown(acc, toPoint);

    if (this.connectStart.y > this.centerY) { 
      this.connectStart.y = this.centerY; 
    }
    if (this.connectStart.y < this.centerY) { 
      this.connectEnd.y = this.centerY; 
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

    if (toPoint instanceof LeftPoint) {
      if (this.connectStart.x > this.centerX) {
        this.connectStart.x = this.centerX;
      }
      if (this.connectEnd.x < this.centerX) {
        this.connectEnd.x = this.centerX;
      }
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
}
