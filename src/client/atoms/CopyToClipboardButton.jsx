import { selectAllText, selectAllTextInElement } from 'utils/dom/text'
import React from 'react'
import PropTypes from 'prop-types'
import Button from 'atoms/Button.jsx'
import Icon from 'atoms/Icon.jsx'
import Colors from 'styles/colors'

// provide it with element id to copy text from
// it incapsulates all the magic related to native API
class CopyToClipboardButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { copied: false }
  }

  componentDidUpdate() {
    if (this.state.copied) {
      // disabling eslint since we want to update state
      setTimeout(() => this.setState(() => ({ copied: false })), 2000) //eslint-disable-line
    }
  }

  onCopyClick = () => {
    try {
      if (this.props.textElementId) {
        selectAllText({elementId: this.props.textElementId})
      } else if (this.props.domElement) {
        selectAllTextInElement({element: this.props.domElement})
      } else {
        throw new Error('Either elementId or domElement must be provided')
      }

      // copy text
      document.execCommand('copy')
      this.setState(() => ({ copied: true }))
    } catch (err) {
      this.setState(() => ({ copied: false }))
      alert('please press Ctrl/Cmd+C to copy')
    }
  }

  render() {
    const { copied } = this.state
    const {
      type = 'button',
      whatToCopyText = '',
      buttonType = 'primary'
    } = this.props
    const currentButtonType = copied ? 'success' : buttonType
    const icon = copied ? 'check' : 'assignment_return'
    const transitionStyle = { transition: 'all 0.2s ease'}

    const linkStyle = {
      ...transitionStyle,
      color: copied ? Colors.green500 : Colors.primary,
    }

    const linkIconStyle = {
      ...transitionStyle,
      verticalAlign: 'text-bottom',
    }

    const childrenComp = copied
      ? <span style={transitionStyle}>COPIED {whatToCopyText}</span>
      : <span style={transitionStyle}>COPY {whatToCopyText}</span>

    return (
      type === 'button'
      ? (
        <Button icon={icon} size="sm" type={currentButtonType} onClick={this.onCopyClick}
          style={transitionStyle}>
          {childrenComp}
        </Button>
      )
      : (
        <a type={currentButtonType} onClick={this.onCopyClick}
          style={linkStyle}>
          <Icon name={icon} size={2} top={0} style={linkIconStyle}/>
          {childrenComp}
        </a>
      )

    )
  }
}

CopyToClipboardButton.propTypes = {
  // to copy text from
  textElementId: PropTypes.string,
  // also possible to privide DOM element directly
  domElement: PropTypes.object,
  type: PropTypes.oneOf(['button', 'link']),
  buttonType: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'warning']),
  // will be applied after "COPY"
  whatToCopyText: PropTypes.string,
}


export default CopyToClipboardButton
