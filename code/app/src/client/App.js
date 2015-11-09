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
    let genericWeek = times(2, 7);
    let roadWeek = [1, 1, 1, 1, 2, 4, 4];

    return (
      <div>
        <div className="container">
          <Row>
            <Col sm={12}>
              <h1 className="oswald">Road Races in CA, 100mi range</h1>
            </Col>
          </Row>
          <Row style={{marginTop: '40'}}>
            <Col sm={2} className="col outlined debug pink"/>
            {genericWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug pink">{++i}<Event/></Col>)
            }
          </Row>
          <Row style={{marginTop: '20'}}>
            <Col sm={2} className="col debug outlined"/>
            {genericWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<Event/></Col>)
            }
          </Row>
          <Row style={{marginTop: '20'}}>
            <Col sm={2} className="col debug outlined"/>
            {roadWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<Event/></Col>)
            }
          </Row>
          <Counter increment={1} color="silver" marginTop="20px" />
        </div>
      </div>
    );
  }
}
