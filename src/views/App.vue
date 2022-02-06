<template>
  <div class="container">
    <h1 class="title">Flowchart Vue</h1>
    <h5 class="subtitle">
      Flowchart & Flowchart designer component for Vue.js.
    </h5>
    <div id="toolbar">
      <button @click="addRounded">Add Rounded</button>
      <button @click="addRectangle">Add Rectangle</button>
      <button @click="addDiamond">Add Diamond</button>
      <button @click="addCircle">Add Circle</button>
      <button @click="$refs.chart.remove()">Delete(Del)</button>
      <button @click="$refs.chart.editCurrent()"> Edit(Double-click node)</button>
      <button @click="$refs.chart.save()">Save</button>
    </div>
    <flowchart
      ref="chart"
      :nodes="nodes"
      :connections="connections"
      @editnode="handleEditNode"
      @editconnection="handleEditConnection"
      :width="'100%'"
      :height="500"
      :readonly="false"
    >
    </flowchart>
    <node-dialog
      :visible.sync="nodeDialogVisible"
      :node.sync="nodeForm.target"
    />
    <connection-dialog
      :visible.sync="connectionDialogVisible"
      :connection.sync="connectionForm.target"
      :operation="connectionForm.operation"
    />
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import ConnectionDialog from "../components/ConnectionDialog";
import NodeDialog from "../components/NodeDialog";
import Flowchart from "../components/Flowchart";
import { RoundedNode, RectangleNode, DiamondNode, CircleNode } from "../utils/Node";
import { PassConnection, ArrowConnection, RejectConnection } from "../utils/Connection";

export default {
  components: {
    ConnectionDialog,
    NodeDialog,
    Flowchart,
  },
  data: function () {
    return {
      nodes: [
        new RoundedNode(1, 100, 220, "Start"),
        new RectangleNode(2, 250, 100),
        new DiamondNode(3, 400, 400, "Something"),
        new CircleNode(4, 550, 220, "End"),
      ],
      connections: [
        new RejectConnection(
          1, 
          { id: 1, position: "top" }, 
          { id: 2, position: "top" },
        ),
        new PassConnection(
          2, 
          { id: 2, position: "right" }, 
          { id: 3, position: "top" },
        ),
        new PassConnection(
          3, 
          { id: 1, position: "right" }, 
          { id: 3, position: "left" },
        ),
        new ArrowConnection(
          4, 
          { id: 3, position: "right" }, 
          { id: 4, position: "bottom" },
        ),
      ],
      nodeForm: { target: null },
      connectionForm: { target: null, operation: null },
      nodeDialogVisible: false,
      connectionDialogVisible: false,
    };
  },
  async mounted() {},
  methods: {
    addRounded() {
      this.add(100, 100, RoundedNode);
    },
    addRectangle() {
      this.add(100, 100, RectangleNode);
    },
    addCircle() {
      this.add(100, 100, CircleNode);
    },
    addDiamond() {
      this.add(100, 100, DiamondNode);
    },
    add(x, y, cls) {
      this.$refs.chart.add(new cls(+new Date(), x, y, "New"))
    },
    handleEditNode(node) {
      this.nodeForm.target = node;
      this.nodeDialogVisible = true;
    },
    handleEditConnection(connection) {
      this.connectionForm.target = connection;
      this.connectionDialogVisible = true;
    },
  },
};
</script>
<style scoped>
#toolbar {
  margin-bottom: 10px;
}

.title {
  margin-top: 10px;
  margin-bottom: 0;
}

.subtitle {
  margin-bottom: 10px;
}

#toolbar > button {
  margin-right: 4px;
}

.container {
  width: 800px;
  margin: auto;
}
</style>
