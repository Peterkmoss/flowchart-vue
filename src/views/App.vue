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
      :nodes="nodes"
      :connections="connections"
      @editnode="handleEditNode"
      :width="'100%'"
      :height="500"
      :readonly="false"
      @dblclick="handleDblClick"
      @editconnection="handleEditConnection"
      @save="handleChartSave"
      @select="handleSelect"
      @selectconnection="handleSelectConnection"
      ref="chart"
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
import Flowchart from "../components/flowchart/Flowchart";
import { StartNode, EndNode, OperationNode, DesicionNode } from "../components/Node";
import { ArrowConnection } from "../components/Connection";

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
        new DesicionNode(3, 400, 220, "De"),
        new EndNode(4, 550, 220),
      ],
      connections: [
        new ArrowConnection(
          1, 
          { id: 1, position: "right" }, 
          { id: 2, position: "left" }
        )
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
      this.add(100, 100, DesicionNode);
    },
    addOperation() {
      this.add(100, 100, OperationNode);
    },
    add(x, y, cls) {
      this.$refs.chart.add(new cls(+new Date(), x, y, "New"))
    },
    handleDblClick(position) {
      /* this.add(position.x, position.y) */
    },
    handleSelect(nodes) { },
    handleSelectConnection(connections) { },
    async handleChartSave(nodes, connections) { },
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
