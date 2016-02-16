import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Month.scss'
import Row from '../atoms/Row.jsx'
import Col from '../atoms/Col.jsx'
import moment from 'moment'

export default class Month extends Component {
  render() {

    let formattedDate = moment({
      month: this.props.month - 1, //momentjs counts monthes from 0
      year: this.props.year
    })
    .format('MMMM YYYY')

    return (
      <div className="Month">
        <div className="caption">
          {formattedDate}
        </div>
        <Row>
          <Col xsOffset={2} xs={2}>1</Col>
          <Col xs={2}>3</Col>
          <Col xs={2}>4</Col>
          <Col xs={2}>5</Col>
          <Col xs={2}>6</Col>
          <Col xs={2}>7</Col>
        </Row>
        <Row>
          <Col xs={2}>1</Col>
          <Col xs={2}>2</Col>
          <Col xs={2}>3</Col>
          <Col xs={2}>4</Col>
          <Col xs={2}>5</Col>
          <Col xs={2}>6</Col>
          <Col xs={2}>7</Col>
        </Row>
        <Row>
          <Col xs={2}>1</Col>
          <Col xs={2}>2</Col>
          <Col xs={2}>3</Col>
          <Col xs={2}>4</Col>
          <Col xs={2}>5</Col>
          <Col xs={2}>6</Col>
          <Col xs={2}>7</Col>
        </Row>
        <Row>
          <Col xs={2}>1</Col>
          <Col xs={2}>2</Col>
          <Col xs={2}>3</Col>
          <Col xs={2}>4</Col>
          <Col xs={2}>5</Col>

        </Row>
      </div>
    )
  }
}

Month.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired
}
