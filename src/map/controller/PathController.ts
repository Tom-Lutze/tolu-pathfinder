import {
  GraphInterface,
  GraphStateInterface,
  PathInterface,
} from '../../interfaces/interfaces';
import { sleep } from '../../utils/Helper';

class PathController {
  graph: GraphInterface;
  path: PathInterface;
  setPath: React.Dispatch<React.SetStateAction<PathInterface>>;

  constructor(
    graph: GraphInterface,
    path: PathInterface,
    setPath: React.Dispatch<React.SetStateAction<PathInterface>>
    // graphState: GraphStateInterface,
    // setPath: React.Dispatch<React.SetStateAction<PathInterface>>
  ) {
    this.graph = graph;
    this.path = path;
    this.setPath = setPath;
  }

  getPath() {
    return this.path;
  }

  bfs() {
    const startNodeIdx = this.graph.state.startNode;
    const endNodeIdx = this.graph.state.endNode;
    if (!startNodeIdx || !endNodeIdx || Object.keys(this.graph).length < 1)
      return [];
    const visitedNodes = new Set<number>();
    const loop = async (queue: number[][]) => {
      if (queue.length > 0) {
        const queueNode = queue.shift();
        if (!queueNode || !queueNode[0] || visitedNodes.has(queueNode[0])) {
          loop(queue);
        } else {
          this.setPath({ found: false, path: queueNode });
          visitedNodes.add(queueNode[0]);
          if (queueNode[0] == endNodeIdx) {
            return this.setPath({ found: true, path: queueNode });
          }
          const queueNodeEdges = this.graph.nodes[queueNode[0]].edges;
          if (queueNodeEdges) {
            queueNodeEdges.forEach((edge) => {
              queue.push([edge, ...queueNode]);
            });
          }
          await sleep(1000);
          loop(queue);
        }
      }
    };
    let queue = [[startNodeIdx]];
    loop(queue);
  }
}

export default PathController;
