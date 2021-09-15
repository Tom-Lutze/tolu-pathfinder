import { Row, Col, Slider } from 'antd';

const Grid = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={2} />
      <Col span={2} />
    </Row>
  );
};

export default Grid;
