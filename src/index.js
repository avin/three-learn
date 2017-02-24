import { AppContainer } from 'react-hot-loader';
import React from 'react';
import {render} from 'react-dom';
import Root from './containers/Root';
import createStore from './redux/createStore';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

const store = createStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
    <AppContainer>
        <Root store={store} history={history}/>
    </AppContainer>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('./containers/Root', () => {
        const Root = require('./containers/Root').default;
        render(
            <AppContainer>
                <Root store={store} history={history}/>
            </AppContainer>,
            document.getElementById('root')
        );
    });
}