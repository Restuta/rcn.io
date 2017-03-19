/* eslint-disable max-len */
import React from 'react'
import Component from 'react-pure-render/component'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import Button from 'atoms/Button.jsx'
import Icon from 'atoms/Icon.jsx'
import Event from 'calendar/events/Event.jsx'
import Badge from 'calendar/badges/Badge.jsx'
import RoundBadge from 'calendar/badges/RoundBadge.jsx'
import Colors from 'styles/colors'
import Grid from 'styles/grid'
import Typography from 'styles/typography'
import Spinner from 'atoms/Spinner.jsx'
import UsacLogo from 'atoms/UsacLogo.jsx'

import { Link } from 'react-router'
import Alert from 'atoms/Alert.jsx'

//TODO: remove these components
const Spacer = ({ width }) => <span style={{width: `${width}px`}}>&nbsp;</span>
const S5 = () => <Spacer width={5}/>
const S10 = () => <Spacer width={10}/>

const ContainerHeader = ({label, width}) => {
  return (
    <div>
      <h3>{label} — {width}px</h3>
      <hr />
    </div>
  )
}


export default class Dev extends Component {
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

    const shortEventName = 'Land Park Criterium'
    // const longEventName = 'Chico Stage Race pb Sierra Nevada Brewing Co - Stage 4: Steve Harrison Memorial Criterium'
    const longEventName = 'NCNCA Masters Criterium Championships - Red Kite Omnium Event #15 - Red Kite Omnium Championship Weekend: Day 2'

    let containerWidth = null

    if (this.props.containerWidth) {
      containerWidth = <span style={{color: 'grey'}}>{this.props.containerWidth}<small>PX</small></span>
    } else {
      containerWidth = <span style={{color: 'salmon'}}>UNDEFINED</span>
    }

    return (
      <div>
        <div>
          <Link
            key={8}
            to={{
              pathname: '/events/evt-8',
              state: { modal: true, returnUrl: this.context.locationPathname }
            }}>Open Modal</Link>
        </div>
        <div>
          <Link
            key={9}
            to={{
              pathname: '/mtb',
              state: { modal: true, returnUrl: this.context.locationPathname }
            }}>Open Dev</Link>
        </div>
        <h1>{this.props.foo}</h1>
        <h1>H1 {sizeToPx(7)} {eventName} <Icon name="directions_bike"/> </h1>
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

        <Row className="margin-top">
          <Col sm={14}><h2>ALERTS</h2></Col>
          <Col sm={14}>
            <Alert type="info"><strong>Heads up! </strong>
              Info Alert. It can explain to you some more or less important things or maybe not. Also let this one
              have a long text so it can wrap and we can see it.
            </Alert>
            <Alert type="warning">Warn Alert. Use it sparingly!</Alert>
            <Alert type="success">Success Alert. You did great!</Alert>
            <Alert type="danger">Danger Alert. Careful, make sure you are sure!</Alert>
          </Col>
        </Row>

        <Row className="margin-top">
          <Col sm={14}>
            <h2>BUTTONS</h2>
            <Button icon="check_circle" size="sm" type="primary">SM PRIMARY</Button><S5 />
            <Button icon="cancel" size="sm" type="secondary">SM SECONDARY</Button>
            <br /><br />
            <Button icon="sentiment_neutral" size="md" type="primary">MD PRIMARY</Button><S5 />
            <Button icon="more" size="md" type="secondary">MD SECONDARY</Button>
            <br /><br />
            <Button icon="directions_bike" size="lg" type="primary">LG PRIMARY</Button><S5 />
            <Button icon="star" size="lg" type="secondary">LG SECONDARY</Button>
            <br /><br />

            <Button size="sm" type="primary">SM PRIMARY</Button><S5 />
            <Button size="sm" type="secondary">SM SECONDARY</Button>
            <br /><br />
            <Button size="md" type="primary">MD PRIMARY</Button><S5 />
            <Button size="md" type="secondary">MD SECONDARY</Button>
            <br /><br />
            <Button size="lg" type="primary">LG PRIMARY</Button><S5 />
            <Button size="lg" type="secondary">LG SECONDARY</Button>
            <br /><br />

            <Button size="md" type="success">MD SUCCESS</Button><S5 />
            <Button size="md" type="danger">MD DANGER</Button> <S5 />
            <Button size="md" type="warning">MD WARNING</Button>

            <br /><br />
            <Button size="sm">REGISTER</Button>
            <br /><br />
            <Button size="md">REGISTER</Button>
            <br /><br />
            <Button size="lg">REGISTER</Button>
            <br /><br />
            <Button size="md" type="secondary">CANCEL</Button><S5 />
            <Button size="md" type="primary">OK</Button>
            <br /><br />
            <Button size="md" type="secondary" disabled>CANCEL</Button><S5 />
            <Button size="md" type="primary" disabled>OK</Button><S5 />
            <br /><br />
            <Button size="md" type="secondary" primaryHover >PRIMARY HOVER</Button><S5 />
            <br /><br />
            <Button size="md" icon="autorenew" type="secondary">CANCEL</Button><S5 />
            <Button size="md" icon="event" type="primary">OK</Button><S5 />
            <br /><br />
            <Button size="md" icon="cancel" type="secondary" disabled>CANCEL</Button><S5 />
            <Button size="md" icon="bug_report" type="primary" disabled>OK</Button><S5 />
            <br /><br />
            <Button size="sm" icon="autorenew" type="secondary" /><S5 />
            <Button size="sm" icon="file_download" type="secondary" /><S5 />
            <Button size="sm" icon="open_in_new" type="secondary" /><S5 />
          </Col>
        </Row>
        <Row className="margin-top">
          <Col sm={2}><h5>Round Badges: </h5></Col>
          <Col sm={12} className="display-flex">
            <RoundBadge size={2}>8</RoundBadge>
            <RoundBadge size={1}>8</RoundBadge>
            <RoundBadge size={2}><Icon name="directions_car"/></RoundBadge>
            <RoundBadge size={1}><Icon name="directions_car"/></RoundBadge>
            <RoundBadge size={2}>RR</RoundBadge>
            <RoundBadge size={1}>RR</RoundBadge>
            <RoundBadge size={2}>TT</RoundBadge>
            <RoundBadge size={1}>TT</RoundBadge><S5/>
            <RoundBadge size={2} className="Inverted">RR</RoundBadge><S5/>
            <RoundBadge size={2} className="Inverted">8</RoundBadge><S5/>
            <RoundBadge size={1} className="Inverted">8</RoundBadge><S5/>
            <RoundBadge size={2} className="Inverted"><Icon name="directions_car"/></RoundBadge><S5/>
            <RoundBadge size={1} className="Inverted"><Icon name="directions_car"/></RoundBadge>
          </Col>
        </Row>
        <Row>
          <Col sm={2}><h5>Not so Round Badges: </h5></Col>
          <Col sm={12} className="display-flex">
            <Badge>120mi</Badge><S5/>
            <Badge>8</Badge><S5/>
            {/*<Badge><Icon name="trophy"/></Badge><S5/>*/}
            <Badge><Icon name="wb_sunny"/></Badge><S5/>
            <Badge><Icon name="place"/><S5/>Monterey, CA</Badge><S5/>
            <Badge className="Inverted"><Icon name="place"/><S5/>Monterey, CA</Badge>
          </Col>
        </Row>
        <Row>
          <Col sm={2}><h5>Square Badges: </h5></Col>
          <Col sm={12} className="display-flex">
            <Badge square heightRem={2}>CANCELED</Badge><S5/>
            <Badge square heightRem={3}>CANCELED</Badge><S5/>
            <Badge square heightRem={4}>CANCELED</Badge><S5/>
            <Badge square heightRem={5}>CANCELED</Badge><S5/>
            <Badge square heightRem={6}>CANCELED</Badge><S5/>
            <Badge square heightRem={3} borderColor="#ffccbb" bgColor="white" color="black">CANCELED</Badge><S5/>
            <Badge square>120mi</Badge><S5/>
            <Badge square>8</Badge><S5/>
            <Badge square><Icon name="wb_sunny" size={1.5}/></Badge><S5/>
          </Col>
        </Row>
        <Row>
          <Col sm={2}><h5>Elevation:</h5></Col>
          <Col sm={12} className="display-flex">
            <Icon name="arrow_upward" size={2} color={Colors.grey500}/>1200ft<S10/>
            <Icon name="arrow_upward" size={2} color={Colors.grey500}/>1200ft<S10/>
            {/*<Badge><Icon name="arrow-up"/>1200ft<S10/></Badge><S5/>*/}
            {/*<Badge><Icon name="long-arrow-up" />1200ft<S10/></Badge>*/}
          </Col>
        </Row>
        <Row>
          <Col sm={2}><h5>Distance:</h5></Col>
          <Col sm={12} className="display-flex">
            <Icon name="directions_bike" color={Colors.grey500}/>20mi<S10/>
            <Badge><Icon name="directions_bike"/>20mi</Badge><S10/>
            <Badge className="Inverted"><Icon name="directions_bike"/>20mi</Badge><S10/>
            44mi 60mi 120mi
          </Col>
        </Row>
        <Row>
          <Col sm={2}><h5>Duration:</h5></Col>
          <Col sm={12} className="display-flex">
            <Icon name="hourglass_empty" color={Colors.grey500}/>60min
            <S10/>
            <Badge><Icon name="hourglass_empty"/>60min</Badge><S5/>
            <Icon name="hourglass_empty" color={Colors.grey500}/>60min<S10/>
            <Icon name="hourglass_full" color={Colors.grey500} />60min<S10/>
            <Icon name="hourglass_full" color={Colors.grey500}/>60min<S10/>
          </Col>
        </Row>
        <Row>
          <Col sm={2}><h5>Location:</h5></Col>
          <Col sm={12} className="display-flex">
            <Icon name="place" color={Colors.grey500}/>Monterey, CA
          </Col>
        </Row>

        {/* CARDS CARDS CARDS*/}
        {/* CARDS CARDS CARDS*/}
        {/* CARDS CARDS CARDS*/}

        {/* all cards per-breakdown in columns*/}
        <h2>SPINNERS</h2>
        <Row>
          <Col sm={3}>
            <Spinner size={3} color={"gold"}/>
            <Spinner size={2} color={Colors.red500}/>
            <Spinner size={1} color={Colors.primary}/>
            <Spinner size={2} color={Colors.blue500}/>
            <Spinner size={3} color={'#00BF10'}/>
            <Button size="md" type="primary">
              <Spinner size={1} inline color={Colors.bodyBg}/>
            </Button><S5 />
            <Button size="md">
              Loading <Spinner size={1} inline />
            </Button>

          </Col>
        </Row>

        <h2>LOGOS</h2>
        <div>
          <UsacLogo size={1}/>
          <UsacLogo size={2}/>
          <UsacLogo size={3}/>
          <UsacLogo size={4}/>
        </div>

        <h2>ICONS</h2>
        <h5>Simple icon: <Icon name="speaker_notes" className="notes-icon" color={Colors.grey600}/></h5>
        <Icon name="portrait" className="notes-icon" color={Colors.grey600}/>
        <Icon name="portrait" size={3} className="notes-icon" color={Colors.grey600}/>
        <Icon name="portrait" size={4} className="notes-icon" color={Colors.grey600}/>


        <h2>CARDS PER CONTAINER:</h2>

        <ContainerHeader label="XXL" width={Grid.ContainerWidth.XXL}/>
        <Row className="margin-top">
          <Col sm={14} className="debug-flex-cards">
            <Event id="test" id="test" debug fixedWidth widthColumns={1} baseHeight={6} containerWidth={Grid.ContainerWidth.XXL}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={6} containerWidth={Grid.ContainerWidth.XXL}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={6} containerWidth={Grid.ContainerWidth.XXL}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={6} containerWidth={Grid.ContainerWidth.XXL}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
          </Col>
        </Row>

        <ContainerHeader label="XL" width={Grid.ContainerWidth.XL}/>
        <Row className="margin-top">
          <Col sm={14} className="debug-flex-cards">
            <Event id="test" debug fixedWidth widthColumns={1} baseHeight={5} containerWidth={Grid.ContainerWidth.XL}
              event={{name: 'Dunnigan Hills Road Race'}} />
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={5} containerWidth={Grid.ContainerWidth.XL}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={5} containerWidth={Grid.ContainerWidth.XL}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
          </Col>
        </Row>

        <ContainerHeader label="LG (iPad landscape, small laptops)" width={Grid.ContainerWidth.LG}/>
        <Row className="margin-top">
          <Col sm={14} className="debug-flex-cards">
            <Event id="test" debug fixedWidth widthColumns={1} baseHeight={4} containerWidth={Grid.ContainerWidth.LG}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={4} containerWidth={Grid.ContainerWidth.LG}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={4} containerWidth={Grid.ContainerWidth.LG}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={4} containerWidth={Grid.ContainerWidth.LG}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
          </Col>
        </Row>

        <ContainerHeader label="MD (iPad portrait)" width={Grid.ContainerWidth.MD}/>
        <Row className="margin-top">
          <Col sm={14} className="debug-flex-cards">
            <Event id="test" debug fixedWidth widthColumns={1} baseHeight={3} containerWidth={Grid.ContainerWidth.MD}
              event={{name: 'Dunnigan Hills Road Race'}} />
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={3} containerWidth={Grid.ContainerWidth.MD}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={3} containerWidth={Grid.ContainerWidth.MD}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={3} containerWidth={Grid.ContainerWidth.MD}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
          </Col>
        </Row>

        <ContainerHeader label="SM (iPhone 6+ landscape)" width={Grid.ContainerWidth.SM}/>
        <Row className="margin-top">
          <Col sm={14} className="debug-flex-cards">
            <Event id="test" debug fixedWidth widthColumns={1} baseHeight={2} containerWidth={Grid.ContainerWidth.SM}
              event={{name: 'Dunnigan Hills Road Race'}} />
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={2} containerWidth={Grid.ContainerWidth.SM}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={2} containerWidth={Grid.ContainerWidth.SM}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={2} containerWidth={Grid.ContainerWidth.SM}
              event={{name: 'John C. Schlesinger Memorial Circuit Race and Team Time Trial'}}/>
          </Col>
        </Row>

        {/* all cards per-breakdown in rows*/}
        <Row className="margin-top">
          <Col sm={1}><Event id="test" debug fixedWidth widthColumns={1} baseHeight={2} containerWidth={Grid.ContainerWidth.SM}
            event={{name:'Land Park Criterium'}}/>
          </Col>
          <Col sm={1}><Event id="test" debug fixedWidth widthColumns={1} baseHeight={3} containerWidth={Grid.ContainerWidth.MD}
            event={{name: 'Dunnigan Hills Road Race'}} />
          </Col>
          <Col sm={1}><Event id="test" debug fixedWidth widthColumns={1} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} event={{name: shortEventName}}/></Col>
          <Col sm={1}><Event id="test" debug fixedWidth widthColumns={1} baseHeight={5} containerWidth={Grid.ContainerWidth.XL}  event={{name: shortEventName}}/></Col>
          <Col sm={1}><Event id="test" debug fixedWidth widthColumns={1} baseHeight={6} containerWidth={Grid.ContainerWidth.XXL} event={{name: shortEventName}}/></Col>
        </Row>
        <Row className="margin-top">
          <Col sm={1}>
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} event={{name: shortEventName}}/>
          </Col>
          <Col sm={1}>
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} event={{name: shortEventName}}/>
          </Col>
          <Col sm={1}>
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} event={{name: shortEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} event={{name: shortEventName}}/>
          </Col>
          <Col sm={4}>
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={6} containerWidth={Grid.ContainerWidth.XXL} event={{name: shortEventName}}/>
          </Col>
        </Row>

        <Row className="margin-top">
          <Col sm={1}>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} event={{name: shortEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} event={{name: shortEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} event={{name: shortEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} event={{name: shortEventName}}/>
          </Col>
          <Col sm={5}>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={6} containerWidth={Grid.ContainerWidth.XXL} event={{name: shortEventName}}/>
          </Col>
        </Row>

        <Row className="margin-top">
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} event={{name: shortEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} event={{name: shortEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} event={{name: shortEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} event={{name: shortEventName}}/>
          </Col>
          {/*<Col sm={2}>
            <Event id="test" debug fixedWidth width={4} baseHeight={6} containerWidth={Grid.ContainerWidth.XXL} name="Dunnigan Hills Road Race"/>
          </Col>*/}
        </Row>


        {/* all cards per-breakdown in rows, long name*/}
        <Row className="margin-top">
          <Col sm={1}><Event id="test" debug fixedWidth widthColumns={1} baseHeight={2} containerWidth={Grid.ContainerWidth.SM}
            event={{name: shortEventName}}/></Col>
          <Col sm={1}><Event id="test" debug fixedWidth widthColumns={1} baseHeight={3} containerWidth={Grid.ContainerWidth.MD}
            event={{name: shortEventName}}/></Col>
          <Col sm={1}><Event id="test" debug fixedWidth widthColumns={1} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} event={{name: longEventName}}/></Col>
          <Col sm={1}><Event id="test" debug fixedWidth widthColumns={1} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} event={{name: longEventName}}/></Col>
          <Col sm={1}><Event id="test" debug fixedWidth widthColumns={1} baseHeight={6} containerWidth={Grid.ContainerWidth.XXL} event={{name: longEventName}}/></Col>
        </Row>
        <Row className="margin-top">
          <Col sm={1}>
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} event={{name: longEventName}}/>
          </Col>
          <Col sm={1}>
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} event={{name: longEventName}}/>
          </Col>
          <Col sm={1}>
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} event={{name: longEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} event={{name: longEventName}}/>
          </Col>
          <Col sm={4}>
            <Event id="test" debug fixedWidth widthColumns={2} baseHeight={6} containerWidth={Grid.ContainerWidth.XXL} event={{name: longEventName}}/>
          </Col>
        </Row>

        <Row className="margin-top">
          <Col sm={1}>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} event={{name: longEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} event={{name: longEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} event={{name: longEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} event={{name: longEventName}}/>
          </Col>
          <Col sm={5}>
            <Event id="test" debug fixedWidth widthColumns={3} baseHeight={6} containerWidth={Grid.ContainerWidth.XXL} event={{name: longEventName}}/>
          </Col>
        </Row>

        <Row className="margin-top">
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={2} containerWidth={Grid.ContainerWidth.SM} event={{name: longEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={3} containerWidth={Grid.ContainerWidth.MD} event={{name: longEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={4} containerWidth={Grid.ContainerWidth.LG} event={{name: longEventName}}/>
          </Col>
          <Col sm={2}>
            <Event id="test" debug fixedWidth widthColumns={4} baseHeight={5} containerWidth={Grid.ContainerWidth.XL} event={{name: longEventName}}/>
          </Col>
          {/*<Col sm={2}>
            <Event id="test" debug fixedWidth width={4} baseHeight={6} containerWidth={Grid.ContainerWidth.XXL} name="Dunnigan Hills Road Race"/>
          </Col>*/}
        </Row>

        <h1 className="oswald">Road Races in CA, 100mi range</h1>
      </div>
    )
  }
}

Dev.contextTypes = {
  locationPathname: React.PropTypes.string
}
