import React, { createContext, useReducer } from 'react';
import { GraphBuilderType, SearchAlgoType } from './interfaces/interfaces';

export interface AppSettingInterface {
  graphType: 'none' | 'square' | 'random';
  searchAlgo: 'dfs' | 'bfs';
}

const initialState: any = {
  searchAlgo: 'bfs',
  graphType: 'none',
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer((state: any, action: any) => {
    let newState;
    switch (action.type) {
      case GraphBuilderType.None:
        newState = { ...state, graphType: GraphBuilderType.None };
        return newState;
      case GraphBuilderType.Square:
        newState = { ...state, graphType: GraphBuilderType.Square };
        return newState;
      case GraphBuilderType.Random:
        newState = { ...state, graphType: GraphBuilderType.Random };
        return newState;
      case SearchAlgoType.DFS:
        newState = { ...state, searchAlgo: SearchAlgoType.DFS };
        return newState;
      case SearchAlgoType.BFS:
        newState = { ...state, searchAlgo: SearchAlgoType.BFS };
        return newState;
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
