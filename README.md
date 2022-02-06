# Flowchart

Flowchart & Flowchart designer component for Vue.js.

[![NPM](https://img.shields.io/npm/v/@peterkmoss/flowchart-vue)](https://www.npmjs.com/package/@peterkmoss/flowchart-vue)

This is a fork of [joyceworks/flowchart-vue](https://github.com/joyceworks/flowchart-vue) which focuses on scalability and extendability of the code base.

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
    </div>
</template>
<script>
  import Flowchart, {
    Nodes, Connections,
  } from '@peterkmoss/flowchart-vue';

  export default {
    name: 'App',
    components: {
      Flowchart,
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
        // E.g. open a dialog to change properties on the node
      },
      handleEditConnection(connection) {
        // E.g. open a dialog to change properties on the connection
      },
    }
  };
</script>
```

## Demo

- Development Environment

  ``` shell
  git clone https://github.com/Peterkmoss/flowchart-vue.git
  cd flowchart-vue
  yarn install # or npm install
  yarn run serve # or npm run serve
  ```
  
  Then open http://localhost:8080/ (or other assigned port) in browser.

## API - TODO for this fork

See joyceworks' [Wiki](https://github.com/joyceworks/flowchart-vue/wiki).
