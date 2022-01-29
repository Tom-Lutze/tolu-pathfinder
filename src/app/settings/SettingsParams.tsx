import React from 'react';
import {
  BranchesOutlined,
  CompassOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  AlgoTypes,
  GraphTypes,
  MenuTypes,
  SettingTypes,
} from '../../interfaces/Interfaces';
import {
  algoMenuStrings,
  graphMenuStrings,
  settingMenuStrings,
} from '../constants/Strings';

/**
 * Parameters and initial configurations for the {@link Sidebar} menu.
 */
export const settingsParams = {
  [MenuTypes.Graph]: {
    type: GraphTypes,
    icon: <BranchesOutlined />,
    strings: graphMenuStrings,
    initialVal: 0,
  },
  [MenuTypes.Algo]: {
    type: AlgoTypes,
    icon: <CompassOutlined />,
    strings: algoMenuStrings,
    initialVal: 0,
  },
  [MenuTypes.Settings]: {
    icon: <SettingOutlined />,
    type: SettingTypes,
    strings: settingMenuStrings,
    children: {
      [SettingTypes.SearchSpeed]: {
        initialVal: 50,
        min: 0,
        max: 100,
        step: 1,
      },
      [SettingTypes.BuildSpeed]: {
        initialVal: 90,
        min: 0,
        max: 100,
        step: 1,
      },
      [SettingTypes.MaxNodesGrid]: {
        initialVal: 5,
        min: 0,
        max: 10,
        step: 1,
      },
      [SettingTypes.MaxNodesRandom]: {
        initialVal: 20,
        min: 0,
        max: 100,
        step: 1,
      },
    },
  },
};
