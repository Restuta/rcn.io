import React from 'react'
import Component from 'react-pure-render/component'
import './styles/bootstrap.scss'
import './app.scss'
import Row from './atoms/Row.jsx'
import Col from './atoms/Col.jsx'
import Icon from './atoms/Icon.jsx'
import Event, { EventName } from './calendar/Event.jsx'
import Badge from './calendar/badges/Badge.jsx'
import RoundBadge from './calendar/badges/RoundBadge.jsx'
import SquareBadge from './calendar/badges/SquareBadge.jsx'
import Colors from './styles/colors'
import WeekExample from './temp/WeekExample.jsx'
import Grid from './styles/grid'
import Typography from './styles/typography'

//TODO: remove these components
const Spacer = ({width}) => (<span style={{width: `${width}px`}}></span>)
const S5 = () => (<Spacer width={5}/>)
const S10 = () => (<Spacer width={10}/>)

export default class Dev extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const sizeToPx = size => (Typography.BASE_FONT_SIZE_PX * Typography.scaleUp(size)) + 'px'
    const getFontSize = size => Typography.scaleUp(size) + 'rem'
    const eventName = `John C. Schlesinger Memorial Circuit Race and Team Time Trial AND SOME UPPER CASE
    John C. Schlesinger Memorial Circuit Race and Team Time Trial
    John C. Schlesinger Memorial Circuit Race and Team Time Trial
    John C. Schlesinger Memorial Circuit Race and Team Time Trial
    John C. Schlesinger Memorial Circuit Race and Team Time Trial
    JOHN C. SCHLESINGER MEMORIAL CIRCUIT RACE AND TEAM TIME TRIAL
    JOHN C. SCHLESINGER MEMORIAL CIRCUIT RACE AND TEAM TIME TRIAL
    JOHN C. SCHLESINGER MEMORIAL CIRCUIT RACE AND TEAM TIME TRIAL
    `

    let containerWidth = null

    if (this.props.containerWidth) {
      containerWidth = <span style={{color: 'grey'}}>{this.props.containerWidth}<small>PX</small></span>
    } else {
      containerWidth = <span style={{color: 'salmon'}}>UNDEFINED</span>
    }

    return (
      <div>
        <h1>{this.props.foo}</h1>
        <h1>H1 {sizeToPx(7)} {eventName} <Icon name="bicycle"/> </h1>
        <h2>H2 {sizeToPx(5)} {eventName}</h2>
        <h3>H3 {sizeToPx(4)} {eventName}</h3>
        <h4>H4 {sizeToPx(3)} {eventName}</h4>
        <h5>H5 {sizeToPx(2)} {eventName}</h5>

        <h2>EVENT COMPONENTS, container {containerWidth}</h2>
        <p className={'text-sm-9'} style={{fontSize:9}}>{'9px'} {eventName}</p>
        <p className={'text-' + 1} style={{fontSize:getFontSize(1)}}>{sizeToPx(1)} {eventName}</p>
        <p className={'text-sm-11'} style={{fontSize:11}}>{'11px'} {eventName}</p>
        <p className={'text-sm-12'} style={{fontSize:12}}>{'12px'} {eventName}</p>

        <p className={'text-' + 2} style={{fontSize:getFontSize(2)}}>{sizeToPx(2)} {eventName}</p>
        <p className={'text-' + 3} style={{fontSize:getFontSize(3)}}>{sizeToPx(3)} {eventName}</p>
        <p className={'text-' + 4} style={{fontSize:getFontSize(4)}}>{sizeToPx(4)} {eventName}</p>
        <p className={'text-' + 5} style={{fontSize:getFontSize(5)}}>{sizeToPx(5)} {eventName}</p>
        <p className={'text-' + 6} style={{fontSize:getFontSize(6)}}>{sizeToPx(6)} {eventName}</p>
        <p className={'text-' + 7} style={{fontSize:getFontSize(7)}}>{sizeToPx(7)} {eventName}</p>
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

        {/* CARDS CARDS CARDS*/}
        {/* CARDS CARDS CARDS*/}
        {/* CARDS CARDS CARDS*/}

        <Row className="margin-top">
          <Col sm={14} className="debug-flex-cards">
            <Event debug width={1} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
            <Event debug width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL}
              name="RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"/>
            <Event debug width={3} baseHeight={5} containerWidth={Grid.ContainerWidth.XL}
              name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
            <Event debug width={4} baseHeight={5} containerWidth={Grid.ContainerWidth.XL}
              name="RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"/>
          </Col>
        </Row>

        <Row className="margin-top">
          <Col sm={14} className="debug-flex-cards">
            <Event debug width={1} baseHeight={4} containerWidth={Grid.ContainerWidth.LG}
              name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
            <Event debug width={2} baseHeight={4} containerWidth={Grid.ContainerWidth.LG}
              name="RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"/>
            <Event debug width={3} baseHeight={4} containerWidth={Grid.ContainerWidth.LG}
              name="RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"/>
            <Event debug width={4} baseHeight={4} containerWidth={Grid.ContainerWidth.LG}
              name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
          </Col>
        </Row>

        <Row className="margin-top">
          <Col sm={14} className="debug-flex-cards">
            <Event debug width={1} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} name="Dunnigan Hills Road Race"/>
            <Event debug width={2} baseHeight={3} containerWidth={Grid.ContainerWidth.MD}
              name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
            <Event debug width={3} baseHeight={3} containerWidth={Grid.ContainerWidth.MD}
              name="RED KITE OMNIUM EVENT #1 - THE BUMP CIRCUIT RACE (WINTER)"/>
            <Event debug width={4} baseHeight={3} containerWidth={Grid.ContainerWidth.MD}
              name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
          </Col>
        </Row>

        <Row className="margin-top">
          <Col sm={14} className="debug-flex-cards">
            <Event debug width={1} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} name="Dunnigan Hills Road Race"/>
            <Event debug width={2} baseHeight={2} containerWidth={Grid.ContainerWidth.SM}
              name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
            <Event debug width={3} baseHeight={2} containerWidth={Grid.ContainerWidth.SM}
              name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
            <Event debug width={4} baseHeight={2} containerWidth={Grid.ContainerWidth.SM}
              name="John C. Schlesinger Memorial Circuit Race and Team Time Trial"/>
          </Col>
        </Row>

        <Row className="margin-top">
          <Col sm={1}><Event debug width={1} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} name="Sc"/></Col>
          <Col sm={1}><Event debug width={1} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} name="Dh"/></Col>
          <Col sm={1}><Event debug width={1} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} name="Colavita Criterium"/></Col>
          <Col sm={1}><Event debug width={1} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Red Kite Omnium"/></Col>
        </Row>
        <Row className="margin-top">
          <Col sm={2}>
            <Event debug width={2} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} name="Dunnigan Hills Road Race"/>
          </Col>
          <Col sm={2}>
            <Event debug width={2} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} name="Dunnigan Hills Road Race"/>
          </Col>
          <Col sm={2}>
            <Event debug width={2} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} name="Dunnigan Hills Road Race"/>
          </Col>
          <Col sm={2}>
            <Event debug width={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Col>
        </Row>

        <Row className="margin-top">
          <Col sm={2}>
            <Event debug width={3} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} name="Dunnigan Hills Road Race"/>
          </Col>
          <Col sm={2}>
            <Event debug width={3} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} name="Dunnigan Hills Road Race"/>
          </Col>
          <Col sm={2}>
            <Event debug width={3} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} name="Dunnigan Hills Road Race"/>
          </Col>
          <Col sm={2}>
            <Event debug width={3} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Col>
        </Row>

        <Row className="margin-top">
          <Col sm={2}>
            <Event debug width={4} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} name="Dunnigan Hills Road Race"/>
          </Col>
          <Col sm={2}>
            <Event debug width={4} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} name="Dunnigan Hills Road Race"/>
          </Col>
          <Col sm={2}>
            <Event debug width={4} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} name="Dunnigan Hills Road Race"/>
          </Col>
          <Col sm={2}>
            <Event debug width={4} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} name="Dunnigan Hills Road Race"/>
          </Col>
        </Row>

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

      </div>
    )
  }
}
