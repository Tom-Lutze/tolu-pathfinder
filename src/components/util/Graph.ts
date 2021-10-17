import { useState } from 'react';

const Graph = function ([getGraph, setGraph]: any) {
  return {
    addNode(node: any) {
      setGraph([...getGraph, node]);
    },
    getNodes() {
      return getGraph.map((ele: any) => ele.position);
    },
  };
};

export default Graph;
