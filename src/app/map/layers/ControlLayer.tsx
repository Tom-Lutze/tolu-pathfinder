import { Card, Col, Row, Statistic, Table } from 'antd';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { GraphInterface, PathInterface } from '../../../interfaces';
import { algoMenuStrings, algoMenuStringsShort } from '../../constants/Strings';
import { AreaChartOutlined, CaretUpOutlined } from '@ant-design/icons';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
};

export const ControlLayer = (params: {
  graph: GraphInterface;
  path: PathInterface;
}) => {
  const [showStatistics, setShowStatistics] = useState(false);
  const controlLayerRef = useRef<any>();

  useEffect(() => {
    if (controlLayerRef) {
      L.DomEvent.disableClickPropagation(controlLayerRef.current);
      L.DomEvent.disableScrollPropagation(controlLayerRef.current);
    }
  }, [showStatistics]);

  const StatisticsLayer = () => {
    if (!showStatistics) {
      return (
        <Card className="tolu-statistics collapsed">
          <span className="extend-button">
            <a onClick={() => setShowStatistics(true)}>
              <AreaChartOutlined />
            </a>
          </span>
        </Card>
      );
    } else {
      return (
        <Card className="tolu-statistics">
          <Row justify="end">
            <Col>
              <span className="collapse-button">
                <a onClick={() => setShowStatistics(false)}>
                  <CaretUpOutlined />
                </a>
              </span>
            </Col>
          </Row>
          <Row gutter={[16, 40]}>
            <Col span={8}>
              <Statistic
                title="Nodes"
                value={Object.keys(params.graph.nodes).length}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Edges"
                value={
                  Object.keys(params.graph.nodes)
                    .map((key) => Number(key))
                    .reduce(
                      (prev: number, current: number, index: number) =>
                        prev + (params.graph.nodes[current].edges?.size ?? 0),
                      0
                    ) / 2
                }
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Visited"
                value={params.path.visitedNodesCounter}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: '16px' }}>
            <Col span={24}>
              <Table
                className="tolu-results-table"
                bordered={true}
                size="small"
                tableLayout="auto"
                pagination={false}
                dataSource={params.path.history
                  .sort((a, b) => a.visitedNodes - b.visitedNodes)
                  .map((ele) => {
                    return {
                      ...ele,
                      algo: ele.algo,
                      key: ele.algo,
                    };
                  })}
                columns={[
                  {
                    title: 'Visited',
                    dataIndex: 'visitedNodes',
                    key: 'visitedNodes',
                  },
                  {
                    title: 'Algorithm',
                    render: (algo: number) => (
                      <span key={algo} title={algoMenuStrings[algo]}>
                        {algoMenuStringsShort[algo]}
                      </span>
                    ),
                    dataIndex: 'algo',
                    key: 'algo',
                  },
                ]}
                rowClassName={(record) =>
                  record.isCurrent ? 'selected-row' : ''
                }
              />
            </Col>
          </Row>
        </Card>
      );
    }
  };
  return (
    <div ref={controlLayerRef}>
      <SwitchTransition>
        <CSSTransition
          key={showStatistics ? 'show' : 'hide'}
          addEndListener={(node, done) =>
            node.addEventListener('transitionend', done, false)
          }
          classNames="tolu-fade"
        >
          <div className={`${POSITION_CLASSES.topright} tolu-fade-comp`}>
            <div className="leaflet-control leaflet-bar">
              <StatisticsLayer />
            </div>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};
