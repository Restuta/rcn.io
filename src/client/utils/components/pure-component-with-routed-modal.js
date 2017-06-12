import shallowEqual from 'client/utils/shallow-equal-except'
import { get } from 'lodash'

// TODO BC: back / forward in calendar doesn't work after opening few modals
// because navigated back from modal stays true

// will ignore router-specific props that usually cause unwanted re-render when modal is opened
// and custom route is used for modal aka "pinterest" or "product hunt" style modals
const pureComponentWithRoutedModal = component => {
  // can't be an arrow finction since need bounded thist to component's instance
  component.prototype.shouldComponentUpdate = function(nextProps, nextState) {
    // if navigated back from modal we should not re-render if only routing-related props changed
    if (get(nextProps, 'location.state.modalProps.isOpen')
      || get(nextProps, 'navigatedBackFromModal')
      // POP would mean it's browser back, in that case we may want to just do normal shallow compare
      && get(nextProps, 'location.action') !== 'POP'
    ) {
      // when it's "back from modal" we shoul dignore all the props and should not re-render
      return false
    }

    return !shallowEqual(this.props, nextProps, undefined, component.displayName)
  }

  return component
}

export default pureComponentWithRoutedModal
