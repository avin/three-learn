import React from 'react';
import {
    createStore,
    compose,
    applyMiddleware
} from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from './modules/index';

export default function (initialState = {}, history, useStorage) {

    const middlewares = [
        thunk,
        routerMiddleware(history)
    ];

    const store = createStore(rootReducer, initialState, compose(
        applyMiddleware(...middlewares),
        window.devToolsExtension && DEVELOPMENT ? window.devToolsExtension() : f => f
    ));

    if (DEVELOPMENT && module.hot) {
        module.hot.accept('./modules/index', () => {
            const nextReducer = require('./modules/index').default;
            store.replaceReducer(nextReducer);
        });
    }


    return store;
}