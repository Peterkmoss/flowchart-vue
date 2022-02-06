import ArrowConnection from './ArrowConnection';

export default class PassConnection extends ArrowConnection {
  constructor(id, from, to) {
    super(id, from, to);
  }

  getColor(isSelected) {
    return isSelected ? '#12640a' : '#52c41a';
  }
}
