import './Grid.css';
import { Row, Col, Slider } from 'antd';

const Grid = () => {
  return (
    <Row gutter={[16, 16]} className="app-grid">
      {new Array(24).fill(null).map((_, index) => {
        const key = index + 1;
        return (
          <Col span={1}>
            <div className="col-content">{key}</div>
          </Col>
        );
      })}
    </Row>
  );
};

export default Grid;
