import React, { useEffect, useRef, useState } from 'react';
import { Layout } from 'antd';
import MapComponent from './map/Map';
import Sidebar from './menu/Sidebar';
import { appStrings } from './constants/Strings';
import logo168 from '../assets/logo168.png';
import logo48 from '../assets/logo48.png';
import '../styles/Styles.less';
import PerfectScrollbar from 'react-perfect-scrollbar';

/** Main component that provides the basic UI-layout. */
const App = () => {
  const { Content, Sider } = Layout;
  let [menuCollapsed, setMenuCollapsed] = useState(false);
  const scrollbar = useRef<any>();
  return (
    <Layout>
      <Layout>
        <Sider
          collapsible
          breakpoint="md"
          onCollapse={(collapsed) => {
            setMenuCollapsed(collapsed);
            if (scrollbar.current)
              setTimeout(() => scrollbar.current.updateScroll(), 200);
          }}
        >
          <div className="logo">
            <img
              src={menuCollapsed ? logo48 : logo168}
              alt={appStrings.logoAlt}
            />
          </div>
          <PerfectScrollbar ref={scrollbar}>
            <Sidebar scrollbar={scrollbar} collapsed={menuCollapsed} />
          </PerfectScrollbar>
        </Sider>
        <Layout className="site-layout">
          <Content className="site-layout-content">
            <MapComponent menuCollapsed={menuCollapsed} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
