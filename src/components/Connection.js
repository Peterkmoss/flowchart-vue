class AbstractConnection {
  src;
  destination;
  id;
  type;

  constructor(id, src, destination) {
    this.id = id;
    this.src = src;
    this.destination = destination;
    this.type = "pass";
  }
  
  render() {}
}

export class ArrowConnection extends AbstractConnection {
  constructor(id, src, destination) {
    super(id, src, destination);
  }
}

export class PassConnection extends ArrowConnection {
  constructor(id, src, destination) {
    super(id, src, destination);
  }
}

export class RejectConnection extends ArrowConnection {
  constructor(id, src, destination) {
    super(id, src, destination);
  }
}
