import React, { createContext, useReducer } from 'react';

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
      case 'graph-none':
        newState = { ...state, graphType: 'none' };
        return newState;
      case 'graph-square':
        newState = { ...state, graphType: 'square' };
        return newState;
      case 'graph-random':
        newState = { ...state, graphType: 'random' };
        return newState;
      case 'algo-dfs':
        newState = { ...state, searchAlgo: 'dfs' };
        return newState;
      case 'algo-bfs':
        newState = { ...state, searchAlgo: 'bfs' };
        return newState;
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
