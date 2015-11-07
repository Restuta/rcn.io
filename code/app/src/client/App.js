import React from 'react';
import Component from 'react-pure-render/component';
import './app.scss';
import Row from './atoms/Row.jsx';
import Col from './atoms/Col.jsx';
import Counter from './temp/Counter.jsx';
import Event from './temp/EventStub.jsx';


function times(x, times) {
  let arr = [];

  for (let i = 0; i < times; i++) {
    arr.push(x);
  }

  return arr;
}

export class App extends Component {
  render() {
    let genericWeek = [2, 2, 2, 2, 2, 2, 2];
    let roadWeek = [1, 1, 1, 1, 2, 4, 4];
    let bsColumnsTest = times(1, 16);

    return (
      <div>
        <div className="container">
          <Row style={{marginTop: '20'}}>
            {bsColumnsTest.map((x, i) =>
              <Col key={i} sm={x}>{++i}<Event/></Col>)
            }
          </Row>
          <Row>
            <Col sm={12} className="transparent">
              <h1 className="oswald">Road Races in CA, 100mi range </h1>
            </Col>
          </Row>
          <Row>
            <Col className="col-sm-offset-1"/>
            {genericWeek.map((x, i) =>
              <Col key={i} sm={x}>{++i}<Event/> </Col>)
            }
          </Row>
          <Row style={{marginTop: '20'}}>
            <Col className="col-sm-offset-1"/>
            {roadWeek.map((x, i) =>
              <Col key={i} sm={x}>{++i}<Event/></Col>)
            }
          </Row>

        </div>
        <Counter increment={1} color="silver" marginTop="20px" />
      </div>
    );
  }
}
