# Flowchart

Flowchart & Flowchart designer component for Vue.js.

## Usage

```shell script
npm i @peterkmoss/flowchart-vue
```

```vue
<template>
    <div id="app">
      <button @click="addStart">Add Start</button>
      <button @click="addEnd">Add End</button>
      <button @click="addOperation">Add Operation</button>
      <button @click="addDecision">Add Decision</button>
      <button @click="$refs.chart.remove()">Delete(Del)</button>
      <button @click="$refs.chart.editCurrent()"> Edit(Double-click node)</button>
      <button @click="$refs.chart.save()">Save</button>
      <flowchart 
        :nodes="nodes"
        :connections="connections" 
        @editnode="handleEditNode"
        @editconnection="handleEditConnection" 
        @save="handleChartSave" 
        ref="chart"
      />
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
  import Flowchart, {
    Nodes, Connections,
    ConnectionDialog, NodeDialog,
  } from '@peterkmoss/flowchart-vue';

  export default {
    name: 'App',
    components: {
      Flowchart,
      ConnectionDialog,
      NodeDialog,
    },
    data() {
      return {
        nodes: [
          new Nodes.StartNode(1, 100, 220),
          new Nodes.OperationNode(2, 250, 220, "Op"),
          new Nodes.DesicionNode(3, 400, 220, "De"),
          new Nodes.EndNode(4, 550, 220),
        ],
        connections: [
          new Connections.ArrowConnection(
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
    methods: {
      addEnd() {
        this.add(100, 100, Nodes.EndNode);
      },
      addStart() {
        this.add(100, 100, Nodes.StartNode);
      },
      addDecision() {
        this.add(100, 100, Nodes.DesicionNode);
      },
      addOperation() {
        this.add(100, 100, Nodes.OperationNode);
      },
      add(x, y, cls) {
        this.$refs.chart.add(new cls(+new Date(), x, y, "New"))
      },
      handleChartSave(nodes, connections) {
        // E.g. save to database
      },
      handleEditNode(node) {
        this.nodeForm.target = node;
        this.nodeDialogVisible = true;
      },
      handleEditConnection(connection) {
        this.connectionForm.target = connection;
        this.connectionDialogVisible = true;
      },
    }
  };
</script>
```

See more at [src/views/App.vue](https://github.com/joyceworks/flowchart-vue/blob/master/src/views/App.vue).

## Demo

- [GitHub Pages](https://joyceworks.github.io/flowchart-vue/)

- Development Environment

  ``` shell
  git clone https://github.com/joyceworks/flowchart-vue.git
  cd flowchart-vue
  yarn install
  yarn run serve
  ```
  
  Then open http://localhost:yourport/ in browser.

## API

See [Wiki](https://github.com/joyceworks/flowchart-vue/wiki).
