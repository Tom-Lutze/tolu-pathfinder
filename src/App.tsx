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
  [StoreActionType[StoreActionType.Graph]]: {
    type: GraphBuilderType,
    icon: <BranchesOutlined />,
  },
  [StoreActionType[StoreActionType.Algo]]: {
    type: SearchAlgoType,
    icon: <CompassOutlined />,
  },
};

const AppMenu = () => {
  const globalState = useContext(store);
  const { dispatch } = globalState;
  const subMenuitems = [];
  for (const storeActionType in StoreActionType) {
    if (!isNaN(Number(storeActionType))) continue;
    const menuItems = [];
    for (const graphBuilderType in actionTypeAssociation[storeActionType]
      .type) {
      if (!isNaN(Number(graphBuilderType))) continue;
      const menuItem = (
        <Menu.Item key={`${storeActionType}-${graphBuilderType}`}>
          {graphBuilderType}
        </Menu.Item>
      );
      menuItems.push(menuItem);
    }
    const subMenu = (
      <SubMenu
        key={`${storeActionType}`}
        icon={actionTypeAssociation[storeActionType].icon}
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
      defaultSelectedKeys={[
        `${StoreActionType[StoreActionType.Graph]}-${
          GraphBuilderType[GraphBuilderType.Random]
        }`,
        `${StoreActionType[StoreActionType.Algo]}-${
          SearchAlgoType[SearchAlgoType.DFS]
        }`,
      ]}
      defaultOpenKeys={[
        `${StoreActionType[StoreActionType.Graph]}`,
        `${StoreActionType[StoreActionType.Algo]}`,
      ]}
      style={{ height: '100%', borderRight: 0 }}
      onClick={(e) => dispatch({ type: e.key })}
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
