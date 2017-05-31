import React from 'react'
import Button from 'atoms/Button.jsx'

const PrimaryButton = ({text, icon, disabled, onClick}) => (
  <Button size="sm" icon={icon} disabled={disabled} primaryHover className="primary-button" onClick={onClick}>
    {text}
  </Button>
)

const RegButton = ({regUrl, onClick}) => (
  regUrl
    ? <PrimaryButton text="REGISTER" onClick={onClick}/>
    : <PrimaryButton text="NO REG LINK" icon="sentiment_dissatisfied" disabled Click={onClick}/>
)

const ResultsButton = ({resultsUrl, onClick}) => (
  resultsUrl
    ? <PrimaryButton text="RESULTS" onClick={onClick}/>
    : <PrimaryButton text="NO RESULTS LINK" icon="sentiment_dissatisfied" disabled Click={onClick}/>
)

export {
  RegButton,
  ResultsButton
}
