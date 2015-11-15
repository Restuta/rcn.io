import React from 'react';
import Component from 'react-pure-render/component';
import './app.scss';
import Row from './atoms/Row.jsx';
import Col from './atoms/Col.jsx';
import Counter from './temp/Counter.jsx';
import Event from './temp/EventStub.jsx';
import TypographicScale from './temp/TypographicScale.jsx';


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

    const fontBaseSizePx = 14;

    const pStyle = ({fontSize}) => {
      return {
        fontSize: fontSize
      }
    };

    return (
      <div>
        <div className="container">
          <Row>
            <Col sm={16}>
              <h1 className="oswald">Road Races in CA, 100mi range</h1>
            </Col>
          </Row>
          <Row style={{marginTop: '40'}}>
            <Col sm={2} className="col outlined debug pink">August</Col>
            {genericWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug pink">{++i}<Event/></Col>)
            }
          </Row>
          <Row style={{marginTop: '20'}}>
            <Col sm={2} className="col debug outlined">August</Col>
            {genericWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<Event/></Col>)
            }
          </Row>
          <Row style={{marginTop: '20'}}>
            <Col sm={2} className="col debug outlined">August</Col>
            {roadWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<Event/></Col>)
            }
          </Row>
          <Row style={{marginTop: '20'}}>
            {fullSpaceWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<Event/></Col>)
            }
          </Row>

          <Row>
            <Col sm={4}>
              <h1 >NEW EVENT</h1>
              <p style={pStyle({fontSize: 14})}>
                Dunnigan hills road race. Usually held in Mountain view. This is 60mi away from you
                and looks like a 2h drive without a traffic.
              </p>
            </Col>
          </Row>


          <Counter increment={1} color="silver" marginTop="20px" />
          <TypographicScale baseSizeInPx={14} scale={1.333}>Perfect Fourth (by David Kadavy), 5 7 9 12 16 21 28 37 50 67 89 111 148</TypographicScale>
          <TypographicScale baseSizeInPx={15} scale={1.333}>Perfect Fourth (by David Kadavy)</TypographicScale>
          <TypographicScale baseSizeInPx={16} scale={1.333}>Perfect Fourth (by David Kadavy)</TypographicScale>
          <TypographicScale baseSizeInPx={fontBaseSizePx} scale={1.25}>Major Third</TypographicScale>
          <TypographicScale baseSizeInPx={fontBaseSizePx} scale={1.142}>Custom Scale</TypographicScale>
          <TypographicScale baseSizeInPx={fontBaseSizePx} scale={1.125}>Major Second</TypographicScale>
          <TypographicScale baseSizeInPx={16 } scale={1.125}>Major Second</TypographicScale>
          <TypographicScale baseSizeInPx={fontBaseSizePx} scale={1.20}>Minor Third</TypographicScale>

          <TypographicScale baseSizeInPx={fontBaseSizePx} scale={1.414}>Augmented Fourth</TypographicScale>
          <TypographicScale baseSizeInPx={fontBaseSizePx} scale={1.618}>Golden Ratio</TypographicScale>
          <TypographicScale baseSizeInPx={fontBaseSizePx} sizes={[1, 2, 3]}>Custom</TypographicScale>
        </div>
      </div>
    );
  }
}
