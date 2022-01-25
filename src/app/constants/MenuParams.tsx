import {
  BranchesOutlined,
  CompassOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import React from 'react';
import {
  AlgoTypes,
  ExtraMenuTypes,
  GraphTypes,
  MenuTypes,
  SettingTypes,
} from '../../interfaces';
import {
  algoMenuStrings,
  graphMenuStrings,
  settingMenuStrings,
} from './Strings';

/**
 * Predefined settings and initial configurations that are represented in the sidebar menu.
 */
export const menuParams = {
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
