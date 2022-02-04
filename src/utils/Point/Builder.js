/* eslint-disable no-unused-vars */
import Point, { BottomPoint, LeftPoint, RightPoint, TopPoint } from '.';

export class Builder {
  /** @type { number } */
  #x;
  /** @type { number } */
  #y;
  /** @type { Point } */
  #point;

  /**
    * @param { number } x
    * @param { number } y
    */
  constructor(x, y) {
    this.#x = x;
    this.#y = y;
    this.#point = null;
    return this;
  }

  build() { 
    if (!this.#point) {
      throw new Error('you need to set the type of point you want to create');
    }
    return this.#point; 
  }

  setX(x) {
    this.#x = x;
    return this;
  }

  setY(y) {
    this.#y = y;
    return this;
  }

  fromPosition(position) {
    switch (position) {
      case 'left': return this.left();
      case 'right': return this.right();
      case 'bottom': return this.bottom();
      case 'top': return this.top();
      default: throw new Error('position not supported');
    }
  }

  left() { 
    this.#point = new LeftPoint(this.#x, this.#y);
    return this;
  }

  right() { 
    this.#point = new RightPoint(this.#x, this.#y);
    return this;
  }

  bottom() { 
    this.#point = new BottomPoint(this.#x, this.#y);
    return this;
  }

  top() { 
    this.#point = new TopPoint(this.#x, this.#y);
    return this;
  }
}
