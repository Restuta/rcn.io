import React from 'react';
import Component from 'react-pure-render/component';
import './app.scss';
import Row from './atoms/Row.jsx';
import Col from './atoms/Col.jsx';
import Counter from './tmp/Counter.jsx';
import Event from './tmp/EventStub.jsx';

export class App extends Component {
  render() {
    let genericWeek = [2, 2, 2, 2, 2, 2, 2];
    let roadWeek = [1, 1, 1, 1, 2, 4, 4];

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 transparent">
              <h1 className="oswald">Road Races in CA, 100mi range </h1>
            </div>
          </div>
          <Row>
            <Col className="col-sm-offset-1" />
            {genericWeek.map((x, i) =>
              <Col key={i} sm={x}>{++i}<Event/></Col>)
            }
          </Row>
          <Row style={{marginTop: "20"}}>
            <Col className="col-sm-offset-1" />
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
