import React, { createContext, useState } from 'react';
import { menuParams } from '../app/constants/MenuParams';
import { MenuTypes, SettingTypes } from '../interfaces';

const SettingContexts: any = {
  [MenuTypes.Algo]: createContext({
    stateVal: 0,
    setStateVal: () => {},
  }),
  [MenuTypes.Graph]: createContext({
    stateVal: 0,
    setStateVal: () => {},
  }),
  [MenuTypes.Settings]: {
    [SettingTypes.SearchSpeed]: createContext({
      stateVal: 0,
      setStateVal: () => {},
    }),
    [SettingTypes.BuildSpeed]: createContext({
      stateVal: 0,
      setStateVal: () => {},
    }),
    [SettingTypes.MaxNodesGrid]: createContext({
      stateVal: 0,
      setStateVal: () => {},
    }),
    [SettingTypes.MaxNodesRandom]: createContext({
      stateVal: 0,
      setStateVal: () => {},
    }),
  },
};

const SettingsProvider = ({ children }: any) => {
  let ProviderParent = <>{children}</>;
  for (const menuType in MenuTypes) {
    const currType = Number(menuType);
    if (isNaN(currType)) continue;

    if (currType == MenuTypes.Algo || currType == MenuTypes.Graph) {
      const [stateVal, setStateVal] = useState(0);
      const Provider = SettingContexts[currType].Provider;
      ProviderParent = (
        <Provider value={{ stateVal, setStateVal }}>{ProviderParent}</Provider>
      );
    } else if (currType == MenuTypes.Settings) {
      for (const settingType in SettingTypes) {
        const currSettingType = Number(settingType);
        if (isNaN(currSettingType)) continue;
        const [stateVal, setStateVal] = useState(
          menuParams[MenuTypes.Settings].children[settingType].initialVal
        );
        const Provider = SettingContexts[menuType][currSettingType].Provider;
        ProviderParent = (
          <Provider value={{ stateVal, setStateVal }}>
            {ProviderParent}
          </Provider>
        );
      }
    }
  }

  return ProviderParent;
};

export { SettingContexts, SettingsProvider };
