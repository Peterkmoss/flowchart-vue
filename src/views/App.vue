<template>
  <div class="container">
    <h1 class="title">Flowchart Vue</h1>
    <h5 class="subtitle">
      Flowchart & Flowchart designer component for Vue.js.
    </h5>
    <div id="toolbar">
      <button @click="addStart">Add Start</button>
      <button @click="addEnd">Add End</button>
      <button @click="addOperation">Add Operation</button>
      <button @click="addDecision">Add Decision</button>
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
import { StartNode, EndNode, OperationNode, DecisionNode } from "../utils/Node";
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
        new StartNode(1, 100, 220),
        new OperationNode(2, 250, 220, "Op"),
        new DecisionNode(3, 400, 220, "De"),
        new EndNode(4, 550, 220),
      ],
      connections: [
        new RejectConnection(
          1, 
          { id: 1, position: "bottom" }, 
          { id: 2, position: "top" },
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
    addEnd() {
      this.add(100, 100, EndNode);
    },
    addStart() {
      this.add(100, 100, StartNode);
    },
    addDecision() {
      this.add(100, 100, DecisionNode);
    },
    addOperation() {
      this.add(100, 100, OperationNode);
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
