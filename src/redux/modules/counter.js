import * as Immutable from 'immutable';

const SET_VALUE = 'app/counter/SET_VALUE';

/*
 ================
 initialState
 ================
 */

const initialState = Immutable.fromJS({
    value: 0
});

/*
 ================
 REDUCER
 ================
 */

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_VALUE: {
            return state.set('value', action.value)
        }
        default: {
            return state;
        }
    }
}

export function setCounterValue(value){
    return ({
        type: SET_VALUE,
        value: value
    })
};


