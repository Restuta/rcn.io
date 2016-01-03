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


//TODO bc: remove these components
const S = ({width}) => (<span style={{width: `${width}px`}}></span>)
const S5 = () => (<S width={5}/>)
const S10 = () => (<S width={10}/>)

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      containerWidth: 1140, //setting dafault contaner to desktop
      appLevelClasses: 'debug-baseline debug-container'
    }

    this.onResize = this.onResize.bind(this)
    //TODO bc: remove me
    window.time = +new Date()
  }

  onResize() {
    this.setState({ //eslint-disable-line
      containerWidth: this.div.offsetWidth
    })
  }

  componentDidMount() {
    //TODO: this is used to get actual size from the browser after component is rendred and results in second react-pure-render
    //we can avoid this by moving that into top-level HOC that first gets size of the browser window and then renders children
    //into it passing actual size, so only topmost component would be rendred twice, which is few ms

    this.onResize() //calculate for the very first time
    //handling windw resize to recalculate components windth and re-render
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  render() {
    //TODO bc: remove me
    console.warn('app level render!  ' + ((+new Date()) - window.time) + 'ms')
    window.time = (+new Date())

    //TODO: move to grid.js
    const getCardWidth = (cardNo, containerW) => {
      const COLUMNS = 14
      const COL_BORDER_W = 1
      const GUTTER = 14

      const columnWidth = (containerW) / COLUMNS
      return (columnWidth * cardNo) - GUTTER - COL_BORDER_W
    }

    const cardWidth1 = getCardWidth(1, this.state.containerWidth)
    const cardWidth2 = getCardWidth(2, this.state.containerWidth)
    const cardWidth3 = getCardWidth(3, this.state.containerWidth)
    const cardWidth4 = getCardWidth(4, this.state.containerWidth)

    const setAppStateClasses = classesToSet => {
      this.setState({
        appLevelClasses: classNames('', classesToSet)
      })
    }

    return (
      <div className={this.state.appLevelClasses}>
        <DebugGrid setDebugClasses={setAppStateClasses}/>
        <div className="container" ref={(x) => this.div = x}>
          &nbsp;
          <div>
            <h2>EVENT COMPONENTS</h2>
            <p style={{fontSize:9}}>9px John C. Schlesinger Memorial Circuit Race and Team Time Trial</p>
            <p style={{fontSize:11}}>11px John C. Schlesinger Memorial Circuit Race and Team Time Trial</p>
            <p style={{fontSize:14}}>14px John C. Schlesinger Memorial Circuit Race and Team Time Trial</p>
            <p style={{fontSize:18}}>18px John C. Schlesinger Memorial Circuit Race and Team Time Trial</p>
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
          <Row className="margin-top">
            <Col sm={1} smOffset={1}><Event width={cardWidth1} name="Dh"/></Col>
            <Col sm={1}><Event width={cardWidth1} name="Rk"/></Col>
            <Col sm={1}><Event width={cardWidth1} name="Co"/></Col>
          </Row>
          <Row className="margin-top">
            <Col sm={2} smOffset={1}>
              <Event width={cardWidth2} name="Dunnigan Hills Road Race"/>
            </Col>
            <Col sm={2}>
              <Event width={cardWidth2} name="RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"/>
            </Col>
            <Col sm={2}>
              <Event width={cardWidth2} name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
            </Col>
            <Col sm={2}>
              <Event width={cardWidth2} name="Salinas Criterium"/>
            </Col>
          </Row>
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

          <h1 className="oswald">Road Races in CA, 100mi range</h1>

          {/* 16 col examples
          <WeekExample days={[1, 1, 1, 2, 3, 4, 4]}/>
          <WeekExample days={[1, 1, 1, 1, 4, 4, 4]}/>
          <WeekExample days={[1, 1, 2, 3, 3, 3, 3]}/>
          <WeekExample days={[1, 2, 2, 2, 3, 3, 3]}/>
          <WeekExample days={[2, 2, 2, 2, 2, 3, 3]}/>
          <WeekExample days={[2, 2, 2, 2, 2, 2, 2]} allSameSize/>
          <WeekExample days={[2, 2, 2, 2, 2, 3, 3]}/>
          <WeekExample days={[1, 1, 1, 1, 3, 4, 4]}/>
          <WeekExample days={[1, 1, 1, 1, 2, 5, 5]}/>
          */}

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
