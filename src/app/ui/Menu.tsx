import React, { useContext } from 'react';
import { AlgoTypes, GraphTypes, MenuTypes } from '../../interfaces';
import { storeContext } from '../../utils/Store';
import {
  algoMenuStrings,
  graphMenuStrings,
  mainMenuStrings,
} from '../constants/Strings';
import {
  BranchesOutlined,
  CompassOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu, Slider } from 'antd';

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
    children: [
      {
        name: 'build-speed',
        component: <Slider defaultValue={30} disabled={false} />,
      },
      {
        name: 'max-nodes',
        component: <Slider defaultValue={30} disabled={false} />,
      },
    ],
  },
};

const AppMenu = () => {
  const globalState = useContext(storeContext);
  const { appState, dispatch } = globalState;
  const subMenuitems = [];
  for (const menuType in MenuTypes) {
    if (!isNaN(Number(menuType))) continue;

    const menuItems = [];
    const menuParam = menuParams[MenuTypes[menuType]];

    if (!menuParam) continue;

    for (const currType in menuParam.type) {
      if (!isNaN(Number(currType))) continue;
      const menuItem = (
        <Menu.Item key={`${currType}`}>
          {menuParam.strings[menuParam.type[currType]]}
        </Menu.Item>
      );
      menuItems.push(menuItem);
    }

    if (menuParam.children) {
      menuParam.children.forEach((currChild: any) => {
        const menuItem = (
          <Menu.Item key={currChild.name}>{currChild.component}</Menu.Item>
        );
        menuItems.push(menuItem);
      });
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

  return (
    <Menu
      mode="inline"
      inlineIndent={14}
      selectedKeys={[
        GraphTypes[appState.menu[MenuTypes.Graph]],
        AlgoTypes[appState.menu[MenuTypes.Algo]],
      ]}
      defaultOpenKeys={[MenuTypes[MenuTypes.Graph], MenuTypes[MenuTypes.Algo]]}
      style={{ height: '100%', borderRight: 0 }}
      onClick={(e) => {
        const storeActionType = MenuTypes[e.keyPath[1]];
        const menuParam = menuParams[storeActionType];
        if (menuParam.type) {
          dispatch({
            type: 'menu',
            settings: [storeActionType, menuParam.type[e.keyPath[0]]],
          });
        }
      }}
      children={subMenuitems}
    />
  );
};

export default AppMenu;
