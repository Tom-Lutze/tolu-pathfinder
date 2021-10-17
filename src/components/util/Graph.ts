let nodeIndex = 0;

const Graph = function ([graph, setGraph]: any) {
  return {
    addNode(node: any) {
      nodeIndex++;
      setGraph({
        ...graph,
        [nodeIndex]: node,
        state: { ...(graph.state ?? {}), activeNode: nodeIndex },
      });
    },
    getNodesIdx() {
      return Object.keys(graph).filter((key) => key !== 'state');
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
