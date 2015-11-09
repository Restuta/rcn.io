import React from 'react';
import Component from 'react-pure-render/component';
import './TypographicScale.scss';
import Col from '../atoms/Col.jsx';
import Row from '../atoms/Row.jsx';

//generates type sizes array using base sie, scale and amount of sizes below and above scale
function generateTypeSizesRem({scale = 1, below = 0, above = 0}) {
  const base = 1; //all size relative to 1rem
  let sizes = [];
  let currentScale = base;

  for (let i = 0; i < below; i++) {
    currentScale /= scale;
    sizes.unshift(currentScale);
  }

  sizes.push(base);

  currentScale = base;
  for (let i = 0; i < above; i++) {
    currentScale *= scale;
    sizes.push(currentScale);
  }

  return sizes.map(x => x.toFixed(3));
}

function remsToPx({sizeInRem, baseSizeInPx}) {
  return (sizeInRem * baseSizeInPx);
}

class FontExample extends Component {
  render() {
    const {sizeInRem, baseSizeInPx, scale} = {...this.props};
    const sizeInPx = remsToPx({sizeInRem, baseSizeInPx}).toFixed(0);

    const sizeStyle = {
      margin: 0,
      fontSize: (sizeInRem >= 1 ? sizeInRem / (scale) : sizeInRem) + 'rem',
      color: ((parseFloat(sizeInRem) === 1) ? 'goldenrod' : 'silver'),
    };

    const paragraphStyle = {
      fontSize: sizeInRem + 'rem',
      marginBottom: 0
    };

    return (
      <span style={paragraphStyle}>
        {this.props.children}
        <sup>
          <span style={sizeStyle}>{sizeInRem}rem ({sizeInPx}px)</span>
        </sup>
      </span>
    );
  }
}

export default class TypographicScale extends Component {
  render() {

    const baseSizeInPx = 16; //as set in gloabal CSS
    const scale = this.props.scale;
    const sizes = generateTypeSizesRem({
      scale: scale,
      below: 4,
      above: 6
    });

    const fontExamples = sizes.map((sizeInRem, i) => {
      return (
        <Row key={i}>
          <Col xs={16} className="col">
            <FontExample sizeInRem={sizeInRem}
                baseSizeInPx={baseSizeInPx}
                scale={scale}>
              Red Kite Omnium Event #1
            </FontExample>
          </Col>
        </Row>
      );
    });

    return (
      <div className="TypographicScale">
        <hr/>
        <h4>
          {this.props.children} - {scale}<br/>
          {sizes.map(sizeInRem =>
            remsToPx({sizeInRem, baseSizeInPx}).toFixed(2)
          ).join(', ')}
        </h4>
        {fontExamples}
      </div>
    );
  }
};
