import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from './containers/Layout';
import Home from './containers/pages/home/index';
import Counter from './containers/pages/counter/index';
import SimpleScene from './containers/pages/simple-scene/index';
import SpeedyScene from './containers/pages/speedy-scene/index';
import Animation from './containers/pages/animation-scene/index';
import VRScene from './containers/pages/vr-scene/index';
import ArScene from './containers/pages/ar-scene/index';

export default (
    <Route path="/" component={Layout}>
        <IndexRoute component={Home} />
        <Route path="/counter" component={Counter} />
        <Route path="/animation" component={Animation} />
        <Route path="/simple-scene" component={SimpleScene} />
        <Route path="/speedy-scene" component={SpeedyScene} />
        <Route path="/vr-scene" component={VRScene} />
        <Route path="/ar-scene" component={ArScene} />
    </Route>
);