import shallowEqual from 'client/utils/shallow-equal-except'

// will ignore router-specific props that usually cause unwanted re-render when modal is opened and custom
// route is used for modal aka "pinterest" or "product hunt" style modals
const pureComponentWithRoutedModal = component => {
  // can't be an arrow finction since need bounded thist to component's instance
  component.prototype.shouldComponentUpdate = function(nextProps, nextState) {
    if (nextProps.location && nextProps.location.state
      && (nextProps.location.state.modal || nextProps.location.state.navigatedBackFromModal)
    ) {
      return !shallowEqual(this.props, nextProps, {
        exceptProps: ['location', 'params', 'routes']
      })
    }

    return !shallowEqual(this.props, nextProps)
  }

  return component
}

export default pureComponentWithRoutedModal
