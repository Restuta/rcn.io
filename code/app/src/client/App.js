import React from 'react';
import Component from 'react-pure-render/component';
import './app.scss';
import Row from './atoms/Row.jsx';
import Col from './atoms/Col.jsx';
import Counter from './tmp/Counter.jsx';



export class App extends Component { // eslint-disable-line react/no-multi-comp
  render() {
    let columns = [];
    for (let i = 1; i <= 31; i++) {
      columns.push(<div key={i} className="col-sm-2">{i}</div>);
    }

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 transparent">
              <h1 className="oswald">Road Races in CA, 100mi range </h1>
            </div>
          </div>
          <Row>
            <Col xs={1} md={2}>test</Col>
          </Row>
          <Row className="bla">
            {columns}
          </Row>
        </div>
        <Counter increment={1} color="silver" marginTop="20px" />
      </div>
    );
  }
}
