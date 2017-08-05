import shallowEqual from 'client/utils/shallow-equal-except'

// will ignore router-specific props that usually cause unwanted re-render when modal is opened and custom
// route is used for modal aka "pinterest" or "product hunt" style modals
const pureComponent = component => {
  // can't be an arrow finction since need bounded thist to component's instance
  component.prototype.shouldComponentUpdate = function(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps)
  }

  return component
}

export default pureComponent
