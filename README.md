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
      <button @click="addRounded">Add Rounded</button>
      <button @click="addRectangle">Add Rectangle</button>
      <button @click="addDiamond">Add Diamond</button>
      <button @click="addCircle">Add Circle</button>
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
          new Nodes.RoundedNode(1, 100, 220, "Start"),
          new Nodes.RectangleNode(2, 250, 100),
          new Nodes.DiamondNode(3, 400, 400, "Something"),
          new Nodes.CircleNode(4, 550, 220, "End"),
        ],
        connections: [
          new Connections.RejectConnection(
            1, 
            { id: 1, position: "top" }, 
            { id: 2, position: "top" },
          ),
          new Connections.PassConnection(
            2, 
            { id: 2, position: "right" }, 
            { id: 3, position: "top" },
          ),
          new Connections.PassConnection(
            3, 
            { id: 1, position: "right" }, 
            { id: 3, position: "left" },
          ),
          new Connections.ArrowConnection(
            4, 
            { id: 3, position: "right" }, 
            { id: 4, position: "bottom" },
          ),
        ],
      };
    },
    methods: {
      addRounded() {
        this.add(100, 100, Nodes.RoundedNode);
      },
      addRectangle() {
        this.add(100, 100, Nodes.RectangleNode);
      },
      addCircle() {
        this.add(100, 100, Nodes.CircleNode);
      },
      addDiamond() {
        this.add(100, 100, Nodes.DiamondNode);
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
