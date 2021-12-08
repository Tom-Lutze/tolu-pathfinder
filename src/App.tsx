import { BranchesOutlined, CompassOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import SubMenu from 'antd/lib/menu/SubMenu';
import React, { useContext } from 'react';
import './App.css';
import {
  AlgoCatType,
  GraphCatType,
  MainCatType,
} from './interfaces/interfaces';
import MapComponent from './map/MapComponent';
import { store } from './Store';

const mainCatParams = {
  [MainCatType.Graph]: {
    subType: GraphCatType,
    icon: <BranchesOutlined />,
  },
  [MainCatType.Algo]: {
    subType: AlgoCatType,
    icon: <CompassOutlined />,
  },
};

const AppMenu = () => {
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const subMenuitems = [];
  for (const mainCatType in MainCatType) {
    if (!isNaN(Number(mainCatType))) continue;
    const menuItems = [];
    for (const graphBuilderType in mainCatParams[MainCatType[mainCatType]]
      .subType) {
      if (!isNaN(Number(graphBuilderType))) continue;
      const menuItem = (
        <Menu.Item key={`${graphBuilderType}`}>{graphBuilderType}</Menu.Item>
      );
      menuItems.push(menuItem);
    }
    const subMenu = (
      <SubMenu
        key={`${mainCatType}`}
        icon={mainCatParams[MainCatType[mainCatType]].icon}
        title={`${mainCatType}`}
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
        GraphCatType[state.menu[MainCatType.Graph]],
        AlgoCatType[state.menu[MainCatType.Algo]],
      ]}
      defaultOpenKeys={[
        MainCatType[MainCatType.Graph],
        MainCatType[MainCatType.Algo],
      ]}
      style={{ height: '100%', borderRight: 0 }}
      onClick={(e) => {
        const storeActionType = MainCatType[e.keyPath[1]];
        dispatch({
          type: 'menu',
          settings: [
            storeActionType,
            mainCatParams[storeActionType].subType[e.keyPath[0]],
          ],
        });
      }}
      children={subMenuitems}
    />
  );
};

const App = () => {
  const { Header, Content, Sider } = Layout;
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background" collapsible>
          <AppMenu />
        </Sider>
        <Layout>
          <Content
            className="site-layout-background"
            style={{
              margin: 0,
              minHeight: 280,
            }}
          >
            <MapComponent />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
