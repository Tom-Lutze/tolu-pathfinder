let nodeIndex = 0;

const Graph = function ([getGraph, setGraph]: any) {
  return {
    addNode(node: any) {
      setGraph([...getGraph, { ...node, idx: nodeIndex++ }]);
    },
    getNodes() {
      return getGraph;
    },
  };
};

export default Graph;
