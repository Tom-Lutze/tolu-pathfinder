import React, { useContext } from 'react';
import { AlgoTypes, GraphTypes, MenuTypes } from '../interfaces';
import { storeContext } from './AppStore';
import {
  algoMenuStrings,
  graphMenuStrings,
  mainMenuStrings,
} from './map/constants/Strings';
import { BranchesOutlined, CompassOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

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
};

const AppMenu = () => {
  const globalState = useContext(storeContext);
  const { appState, dispatch } = globalState;
  const subMenuitems = [];
  for (const menuType in MenuTypes) {
    if (!isNaN(Number(menuType))) continue;
    const menuItems = [];
    const menuParam = menuParams[MenuTypes[menuType]];
    for (const currType in menuParam.type) {
      if (!isNaN(Number(currType))) continue;
      const menuItem = (
        <Menu.Item key={`${currType}`}>
          {menuParam.strings[menuParam.type[currType]]}
        </Menu.Item>
      );
      menuItems.push(menuItem);
    }
    const subMenu = (
      <SubMenu
        key={`${menuType}`}
        icon={menuParam.icon}
        title={`${mainMenuStrings[MenuTypes[menuType]]}`}
      >
        {menuItems}
      </SubMenu>
    );
    subMenuitems.push(subMenu);
  }
  return (
    <Menu
      mode="inline"
      selectedKeys={[
        GraphTypes[appState.menu[MenuTypes.Graph]],
        AlgoTypes[appState.menu[MenuTypes.Algo]],
      ]}
      defaultOpenKeys={[MenuTypes[MenuTypes.Graph], MenuTypes[MenuTypes.Algo]]}
      style={{ height: '100%', borderRight: 0 }}
      onClick={(e) => {
        const storeActionType = MenuTypes[e.keyPath[1]];
        dispatch({
          type: 'menu',
          settings: [
            storeActionType,
            menuParams[storeActionType].type[e.keyPath[0]],
          ],
        });
      }}
      children={subMenuitems}
    />
  );
};

export default AppMenu;
