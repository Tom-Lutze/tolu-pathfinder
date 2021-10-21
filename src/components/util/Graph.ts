let nodeIndex = 0;

const Graph = function ([graph, setGraph]: any) {
  return {
    addNode(node: any) {
      nodeIndex++;
      // setGraph({
      //   ...graph,
      //   [nodeIndex]: node,
      //   state: { ...(graph.state ?? {}), activeNode: nodeIndex },
      // });
      const newGraph = { ...graph };
      if (!newGraph.state) newGraph.state = {};
      if (newGraph.state.activeNode !== undefined) {
        const prevNode = newGraph[newGraph.state.activeNode];
        if (!prevNode.edges) prevNode.edges = new Set();
        prevNode.edges.add(nodeIndex);
        newGraph[newGraph.state.activeNode] = prevNode; //todo
      }
      newGraph[nodeIndex] = node;
      newGraph.state.activeNode = nodeIndex;
      setGraph(newGraph);
    },
    getNodesIdx() {
      return Object.keys(graph).filter((key) => key !== 'state');
    },
    getNode(idx: string) {
      return graph[idx];
    },
    getGraph() {
      return graph;
    },
    setActiveNode(idx: number) {
      if (idx && graph[idx]) {
        setGraph({
          ...graph,
          state: { ...(graph.state ?? {}), activeNode: idx },
        });
      }
    },
    getActiveNode() {
      return graph.state?.activeNode ?? false;
    },
  };
};

export default Graph;
