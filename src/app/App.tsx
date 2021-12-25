import { Layout } from 'antd';
import 'antd/dist/antd.css';
import React, { useContext } from 'react';
import MapComponent from '../app/map/MapComponent';
import { MenuTypes } from '../interfaces';
import './App.css';
import AppMenu from './ui/Menu';
import { storeContext } from '../utils/Store';

const App = () => {
  const globalState = useContext(storeContext);
  const { appState } = globalState;

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
            <MapComponent
              graphType={appState.menu[MenuTypes.Graph]}
              algoType={appState.menu[MenuTypes.Algo]}
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
