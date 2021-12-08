import './App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd';
import MapComponent from './map/MapComponent';
import SubMenu from 'antd/lib/menu/SubMenu';
import {
  BranchesOutlined,
  LaptopOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import React, { useContext } from 'react';
import { store } from './Store';
import {
  GraphBuilderType,
  SearchAlgoType,
  StoreActionType,
} from './interfaces/interfaces';

const actionTypeAssociation = {
  [StoreActionType.Graph]: {
    type: GraphBuilderType,
    icon: <BranchesOutlined />,
  },
  [StoreActionType.Algo]: {
    type: SearchAlgoType,
    icon: <CompassOutlined />,
  },
};

const AppMenu = () => {
  const globalState = useContext(store);
  const { state, dispatch } = globalState;
  const subMenuitems = [];
  for (const storeActionType in StoreActionType) {
    if (!isNaN(Number(storeActionType))) continue;
    const menuItems = [];
    for (const graphBuilderType in actionTypeAssociation[
      StoreActionType[storeActionType]
    ].type) {
      if (!isNaN(Number(graphBuilderType))) continue;
      const menuItem = (
        <Menu.Item key={`${graphBuilderType}`}>{graphBuilderType}</Menu.Item>
      );
      menuItems.push(menuItem);
    }
    const subMenu = (
      <SubMenu
        key={`${storeActionType}`}
        icon={actionTypeAssociation[StoreActionType[storeActionType]].icon}
        title={`${storeActionType}`}
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
        GraphBuilderType[state.menu[StoreActionType.Graph]],
        SearchAlgoType[state.menu[StoreActionType.Algo]],
      ]}
      defaultOpenKeys={[
        StoreActionType[StoreActionType.Graph],
        StoreActionType[StoreActionType.Algo],
      ]}
      style={{ height: '100%', borderRight: 0 }}
      onClick={(e) => {
        const storeActionType = StoreActionType[e.keyPath[1]];
        dispatch({
          type: 'menu',
          setting: [
            storeActionType,
            actionTypeAssociation[storeActionType].type[e.keyPath[0]],
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
