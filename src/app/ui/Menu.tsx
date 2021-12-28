import {
  BranchesOutlined,
  CompassOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu, Slider } from 'antd';
import React, { useContext } from 'react';
import {
  AlgoTypes,
  GraphTypes,
  MenuTypes,
  SettingTypes,
} from '../../interfaces';
import { SettingContexts } from '../../utils/SettingsProvider';
import {
  algoMenuStrings,
  graphMenuStrings,
  mainMenuStrings,
  settingMenuStrings,
} from '../constants/Strings';

const menuParams = {
  [MenuTypes.Graph]: {
    type: GraphTypes,
    icon: <BranchesOutlined />,
    strings: graphMenuStrings,
  },
  [MenuTypes.Algo]: {
    type: AlgoTypes,
    icon: <CompassOutlined />,
    strings: algoMenuStrings,
  },
  [MenuTypes.Settings]: {
    icon: <SettingOutlined />,
    type: SettingTypes,
    strings: settingMenuStrings,
  },
};

const AppMenu = () => {
  const subMenuitems = [];

  for (const menuType in MenuTypes) {
    if (!isNaN(Number(menuType))) continue;

    const menuItems = [];
    const menuParam = menuParams[MenuTypes[menuType]];

    if (!menuParam) continue;

    for (const currType in menuParam.type) {
      if (!isNaN(Number(currType))) continue;
      if (
        menuType == MenuTypes[MenuTypes.Algo] ||
        menuType == MenuTypes[MenuTypes.Graph]
      ) {
        const menuItem = (
          <Menu.Item key={`${currType}`}>
            {menuParam.strings[menuParam.type[currType]]}
          </Menu.Item>
        );
        menuItems.push(menuItem);
      } else if (menuType == MenuTypes[MenuTypes.Settings]) {
        const { stateVal, setStateVal } = useContext(
          SettingContexts[MenuTypes.Settings][menuParam.type[currType]]
        );

        const menuItem = (
          <Menu.ItemGroup
            key={`mig-${currType}`}
            title={menuParam.strings[menuParam.type[currType]]}
          >
            <Menu.Item
              key={`mi-${currType}`}
              className="tolu-settings-slider-parent"
            >
              <Slider
                defaultValue={stateVal}
                disabled={false}
                onAfterChange={(value) => {
                  setStateVal(value);
                  console.log('set' + value);
                }}
              />
            </Menu.Item>
          </Menu.ItemGroup>
        );
        menuItems.push(menuItem);
      }
    }

    const subMenu = (
      <Menu.SubMenu
        key={`${menuType}`}
        icon={menuParam.icon}
        title={`${mainMenuStrings[MenuTypes[menuType]]}`}
      >
        {menuItems}
      </Menu.SubMenu>
    );
    subMenuitems.push(subMenu);
  }

  const algoContext: any = useContext(SettingContexts[MenuTypes.Algo]);
  const graphContext: any = useContext(SettingContexts[MenuTypes.Graph]);

  return (
    <Menu
      mode="inline"
      inlineIndent={14}
      selectedKeys={[
        GraphTypes[graphContext.stateVal],
        AlgoTypes[algoContext.stateVal],
      ]}
      defaultOpenKeys={[MenuTypes[MenuTypes.Graph], MenuTypes[MenuTypes.Algo]]}
      style={{ height: '100%', borderRight: 0 }}
      onClick={(e) => {
        const menuType = MenuTypes[e.keyPath[1]];
        const menuParam = menuParams[menuType];
        if (menuType == MenuTypes.Algo) {
          algoContext.setStateVal(menuParam.type[e.keyPath[0]]);
        } else if (menuType == MenuTypes.Graph) {
          graphContext.setStateVal(menuParam.type[e.keyPath[0]]);
        }
      }}
      children={subMenuitems}
    />
  );
};

export default AppMenu;
