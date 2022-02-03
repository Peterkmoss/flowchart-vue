class AbstractConnection {
  constructor(id, source, destination) {
    this.id = id;
    this.source = source;
    this.destination = destination;
    this.type = "pass";
  }
  
  render() {}
}

export class ArrowConnection extends AbstractConnection {
  constructor(id, source, destination) {
    super(id, source, destination);
  }
}

export class PassConnection extends ArrowConnection {
  constructor(id, source, destination) {
    super(id, source, destination);
  }
}

export class RejectConnection extends ArrowConnection {
  constructor(id, source, destination) {
    super(id, source, destination);
  }
}
