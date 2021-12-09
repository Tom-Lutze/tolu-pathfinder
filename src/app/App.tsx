import { Layout } from 'antd';
import 'antd/dist/antd.css';
import React, { useContext } from 'react';
import MapComponent from '../app/map/MapComponent';
import { MainCatType } from '../interfaces';
import './App.css';
import AppMenu from './AppMenu';
import { storeContext } from './AppStore';

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
              graphType={appState.menu[MainCatType.Graph]}
              algoType={appState.menu[MainCatType.Algo]}
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
