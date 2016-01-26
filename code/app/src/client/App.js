import React from 'react'
import Component from 'react-pure-render/component'
import './app.scss'
import Row from './atoms/Row.jsx'
import Col from './atoms/Col.jsx'
import Icon from './atoms/Icon.jsx'
import Counter from './temp/Counter.jsx'
import Event, {
  EventName, RoundBadge, Badge, SquareBadge
} from './calendar/Event.jsx'
import Colors from './styles/colors'
import DebugGrid from './temp/DebugGrid.jsx'
import WeekExample from './temp/WeekExample.jsx'
import classNames from 'classnames'
import Grid from './styles/grid'

//TODO bc: remove these components
const S = ({width}) => (<span style={{width: `${width}px`}}></span>)
const S5 = () => (<S width={5}/>)
const S10 = () => (<S width={10}/>)

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = { appLevelClasses: 'debug-baseline debug-container' }
  }

  render() {
    //const containerWidth = this.props.containerWidth
    console.info(this.props.containerWidth)

    const setAppStateClasses = classesToSet => {
      this.setState({
        appLevelClasses: classNames('', classesToSet)
      })
    }

    //<Event baseHeight={2} width={1} name="Dunnigan Hills Road Race"/>

    return (
      <div className={this.state.appLevelClasses}>
        <DebugGrid setDebugClasses={setAppStateClasses}/>
        <div className="container" ref={(x) => this.div = x}>
          <div>
            &nbsp;
            <h2>EVENT COMPONENTS {this.props.containerWidth}<small>PX</small></h2>
            <p style={{fontSize:9}}>9px John C. Schlesinger Memorial Circuit Race and Team Time Trial</p>
            <p style={{fontSize:11}}>11px John C. Schlesinger Memorial Circuit Race and Team Time Trial</p>
            <p style={{fontSize:14}}>14px John C. Schlesinger Memorial Circuit Race and Team Time Trial</p>
            <p style={{fontSize:18}}>18px John C. Schlesinger Memorial Circuit Race and Team Time Trial</p>
            <p style={{fontSize:23}}>23px John C. Schlesinger Memorial Circuit Race and Team Time Trial</p>
            <p style={{fontSize:29}}>29px John C. Schlesinger Memorial Circuit Race and Team Time Trial</p>
            <Row>
              <Col sm={2}><h5>Name: </h5></Col>
              <Col sm={3}><EventName className="debug">John C. Schlesinger Memorial Circuit Race and Team Time Trial</EventName></Col>
            </Row>
            <Row className="margin-top">
              <Col sm={2}><h5>Round Badges: </h5></Col>
              <Col sm={12} className="display-flex">
                <RoundBadge size={2}>8</RoundBadge>
                <RoundBadge size={1}>8</RoundBadge>
                <RoundBadge size={2}><Icon name="car"/></RoundBadge>
                <RoundBadge size={1}><Icon name="car"/></RoundBadge>
                <RoundBadge size={2}>RR</RoundBadge>
                <RoundBadge size={1}>RR</RoundBadge>
                <RoundBadge size={2}>TT</RoundBadge>
                <RoundBadge size={1}>TT</RoundBadge><S5/>
                <RoundBadge size={2} className="Inverted">RR</RoundBadge><S5/>
                <RoundBadge size={2} className="Inverted">8</RoundBadge><S5/>
                <RoundBadge size={1} className="Inverted">8</RoundBadge><S5/>
                <RoundBadge size={2} className="Inverted"><Icon name="car"/></RoundBadge><S5/>
                <RoundBadge size={1} className="Inverted"><Icon name="car"/></RoundBadge>
              </Col>
            </Row>
            <Row>
              <Col sm={2}><h5>Not so Round Badges: </h5></Col>
              <Col sm={12} className="display-flex">
                <Badge>120mi</Badge><S5/>
                <Badge>8</Badge><S5/>
                <Badge><Icon name="trophy"/></Badge><S5/>
                <Badge><Icon name="sun-o"/></Badge><S5/>
                <Badge><Icon name="map-marker"/><S5/>Monterey, CA</Badge><S5/>
                <Badge className="Inverted"><Icon name="map-marker"/><S5/>Monterey, CA</Badge>
              </Col>
            </Row>
            <Row>
              <Col sm={2}><h5>Square Badges: </h5></Col>
              <Col sm={12} className="display-flex">
                <SquareBadge>120mi</SquareBadge><S5/>
                <SquareBadge>8</SquareBadge><S5/>
                <SquareBadge><Icon name="trophy"/></SquareBadge><S5/>
                <SquareBadge><Icon name="sun-o"/></SquareBadge><S5/>
                <SquareBadge><Icon name="map-marker"/><S5/>Monterey, CA</SquareBadge>
              </Col>
            </Row>
            <Row>
              <Col sm={2}><h5>Square Badges (Inverted): </h5></Col>
              <Col sm={12} className="display-flex">
                <SquareBadge className="Inverted">120mi</SquareBadge><S5/>
                <SquareBadge className="Inverted">8</SquareBadge><S5/>
                <SquareBadge className="Inverted"><Icon name="trophy"/></SquareBadge><S5/>
                <SquareBadge className="Inverted"><Icon name="sun-o"/></SquareBadge><S5/>
                <SquareBadge className="Inverted"><Icon name="map-marker"/><S5/>Monterey, CA</SquareBadge>
              </Col>
            </Row>
            <Row>
              <Col sm={2}><h5>Elevation:</h5></Col>
              <Col sm={12} className="display-flex">
                <Icon name="arrow-up" color={Colors.grey500}/>1200ft<S10/>
                <Icon name="long-arrow-up" color={Colors.grey500}/>1200ft<S10/>
                <Badge><Icon name="arrow-up"/>1200ft<S10/></Badge><S5/>
                <Badge><Icon name="long-arrow-up" />1200ft<S10/></Badge>
              </Col>
            </Row>
            <Row>
              <Col sm={2}><h5>Distance:</h5></Col>
              <Col sm={12} className="display-flex">
                <Icon name="bicycle" color={Colors.grey500}/>20mi<S10/>
                <Badge><Icon name="bicycle"/>20mi</Badge><S10/>
                <Badge className="Inverted"><Icon name="bicycle"/>20mi</Badge><S10/>
                44mi 60mi 120mi
              </Col>
            </Row>
            <Row>
              <Col sm={2}><h5>Duration:</h5></Col>
              <Col sm={12} className="display-flex">
                <Icon name="hourglass-start" color={Colors.grey500}/>60min
                <S10/>
                <Badge><Icon name="hourglass-start"/>60min</Badge><S5/>
                <Icon name="hourglass-o" color={Colors.grey500}/>60min<S10/>
                <Icon name="hourglass" color={Colors.grey500} />60min<S10/>
                <Icon name="hourglass-half" color={Colors.grey500}/>60min<S10/>
              </Col>
            </Row>
          </div>

          {/* CARDS CARDS CARDS*/}
          {/* CARDS CARDS CARDS*/}
          {/* CARDS CARDS CARDS*/}

          <Row className="margin-top">
            <Col sm={14} className="debug-flex-cards">
              <Event width={1} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} name="Sc"/>
              <Event width={1} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} name="Dh"/>
              <Event width={1} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} name="Co"/>
              <Event width={1} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Rk"/>
            </Col>
          </Row>

          <Row className="margin-top">
            <Col sm={14} className="debug-flex-cards">
              <Event width={2} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} name="Dunnigan Hills Road Race"/>
              <Event width={2} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} name="Dunnigan Hills Road Race"/>
              <Event width={2} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} name="Dunnigan Hills Road Race"/>
              <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            </Col>
          </Row>

          <Row className="margin-top">
            <Col sm={14} className="debug-flex-cards">
              <Event width={3} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} name="Dunnigan Hills Road Race"/>
              <Event width={3} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} name="Dunnigan Hills Road Race"/>
              <Event width={3} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} name="Dunnigan Hills Road Race"/>
              <Event width={3} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            </Col>
          </Row>

          <Row className="margin-top">
            <Col sm={14} className="debug-flex-cards">
              <Event width={4} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} name="Dunnigan Hills Road Race"/>
              <Event width={4} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} name="Dunnigan Hills Road Race"/>
              <Event width={4} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} name="Dunnigan Hills Road Race"/>
              <Event width={4} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            </Col>
          </Row>

          <Row className="margin-top">
            <Col sm={1} smOffset={1}><Event width={1} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} name="Sc"/></Col>
            <Col sm={1}><Event width={1} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} name="Dh"/></Col>
            <Col sm={1}><Event width={1} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} name="Co"/></Col>
            <Col sm={1}><Event width={1} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Rk"/></Col>
          </Row>
          <Row className="margin-top">
            <Col sm={2} smOffset={1}>
              <Event width={2} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} name="Dunnigan Hills Road Race"/>
            </Col>
            <Col sm={2}>
              <Event width={2} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} name="Dunnigan Hills Road Race"/>
            </Col>
            <Col sm={2}>
              <Event width={2} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} name="Dunnigan Hills Road Race"/>
            </Col>
            <Col sm={2}>
              <Event width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            </Col>
          </Row>
          {/*
          <Row className="margin-top">
            <Col sm={3} smOffset={1}>
              <Event width={cardWidth3} name="Dunnigan Hills Road Race"/>
            </Col>
            <Col sm={3}>
              <Event width={cardWidth3} name="RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"/>
            </Col>
            <Col sm={3}>
              <Event width={cardWidth3} name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
            </Col>
            <Col sm={3}>
              <Event width={cardWidth3} name="Salinas Criterium"/>
            </Col>
          </Row>
          <Row className="margin-top">
            <Col sm={4} smOffset={1}>
              <Event width={cardWidth4} name="Dunnigan Hills Road Race"/>
            </Col>
            <Col sm={4}>
              <Event width={cardWidth4} name="RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"/>
            </Col>
            <Col sm={4}>
              <Event width={cardWidth4} name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
            </Col>
          </Row>

          */}

          <h1 className="oswald">Road Races in CA, 100mi range</h1>

          <WeekExample days={[1, 1, 1, 2, 2, 3, 4]}/>

          <WeekExample days={[1, 1, 1, 1, 2, 4, 4]}/>
          <WeekExample days={[1, 1, 1, 1, 3, 3, 4]}/>
          <WeekExample days={[1, 1, 1, 2, 2, 3, 4]}/>
          <WeekExample days={[1, 1, 2, 2, 2, 2, 4]}/>

          <WeekExample days={[1, 1, 1, 2, 3, 3, 3]}/>
          <WeekExample days={[1, 1, 2, 2, 2, 3, 3]}/>
          <WeekExample days={[1, 2, 2, 2, 2, 2, 3]}/>
          <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} allSameSize/>
          <WeekExample days={[2, 2, 2, 2, 2, 2, 2]}/>


          <Counter increment={1} color="silver" marginTop="20px" />
        </div>
      </div>
    )
  }
}
