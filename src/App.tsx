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

const App = () => {
  const { Header, Content, Sider } = Layout;
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background" collapsible>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub-m-algorithm']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu
              key="sub-m-graph"
              icon={<BranchesOutlined />}
              title="Graph Builder"
            >
              <Menu.Item key="sub-i-none">None</Menu.Item>
              <Menu.Item key="sub-i-squre">Square</Menu.Item>
              <Menu.Item key="sub-i-random">Random</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub-m-algorithm"
              icon={<CompassOutlined />}
              title="Search Algorithm"
            >
              <Menu.Item key="1">Depth First Search</Menu.Item>
              <Menu.Item key="2">Breadth First Search</Menu.Item>
            </SubMenu>
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
