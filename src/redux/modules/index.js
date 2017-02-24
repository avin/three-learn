import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import counter from './counter';

export default combineReducers({
    counter,
    //Special reducers
    routing,
});
