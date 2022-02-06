/* eslint-disable no-unused-vars */
import Point, { BottomPoint, LeftPoint, RightPoint, TopPoint, TmpPoint } from '.';
import { Node } from '../Node';

export class Builder {
  /** @type { number } */
  #x;
  /** @type { number } */
  #y;
  /** @type { Node } */
  #node;
  /** @type { Point } */
  #point;
  /** @type { boolean } */
  #tmp;

  /**
    * @param { number } x
    * @param { number } y
    */
  constructor(x, y, node) {
    this.#x = x;
    this.#y = y;
    this.#node = node;
    this.#point = null;
    this.#tmp = false;
    return this;
  }

  build() { 
    if (!this.#point) {
      throw new Error('you need to set the type of point you want to create');
    }
    this._checkNode();
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

  setNode(node) {
    this.#node = node;
    return this;
  }

  fromPosition(position) {
    switch (position) {
      case 'left': return this.left();
      case 'right': return this.right();
      case 'bottom': return this.bottom();
      case 'top': return this.top();
      default: 
        throw new Error(`position not supported: ${position}`);
    }
  }

  _checkNode() {
    if (!this.#node && !this.#tmp) {
      throw new Error('you need to provide a node');
    }
  }

  left() { 
    this._checkNode();
    this.#point = new LeftPoint(this.#x, this.#y, this.#node);
    return this;
  }

  right() { 
    this._checkNode();
    this.#point = new RightPoint(this.#x, this.#y, this.#node);
    return this;
  }

  bottom() { 
    this._checkNode();
    this.#point = new BottomPoint(this.#x, this.#y, this.#node);
    return this;
  }

  top() { 
    this._checkNode();
    this.#point = new TopPoint(this.#x, this.#y, this.#node);
    return this;
  }

  tmp() { 
    this.#tmp = true;
    this._checkNode();
    this.#point = new TmpPoint(this.#x, this.#y, this.#node);
    return this;
  }
}
