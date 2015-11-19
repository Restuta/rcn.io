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

    return (
      <div>
        <div className="container">
          <Row>
            <Col sm={12}>
              <h1>ROAD RACES IN CA</h1>
              <h2>Event #1 The Bump</h2>
              <p>Bushwick Schlitz. Est Shoreditch small batch, dolor Schlitz sapiente twee stumptown ex. Duis Carles pickled, cornhole Thundercats McSweeney's minim PBR vegan Tumblr irony. Kogi eu Thundercats, sed scenester before they sold out et aesthetic. Elit cred Vice ethical pickled sartorial. Stumptown roof party freegan High Life vero, ea sed minim meggings.</p>

              <h3>New in California in 2016</h3>
              <p>Cosby sweater plaid shabby chic kitsch pour-over ex. Try-hard fanny pack mumblecore cornhole cray scenester. Assumenda narwhal occupy, Blue Bottle nihil culpa fingerstache. Meggings kogi vinyl meh, food truck banh mi Etsy magna 90's duis typewriter banjo organic leggings Vice.</p>

              <h4>Only 24mi away (45 min drive)</h4>
              <ul>
                <li>Roof party put a bird on it incididunt sed umami craft beer cred.</li>
                <li>Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.</li>
                <li>Scenester High Life Banksy, proident master cleanse tousled squid sriracha ad chillwave post-ironic retro.</li>
              </ul>

              <h5>Heading 5</h5>
              <p>Laboris selfies occaecat umami, forage Tumblr American Apparel. Retro Terry Richardson culpa id swag polaroid Intelligentsia American Apparel eu, esse non post-ironic fugiat master cleanse. Direct trade gluten-free blog, fanny pack cray labore skateboard before they sold out adipisicing non magna id Helvetica freegan. Disrupt aliqua Brooklyn church-key lo-fi dreamcatcher.</p>

              <h1>Heading 1</h1>
              <p>And a paragraph after</p>

              <h2>Heading 2</h2>
              <p>And a paragraph after</p>

              <h3>Heading 3</h3>
              <p>And a paragraph after</p>

              <h4>Heading 4</h4>
              <p>And a paragraph after</p>
              <TypographicScale baseSizeInPx={14} scale={1.333}>Perfect Fourth (by David Kadavy), 5 7 9 12 16 21 28 37 50 67 89 111 148</TypographicScale>
            </Col>
          </Row>
          <Row>
            <Col sm={16}>
              <h1 className="oswald">Road Races in CA, 100mi range</h1>
            </Col>
          </Row>
          <Row>
            <Col sm={2} className="col outlined debug pink">August</Col>
            {genericWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug pink">{++i}<Event/></Col>)
            }
          </Row>
          <Row className="margin-top">
            <Col sm={2} className="col debug outlined">August</Col>
            {genericWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<Event/></Col>)
            }
          </Row>
          <Row className="margin-top">
            <Col sm={2} className="col debug outlined">August</Col>
            {roadWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<Event/></Col>)
            }
          </Row>
          <Row className="margin-top">
            {fullSpaceWeek.map((x, i) =>
              <Col key={i} sm={x} className="col outlined debug">{++i}<Event/></Col>)
            }
          </Row>

          <Counter increment={1} color="silver" marginTop="20px" />

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
