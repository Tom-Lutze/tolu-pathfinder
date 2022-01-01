import {
  AlgoTypes,
  GraphTypes,
  MenuTypes,
  SettingTypes,
} from '../../interfaces';
import {
  BranchesOutlined,
  CompassOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  algoMenuStrings,
  graphMenuStrings,
  settingMenuStrings,
} from './Strings';

export const BUILDER_SETTINGS = {
  square: {
    nodesPerAxisMax: 3,
  },
  random: {
    nodesMax: 10,
    latFrom: -5,
    latTo: 5,
    lngFrom: -5,
    lngTo: 5,
    connectionsMin: 2,
    connectionsMax: 4,
  },
};

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
        initialVal: 75,
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
        initialVal: 10,
        min: 0,
        max: 100,
        step: 1,
      },
    },
  },
};
