import Flowchart from './components/flowchart';
import NodeDialog from './components/NodeDialog';
import ConnectionDialog from './components/ConnectionDialog';
import * as Nodes from './components/Node';
import * as Connections from './components/Connection';

const components = [
  Flowchart,
  NodeDialog,
  ConnectionDialog,
];

const install = function(Vue) {
  components.map(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Flowchart,
};

export {
  NodeDialog,
  ConnectionDialog,
  Nodes,
  Connections,
}
