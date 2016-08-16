import { call, put } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
//TODO bc: move this to shared, under sagas since shared should not depend on client
import { fetchNcncaDraftEvents2017 } from 'client/temp/events'
import {
  calendarFetchSucceded,
  calendarFetchFailed,
 } from 'shared/actions/actions.js'

function* eventsSaga(requestEventFetchAction) {
  const { payload, calendarId = payload.calendarId } = requestEventFetchAction
  try {
    console.warn('=> events saga is called') //eslint-disable-line
    const events = yield call(fetchNcncaDraftEvents2017)
    yield put(calendarFetchSucceded({events: events, calendarId: calendarId}))
    console.warn('=> events saga is succeded') //eslint-disable-line
  } catch (error) {
    console.error('=> events saga has failed: ' + error) //eslint-disable-line
    yield put(calendarFetchFailed(error))
  }
}


function* watchRequestEventsFetch() {
  // const { payload, calendarId = payload.calendarId } = yield take('Cal.REQUEST_EVENTS_FETCH')

  // yield fork(eventsSaga, calendarId)
  yield* takeLatest('Cal.REQUEST_EVENTS_FETCH', eventsSaga)
}

export default watchRequestEventsFetch
