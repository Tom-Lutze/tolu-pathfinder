import { AreaChartOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Table } from 'antd';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { GraphInterface, PathInterface } from '../../../interfaces';
import { algoMenuStrings, algoMenuStringsShort } from '../../constants/Strings';

export const StatisticsLayer = (params: {
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

  const StatisticsContent = () => {
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
          <div className="leaflet-top leaflet-right tolu-fade-comp">
            <div className="leaflet-control leaflet-bar">
              <StatisticsContent />
            </div>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};
