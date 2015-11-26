import React from 'react';
import Component from 'react-pure-render/component';
import './app.scss';
import Row from './atoms/Row.jsx';
import Col from './atoms/Col.jsx';
import Counter from './temp/Counter.jsx';
import EventStub from './temp/EventStub.jsx';
import Event from './calendar/Event.jsx';


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
    let fullSpaceWeek = times(2, 5).concat([3, 3]);

    return (
      <div>
        <div className="container">
          <div style={{marginTop: '2.666rem'}}></div>
          <Row>
            <Col sm={3} smOffset={3}>
              <Event width={197.5}
                name="Dunnigan Hills Road Race"/>
            </Col>
            <Col sm={3}>
              <Event width={197.5}
                name="RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"/>
            </Col>
            <Col sm={3}>
              <Event width={197.5}
                name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
            </Col>
          </Row>
          <Row>
            <Col sm={16}>
              <h1 className="oswald">Road Races in CA, 100mi range</h1>
            </Col>
          </Row>
          <Row>
            <Col sm={2} className="col outlined debug pink">August</Col>
            {genericWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug pink">{++i}<EventStub/></Col>)
            }
          </Row>
          <Row className="margin-top">
            <Col sm={2} className="col debug outlined">August</Col>
            {genericWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<EventStub/></Col>)
            }
          </Row>
          <Row className="margin-top">
            <Col sm={2} className="col debug outlined">August</Col>
            {roadWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<EventStub/></Col>)
            }
          </Row>
          <Row className="margin-top">
            {fullSpaceWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<EventStub/></Col>)
            }
          </Row>

          <Counter increment={1} color="silver" marginTop="20px" />
        </div>
      </div>
    );
  }
}
