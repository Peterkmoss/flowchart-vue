import * as d3 from "d3";
import Connector from './Connector';

export default class DisabledConnector extends Connector {
  constructor(g, key, position, node, flowChart) {
    super(g, key, position, node, flowChart);
  }

  mouseDownHandler() { 
    return () => {
      d3.event.stopPropagation();
      return;
    }
  }
}
