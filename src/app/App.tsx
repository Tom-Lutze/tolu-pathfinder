import { Layout } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import MapComponent from '../app/map/MapComponent';
import './App.css';
import AppMenu from './AppMenu';
import { StoreProvider } from './AppStore';

const App = () => {
  const { Header, Content, Sider } = Layout;
  return (
    <StoreProvider>
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
    </StoreProvider>
  );
};

export default App;
