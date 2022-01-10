import { Layout } from 'antd';
import React, { useState } from 'react';
import MapComponent from '../app/map/MapComponent';
import './App.less';
import AppMenu from './ui/Menu';

const App = () => {
  const { Content, Sider } = Layout;
  let [menuCollapsed, setMenuCollapsed] = useState(false);
  return (
    <Layout>
      <Layout>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
          }}
          collapsible
          defaultCollapsed={menuCollapsed}
          onCollapse={(collapsed) => {
            setMenuCollapsed(collapsed);
          }}
        >
          <div className="logo">
            <img
              src={`${process.env.PUBLIC_URL}/${
                menuCollapsed ? 'logo48' : 'logo168'
              }.png`}
              width="100%"
              height="auto"
            />
          </div>
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
