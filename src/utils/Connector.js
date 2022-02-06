import * as d3 from "d3";
import { PassConnection } from './Connection';

export default class Connector {
  element;
  position;

  constructor(g, position, coordinates, node, flowChart) {
    this.position = position;
    this.render(g, coordinates, node, flowChart);
  }

  render(g, coordinates, node, flowChart) {
    this.element = g
      .append("circle")
      .attr("cx", coordinates.x)
      .attr("cy", coordinates.y)
      .attr("r", 4)
      .attr("class", "connector");

    this.addListeners(node, flowChart);
  }

  addListeners(node, flowChart) {
    this.element
      .on("mousedown", this.mouseDownHandler(node, flowChart))
      .on("mouseup", this.mouseUpHandler(node, flowChart))
      .on("mouseover", () => { this.setActive(); })
      .on("mouseout", () => { this.setInactive(); });
  }

  setActive() {
    this.element.classed("active", true);
  }

  setInactive() {
    this.element.classed("active", false);
  }

  mouseDownHandler(node, flowChart) {
    return () => {
      d3.event.stopPropagation();
      if (flowChart.readonly) { return; }

      flowChart.connectStart.node = node;
      flowChart.connectStart.position = this.position;
    }
  }

  mouseUpHandler(node, flowChart) {
    return () => {
      d3.event.stopPropagation();
      if (!flowChart.connectStart.node) {
        return;
      }
      if (flowChart.connectStart.node.id !== node.id) {
        // Node can't connect to itself
        const id = +new Date();
        const from = {
          id: flowChart.connectStart.node.id,
          position: flowChart.connectStart.position,
        }
        const to = {
          id: node.id,
          position: this.position,
        }

        const conn = new PassConnection(id, from, to);
        flowChart.connect(conn);
      }
      flowChart.connectStart.node = null;
      flowChart.connectStart.position = null;
    }
  }
}
