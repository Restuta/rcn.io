import React from 'react';
import Component from 'react-pure-render/component';
import './app.scss';
import Row from './atoms/Row.jsx';
import Col from './atoms/Col.jsx';
import Icon from './atoms/Icon.jsx';
import Counter from './temp/Counter.jsx';
import EventStub from './temp/EventStub.jsx';
import Event, {EventName, RoundBadge, Badge} from './calendar/Event.jsx';
import Colors from './styles/colors';


function times(x, numberOfTimes) {
  let arr = [];

  for (let i = 0; i < numberOfTimes; i++) {
    arr.push(x);
  }

  return arr;
}

//TODO bc: remove this components
const S = ({width}) => (<span style={{width: `${width}px`}}></span>);
const S5 = () => (<S width={5}/>);
const S10 = () => (<S width={10}/>);

export class App extends Component {
  render() {
    let genericWeek = times(2, 7);
    let roadWeek = [1, 1, 1, 1, 2, 4, 4];
    let fullSpaceWeek = times(2, 5).concat([3, 3]);
    let fullSpaceWeek3x3 = [1, 2, 2, 2, 3, 3, 3];
    let fullSpaceWeek4x3 = [1, 1, 2, 3, 3, 3, 3];
    let fullSpaceWeek2x4 = [1, 1, 1, 2, 3, 4, 4];
    let fullSpaceWeek3x4 = [1, 1, 1, 1, 4, 4, 4];

    return (
      <div>
        <div className="container">
          <div className="margin-top"></div>
          <div>
            <h2>EVENT COMPONENTS:</h2>
            <Row>
              <Col sm={2}><h5>Name: </h5></Col>
              <Col sm={3}><EventName className="debug">John C. Schlesinger Memorial Circuit Race and Team Time Trial</EventName></Col>
            </Row>
            <Row className="margin-top">
              <Col sm={2}><h5>Round Badges: </h5></Col>
              <Col sm={14} className="display-flex">
                <RoundBadge size={2}>8</RoundBadge>
                <RoundBadge size={1}>8</RoundBadge>
                <RoundBadge size={2}><Icon name="map-marker"/></RoundBadge>
                <RoundBadge size={1}><Icon name="map-marker"/></RoundBadge>
                <RoundBadge size={2}><Icon name="car"/></RoundBadge>
                <RoundBadge size={1}><Icon name="car"/></RoundBadge>
                <RoundBadge size={2}>RR</RoundBadge>
                <RoundBadge size={1}>RR</RoundBadge>
                <RoundBadge size={2}>TT</RoundBadge>
                <RoundBadge size={1}>TT</RoundBadge>
              </Col>
            </Row>
            <Row>
              <Col sm={2}><h5>Not so Round Badges: </h5></Col>
              <Col sm={14} className="display-flex">
                <Badge>120mi</Badge><S5/>
                <Badge>8</Badge><S5/>
                <Badge><Icon name="trophy"/></Badge><S5/>
                <Badge><Icon name="sun-o"/></Badge><S5/>
                <Badge><Icon name="map-marker"/>Monterey, CA</Badge>
              </Col>
            </Row>
            <Row>
              <Col sm={2}><h5>Elevation:</h5></Col>
              <Col sm={14} className="display-flex">
                <Icon name="arrow-up" color={Colors.greyLvl30}/>1200ft<S10/>
                <Icon name="long-arrow-up" color={Colors.greyLvl30}/>1200ft<S10/>
                <Badge><Icon name="arrow-up"/>1200ft<S10/></Badge><S5/>
                <Badge><Icon name="long-arrow-up" />1200ft<S10/></Badge>
              </Col>
            </Row>
            <Row>
              <Col sm={2}><h5>Distance:</h5></Col>
              <Col sm={14} className="display-flex">
                <Icon name="bicycle" color={Colors.greyLvl30}/>20mi<S10/>
                <Badge><Icon name="bicycle"/>20mi</Badge><S10/>
                44mi 60mi 120mi
              </Col>
            </Row>
            <Row>
              <Col sm={2}><h5>Duration:</h5></Col>
              <Col sm={14} className="display-flex">
                <Icon name="hourglass-start" color={Colors.greyLvl30}/>60min
                <S10/>
                <Badge><Icon name="hourglass-start"/>60min</Badge><S5/>
                <Icon name="hourglass-o" color={Colors.greyLvl30}/>60min<S10/>
                <Icon name="hourglass" color={Colors.greyLvl30} />60min<S10/>
                <Icon name="hourglass-half" color={Colors.greyLvl30}/>60min<S10/>
              </Col>
            </Row>

          </div>

          <Row className="margin-top">
            <Col sm={2} smOffset={1}>
              <Event width={125}
                name="Dunnigan Hills Road Race"/>
            </Col>
            <Col sm={2}>
              <Event width={125}
                name="RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"/>
            </Col>
            <Col sm={2}>
              <Event width={125}
                name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
            </Col>
            <Col sm={2}>
              <Event width={125}
                name="Salinas Criterium"/>
            </Col>
          </Row>
          <Row className="margin-top">
            <Col sm={3} smOffset={1}>
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
            <Col sm={3}>
              <Event width={197.5}
                name="Salinas Criterium"/>
            </Col>
          </Row>
          <Row className="margin-top">
            <Col sm={4} smOffset={1}>
              <Event width={270}
                name="Dunnigan Hills Road Race"/>
            </Col>
            <Col sm={4}>
              <Event width={270}
                name="RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"/>
            </Col>
            <Col sm={4}>
              <Event width={270}
                name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
            </Col>
          </Row>

          <h1 className="oswald">Road Races in CA, 100mi range</h1>
          <Row className="margin-top">
            {fullSpaceWeek2x4.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<EventStub/></Col>)
            }
          </Row>
          <Row className="margin-top">
            {fullSpaceWeek3x4.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<EventStub/></Col>)
            }
          </Row>
          <Row className="margin-top">
            {fullSpaceWeek4x3.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<EventStub/></Col>)
            }
          </Row>
          <Row className="margin-top">
            {fullSpaceWeek3x3.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<EventStub/></Col>)
            }
          </Row>
          <Row className="margin-top">
            {fullSpaceWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<EventStub/></Col>)
            }
          </Row>
          <Row className="margin-top">
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
          <Counter increment={1} color="silver" marginTop="20px" />
        </div>
      </div>
    );
  }
}
