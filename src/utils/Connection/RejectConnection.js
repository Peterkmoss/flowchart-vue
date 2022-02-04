import ArrowConnection from './ArrowConnection';

export default class RejectConnection extends ArrowConnection {
  constructor(id, source, destination) {
    super(id, source, destination);
  }

  getColor(isSelected) {
    return isSelected ? 'darkred' : 'red';
  }

  render(g, from, to, isSelected) { return super.render(g, from, to, isSelected) }
}
