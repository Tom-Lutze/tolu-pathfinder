import { Layout } from 'antd';
import React, { useState } from 'react';
import MapComponent from '../app/map/MapComponent';
import logo168 from '../assets/logo168.png';
import logo48 from '../assets/logo48.png';
import './App.less';
import { appStrings } from './constants/Strings';
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
              src={menuCollapsed ? logo48 : logo168}
              alt={appStrings.logoAlt}
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
