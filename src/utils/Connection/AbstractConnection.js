export default class AbstractConnection {
  constructor(id, source, destination) {
    this.id = id;
    this.source = source;
    this.destination = destination;
  }

  getColor() {
    return 'black';
  }

  // eslint-disable-next-line
  render(g, from, to, isSelected) {
    g.classed("connection", true);
  }
}
