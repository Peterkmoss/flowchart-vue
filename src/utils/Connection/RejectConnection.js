import ArrowConnection from './ArrowConnection';

export default class RejectConnection extends ArrowConnection {
  constructor(id, from, to) {
    super(id, from, to);
  }

  getColor(isSelected) {
    return isSelected ? 'darkred' : 'red';
  }
}
