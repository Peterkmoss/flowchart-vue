import ArrowConnection from './ArrowConnection';

export default class PassConnection extends ArrowConnection {
  constructor(id, source, destination) {
    super(id, source, destination);
  }

  getColor(isSelected) {
    return isSelected ? '#12640a' : '#52c41a';
  }

  render(g, from, to, isSelected) { return super.render(g, from, to, isSelected) }
}
