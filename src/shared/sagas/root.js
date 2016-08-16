import eventsSaga from './events'

export default function* rootSaga() {
  yield [
    eventsSaga()
  ]
}
