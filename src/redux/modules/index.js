import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import counter from './counter';
import simpleScene from './simpleScene';

export default combineReducers({
    counter,
    simpleScene,

    //Special reducers
    routing,
});
