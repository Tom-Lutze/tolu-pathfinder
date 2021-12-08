import React, { createContext, useReducer } from 'react';
import {
  GraphBuilderType,
  SearchAlgoType,
  StoreActionType,
} from './interfaces/interfaces';

const initialState: any = {
  menu: {
    [StoreActionType.Graph]: GraphBuilderType.Random,
    [StoreActionType.Algo]: SearchAlgoType.DFS,
  },
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(
    (state: any, action: { type: string; setting: any }) => {
      switch (action.type) {
        case 'menu':
          return {
            ...state,
            menu: { ...state.menu, [action.setting[0]]: action.setting[1] },
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
