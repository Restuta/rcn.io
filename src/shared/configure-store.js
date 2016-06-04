import { createStore } from 'redux'
import rootReducer from 'shared/reducers/reducer.js'

const configureStore = () => createStore(rootReducer)

export default configureStore
