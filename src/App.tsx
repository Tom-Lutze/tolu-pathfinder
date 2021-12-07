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
import { GraphBuilderType, StoreActionType } from './interfaces/interfaces';
import { capitalizeFirstLetter } from './utils/Helper';

const MenuItems = () => {
  const subMenuitems = [];
  for (const storeActionType in StoreActionType) {
    if (!isNaN(Number(storeActionType))) continue;
    const menuItems = [];
    for (const graphBuilderType in GraphBuilderType) {
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
        key={`sub-m-${storeActionType}`}
        icon={<BranchesOutlined />}
        title={`${storeActionType}`}
      >
        {menuItems}
      </SubMenu>
    );
    subMenuitems.push(subMenu);
  }
  return <React.Fragment key="test">{subMenuitems}</React.Fragment>;
};

const App = () => {
  const { Header, Content, Sider } = Layout;
  const globalState = useContext(store);
  const { dispatch } = globalState;
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background" collapsible>
          <Menu
            mode="inline"
            // defaultSelectedKeys={['1']}
            // defaultOpenKeys={['sub-m-algorithm']}
            style={{ height: '100%', borderRight: 0 }}
            onClick={(e) => dispatch({ type: e.key })}
          >
            <MenuItems />
          </Menu>
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
