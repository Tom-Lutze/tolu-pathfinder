import React, { createContext, useReducer } from 'react';
import { GraphTypes, AlgoTypes, MenuTypes } from '../interfaces';

const initialState: any = {
  menu: {
    [MenuTypes.Graph]: GraphTypes.Random,
    [MenuTypes.Algo]: AlgoTypes.AStarEuclidean,
  },
};

const storeContext = createContext(initialState);
const { Provider } = storeContext;

const StoreProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(
    (state: any, action: { type: string; settings: any }) => {
      switch (action.type) {
        case 'menu':
          return {
            ...state,
            menu: { ...state.menu, [action.settings[0]]: action.settings[1] },
          };
        case 'menu-s':
          return {
            ...state,
            menu: {
              ...state.menu,
              [action.settings[0]]: {
                ...[action.settings[0]],
                [action.settings[1]]: action.settings[2],
              },
            },
          };
        default:
          throw new Error('Action type is not defined');
      }
    },
    initialState
  );

  return <Provider value={{ appState: state, dispatch }}>{children}</Provider>;
};

export { storeContext, StoreProvider };
