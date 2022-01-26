import { AreaChartOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Table } from 'antd';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { GraphInterface, PathInterface } from '../../../interfaces/Interfaces';
import {
  algoMenuStrings,
  algoMenuStringsShort,
  appStrings,
} from '../../constants/Strings';

/** Provides statistics for the current graph and lists all results
 * for search algorithms that were executed on the current graph.
 * The component is wrapped by a {@link SwitchTransition} to allow
 * animations for the collapse event. */
export const Statistics = (params: {
  graph: GraphInterface;
  path: PathInterface;
}) => {
  const [showStatistics, setShowStatistics] = useState(false);
  const controlLayerRef = useRef<any>();

  // prevent forwarding of click events to the map component
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
            <a
              onClick={() => setShowStatistics(true)}
              title={appStrings.statisticsTitle}
            >
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
                title={appStrings.statisticsNodesTitle}
                value={Object.keys(params.graph.nodes).length}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title={appStrings.statisticsEdgesTitle}
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
                title={appStrings.statisticsVisitedTitle}
                value={params.path.visitedNodesCounter}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: '16px' }}>
            <Col span={24}>
              <Table
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
                    title: appStrings.statisticsVisitedTitle,
                    dataIndex: 'visitedNodes',
                    key: 'visitedNodes',
                  },
                  {
                    title: appStrings.statisticsAlgorithmTitle,
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
