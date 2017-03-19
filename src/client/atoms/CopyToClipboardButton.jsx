import { selectAllText } from 'utils/dom/text'
import React from 'react'
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
      selectAllText({elementId: this.props.textElementId})
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
    const { type } = this.props
    const buttonType = copied ? 'success' : 'primary'
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
      ? <span style={transitionStyle}>COPIED</span>
      : <span style={transitionStyle}>COPY</span>

    return (
      type === 'button'
      ? (
        <Button icon={icon} size="sm" type={buttonType} onClick={this.onCopyClick}
          style={transitionStyle}>
          {childrenComp}
        </Button>
      )
      : (
        <a type={buttonType} onClick={this.onCopyClick}
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
  textElementId: React.PropTypes.string,
  type: React.PropTypes.oneOf(['button', 'link']),
}


export default CopyToClipboardButton
