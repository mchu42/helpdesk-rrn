import { Map, fromJS } from 'immutable';
import { applicationName } from 'config';
import { fetchSignal } from 'ducks/fetch';

/*
* Constants
* */

export const MODULE_NAME = 'tickets-data';
export const URL = '/api/tickets';

// Action names
const FETCH_DONE = `${applicationName}/${MODULE_NAME}/FETCH_DONE`;
const UPDATE_DONE = `${applicationName}/${MODULE_NAME}/UPDATE_DONE`;
const ADD_DONE = `${applicationName}/${MODULE_NAME}/ADD_DONE`;
const RESET = `${applicationName}/${MODULE_NAME}/RESET`;

/*
* Reducer
* */

const initialState = Map({ data: false });

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DONE:
      return state.set('data', fromJS(action.payload));

    case ADD_DONE:
      return state.update('data', data => data.push(fromJS(action.payload)));

    case UPDATE_DONE: {
      return state.update('data', data => data.map((dataItem) => {
        if (dataItem.get('id') === action.payload.id) {
          return dataItem.merge(action.payload);
        }

        return dataItem;
      }));
    }

    case RESET:
      return initialState;

    default:
      return state;
  }
}

/*
* Actions
* */

const ticketsDataResetDelta = () => ({ type: RESET });

const ticketsDataGetSignal = () => dispatch => Promise.coroutine(function* getTickets() {
  const answer = yield dispatch(fetchSignal(URL));

  if (answer.isSuccess) {
    dispatch({ type: FETCH_DONE, payload: answer.data });
  }

  return answer;
})();

const ticketsDataUpdateSignal = ({ id, data }) =>
  dispatch => Promise.coroutine(function* updateTicket() {
    const answer = yield dispatch(fetchSignal(`${URL}/${id}`, { method: 'PATCH', body: data }));

    if (answer.isSuccess) {
      dispatch({ type: UPDATE_DONE, payload: answer.data });
    }

    return answer;
  })();

const ticketsDataAddSignal = ({ data }) => dispatch => Promise.coroutine(function* addTicket() {
  const answer = yield dispatch(fetchSignal(URL, { method: 'POST', body: data }));

  if (answer.isSuccess) {
    dispatch({ type: ADD_DONE, payload: answer.data });
  }

  return answer;
})();

export const actions = {
  ticketsDataResetDelta,
  ticketsDataGetSignal,
  ticketsDataUpdateSignal,
  ticketsDataAddSignal,
};