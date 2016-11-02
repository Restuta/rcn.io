import React from 'react'
import classnames from 'classnames'
import SheetsuLogoPath from 'public/img/sheetsu-logo.svg'

export default class SheetsuBadge extends React.PureComponent {
  render() {

    const classNames = classnames('SheetsuBadge', this.props.className)

    return (
      <div className={classNames}>
        <a width="150" href="https://sheetsu.com/"
          rel="nofollow" target="_blank" alt="Turn a Google Spreadsheet into a REST API">
          <img  width="150" src={SheetsuLogoPath} alt="Sheetsu Logo"></img>
        </a>
      </div>

    )
  }
}
