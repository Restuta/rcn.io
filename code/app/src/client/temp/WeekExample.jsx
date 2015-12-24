import React from 'react';
//import Component from 'react-pure-render/component';
import Row from '../atoms/Row.jsx';
import Col from '../atoms/Col.jsx';
import EventStub from '../temp/EventStub.jsx';


export default ({days, allSameSize}) => {
  const numberOfColumns = 14;
  const daysSum = days.reduce((x, y) => x + y);
  let firstColumnOffset = 0;

  if (daysSum < numberOfColumns) {
    firstColumnOffset = numberOfColumns - daysSum;
  }

  const colClasses = allSameSize ? 'col outlined debug pink' : 'col outlined debug';

  const daysStyleLeft = {
    textAlign: 'center',
    position: 'absolute',
    marginLeft: '-140px',
  };

  const daysStyleRight = Object.assign({}, daysStyleLeft, {
    marginLeft: '30px',
  });

  const rowStyle = {
    marginTop: -1,
  };

  return (
      <Row style={rowStyle}>
        <h4 style={daysStyleLeft}>{days.join(', ')}</h4>
        {days.map((x, i) =>
          <Col xsOffset={i === 0 ? firstColumnOffset : null} key={i} sm={x}
              className={colClasses}>
            <b>{++i}</b>
            <EventStub/>
            <EventStub className="margin-top"/>
            <EventStub className="margin-top"/>
            <EventStub className="margin-top margin-bot"/>
          </Col>)
        }
        <h4 style={daysStyleRight}>{days.join(', ')}</h4>
      </Row>
  );
};
