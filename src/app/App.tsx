import { Layout } from 'antd';
import 'antd/dist/antd.less';
import React from 'react';
import MapComponent from '../app/map/MapComponent';
import './App.less';
import AppMenu from './ui/Menu';

const App = () => {
  const { Content, Sider } = Layout;
  return (
    <Layout>
      <Layout>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
          }}
          collapsible
        >
          <div className="logo" />
          <AppMenu />
        </Sider>
        <Layout className="site-layout">
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
