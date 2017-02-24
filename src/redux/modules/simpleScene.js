import * as Immutable from 'immutable';

const SET_POSITION = 'app/simpleScene/SET_POSITION';
const SET_ROTATION = 'app/simpleScene/SET_ROTATION';

/*
 ================
 initialState
 ================
 */

const initialState = Immutable.fromJS({
    position: {x: 0, y: 0, z: 0},
    rotation: {x: 0, y: 0, z: 0}
});

/*
 ================
 REDUCER
 ================
 */

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_POSITION: {
            return state.set('position', action.position)
        }
        case SET_ROTATION: {
            return state.set('rotation', action.rotation)
        }
        default: {
            return state;
        }
    }
}

export function setPosition({x, y, z} = {}) {
    return (dispatch, getState) => {
        const currentPosition = getState().simpleScene.get('position');

        const position = new Immutable.Map({
            x: x !== undefined ? x : currentPosition.get('x'),
            y: y !== undefined ? y : currentPosition.get('y'),
            z: z !== undefined ? z : currentPosition.get('z'),
        });
        return dispatch({
            type: SET_POSITION,
            position
        })
    };

};

export function setRotation({x, y, z}) {
    return (dispatch, getState) => {
        const currentRotation = getState().simpleScene.get('rotation');

        const rotation = new Immutable.Map({
            x: x !== undefined ? x : currentRotation.get('x'),
            y: y !== undefined ? y : currentRotation.get('y'),
            z: z !== undefined ? z : currentRotation.get('z'),
        });

        return dispatch({
            type: SET_ROTATION,
            rotation
        })
    };

};


