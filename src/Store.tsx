import React, { createContext, useReducer } from 'react';
import {
  GraphCatType,
  AlgoCatType,
  MainCatType,
} from './interfaces/interfaces';

const initialState: any = {
  menu: {
    [MainCatType.Graph]: GraphCatType.Random,
    [MainCatType.Algo]: AlgoCatType.DFS,
  },
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(
    (state: any, action: { type: string; settings: any }) => {
      switch (action.type) {
        case 'menu':
          return {
            ...state,
            menu: { ...state.menu, [action.settings[0]]: action.settings[1] },
          };
        default:
          throw new Error('Action type is not defined');
      }
    },
    initialState
  );

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
