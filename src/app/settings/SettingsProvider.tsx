import React, { createContext, useState } from 'react';
import { settingsParams } from './SettingsParams';
import {
  ExtraMenuTypes,
  MenuTypes,
  SettingTypes,
} from '../../interfaces/Interfaces';

/**
 * Dictionary of settings ({@link MenuTypes}) with their associated {@link React.Context}.
 */
const SettingContexts: {
  [index: number]: any;
} = {
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
  [ExtraMenuTypes.UpdateTimestamp]: createContext({
    stateVal: 0,
    setStateVal: () => {},
  }),
};

/**
 * This component initiates and provides settings to all it's child components via the {@link React.Context}
 * @param param0 The child component which is wrapped by the {@link SettingsProvider}
 * @returns SettingsProvider object
 */
const SettingsProvider: React.FC<{}> = ({ children }) => {
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
          settingsParams[MenuTypes.Settings].children[settingType].initialVal
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

  for (const menuType in ExtraMenuTypes) {
    const currType = Number(menuType);
    if (isNaN(currType)) continue;
    const [stateVal, setStateVal] = useState(0);
    const Provider = SettingContexts[currType].Provider;
    ProviderParent = (
      <Provider value={{ stateVal, setStateVal }}>{ProviderParent}</Provider>
    );
  }

  return ProviderParent;
};

export { SettingContexts, SettingsProvider };
