import shallowEqual from 'client/utils/shallow-equal-except'
import { get } from 'lodash'

// will ignore router-specific props that usually cause unwanted re-render when modal is opened
// and custom route is used for modal aka "pinterest" or "product hunt" style modals
const pureComponentWithRoutedModal = component => {
  // can't be an arrow finction since need bounded thist to component's instance
  component.prototype.shouldComponentUpdate = function(nextProps, nextState) {
    // if navigated back from modal we should not re-render if only routing-related props changed
    if (get(nextProps, 'location.state.modalProps.isOpen')
      || get(nextProps, 'navigatedBackFromModal')
    ) {
      // when it's "back from modal" we shoul dignore all the props and should not re-render
      return false
    }

    return !shallowEqual(this.props, nextProps, undefined, component.displayName)
  }

  return component
}

export default pureComponentWithRoutedModal
