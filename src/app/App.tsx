import { Layout } from 'antd';
import React, { useState } from 'react';
import MapComponent from '../app/map/MapComponent';
import AppMenu from './ui/Menu';

const App = () => {
  const { Content, Sider } = Layout;
  let [menuCollapsed, setMenuCollapsed] = useState(false);
  return (
    <Layout>
      <Layout>
        <Sider
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
              alt="TOLU Pathfinder logo"
            />
          </div>
          <AppMenu />
        </Sider>
        <Layout className="site-layout">
          <Content className="site-layout-content">
            <MapComponent />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
