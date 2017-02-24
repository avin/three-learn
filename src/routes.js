import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from './containers/Layout';
import Home from './containers/pages/home/index';
import About from './containers/pages/about/index';
import Counter from './containers/pages/counter/index';
import SimpleScene from './containers/pages/simple-scene/index';

export default (
    <Route path="/" component={Layout}>
        <IndexRoute component={Home} />
        <Route path="/counter" component={Counter} />
        <Route path="/simple-scene" component={SimpleScene} />
        <Route path="/about" component={About} />
    </Route>
);