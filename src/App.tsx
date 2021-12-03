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
import { useContext } from 'react';
import { store } from './Store';

const App = () => {
  const { Header, Content, Sider } = Layout;
  const globalState = useContext(store);
  const { dispatch } = globalState;
  console.log(JSON.stringify(globalState));
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
            onClick={(e) => dispatch({ type: e.key })}
          >
            <SubMenu
              key="sub-m-graph"
              icon={<BranchesOutlined />}
              title="Graph Builder"
            >
              <Menu.Item key="graph-none">None</Menu.Item>
              <Menu.Item key="graph-square">Square</Menu.Item>
              <Menu.Item key="graph-random">Random</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub-m-algorithm"
              icon={<CompassOutlined />}
              title="Search Algorithm"
            >
              <Menu.Item key="algo-dfs">Depth First Search</Menu.Item>
              <Menu.Item key="algo-bfs">Breadth First Search</Menu.Item>
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
