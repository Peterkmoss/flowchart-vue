import { connect } from '../utils/svg';

class AbstractConnection {
  constructor(id, source, destination) {
    this.id = id;
    this.source = source;
    this.destination = destination;
    this.type = "pass";
  }

  // eslint-disable-next-line
  render(g, from, to, isSelected) {}
}

class ArrowConnection extends AbstractConnection {
  constructor(id, source, destination) {
    super(id, source, destination);
  }

  render(g, from, to, isSelected) {
    super.render(g, from, to, isSelected)
    g.classed("connection", true);
    const color = this.getColor(isSelected)
    connect(g, from, to, 1, color || "#a3a3a3", true);
    // a 5px cover to make mouse operation conveniently
    return connect(g, from, to, 5, "transparent", false);
  }
}

export class PassConnection extends ArrowConnection {
  constructor(id, source, destination) {
    super(id, source, destination);
  }

  getColor(isSelected) {
    return isSelected ? '#12640a' : '#52c41a';
  }

  render(g, from, to, isSelected) { return super.render(g, from, to, isSelected) }
}

export class RejectConnection extends ArrowConnection {
  constructor(id, source, destination) {
    super(id, source, destination);
  }

  getColor(isSelected) {
    return isSelected ? 'darkred' : 'red';
  }

  render(g, from, to, isSelected) { return super.render(g, from, to, isSelected) }
}
