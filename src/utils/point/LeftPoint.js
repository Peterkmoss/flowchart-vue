import Point from './Point';
import { OFFSET } from '../svg';
import { TopPoint } from './TopPoint';
import { BottomPoint } from './BottomPoint';
import { RightPoint } from './RightPoint';
import * as path from '../path';

export class LeftPoint extends Point {
  constructor(x, y) {
    super(x, y);
    this.offsetPoint = { x: this.x - OFFSET, y: this.y };
  }

  /**
    * @param { any[] } acc
    * @param { Point } toPoint
    */
  connect(acc, toPoint) {
    return super.connect(acc, toPoint);
  }

  connectDown(acc, toPoint) {
    super.connectDown(acc, toPoint);

    if (toPoint instanceof RightPoint) {
      path.addHorizontalLine(acc, this.centerY, this.connectStart, this.connectEnd);
    }
    if (toPoint instanceof TopPoint) {
      if (this.connectStart.y > this.centerY) { 
        this.connectStart.y = this.centerY; 
      }
      if (this.connectStart.y < this.centerY) { 
        this.connectEnd.y = this.centerY; 
      }
      path.addSecondXPenultY(acc, this.connectStart, this.connectEnd);
    }
    if (toPoint instanceof BottomPoint) {
      path.addVerticalLeftLine(acc, this, this.connectStart, this.connectEnd);
    }
  }

  connectRightDown(acc, toPoint) {
    super.connectRightDown(acc, toPoint);

    if (toPoint instanceof RightPoint) {
      return path.addHorizontalLine(acc, this.centerY, this.connectStart, this.connectEnd);
    }
    if (toPoint instanceof TopPoint) {
      return path.addHorizontalLine(acc, this.centerY, this.connectStart, this.connectEnd);
    }
    if (toPoint instanceof LeftPoint) {
      return path.addSecondXPenultY(acc, this.connectStart, this.connectEnd);
    }
    if (toPoint instanceof BottomPoint) {
      return path.addSecondXPenultY(acc, this.connectStart, this.connectEnd);
    }
  }

  connectLeftDown(acc, toPoint) {
    super.connectRightDown(acc, toPoint);

    if (toPoint instanceof LeftPoint || toPoint instanceof TopPoint) {
      return path.addPenultXSecondY(acc, this.connectStart, this.connectEnd);
    }
    if (toPoint instanceof RightPoint) {
      return path.addVerticalLine(acc, this.centerX, this.connectStart, this.connectEnd);
    }
    if (toPoint instanceof BottomPoint) {
      return path.addSecondXPenultY(acc, this.connectStart, this.connectEnd);
    }
  }

  connectLeft(acc, toPoint) {
    super.connectLeft(acc, toPoint);

    if (this.connectStart.x < this.centerX) {
      this.connectStart.x = this.centerX;
    }
    if (this.connectEnd.x > this.centerX) {
      this.connectEnd.x = this.centerX;
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

  connectLeftUp(acc, toPoint) {
    super.connectLeftUp(acc, toPoint);
    if (toPoint instanceof RightPoint || toPoint instanceof TopPoint) {
        return path.addVerticalLine(acc, this.centerX, this.connectStart, this.connectEnd);
    }
    return path.addPenultXSecondY(acc, this.connectStart, this.connectEnd);
  }

  connectRightUp(acc, toPoint) {
    super.connectRightUp(acc, toPoint);
  }
}
