import React, { PropTypes } from 'react';
import {
    Link,
    IndexLink
} from 'react-router';
import classNames from 'classnames';
import _ from 'lodash'

class Layout extends React.Component {
    static propTypes = {
        children: PropTypes.element
    };

    render() {
        const currentRoute = this.props.location.pathname;

        const menuItems = [
            {
                route: '/',
                title: 'Home',
            },
            {
                route: '/animation',
                title: 'Animate',
            },
            {
                route: '/animation2',
                title: 'Animate2',
            },
            {
                route: '/simple-scene',
                title: 'SimpleScene',
            },
            {
                route: '/speedy-scene',
                title: 'Speedy',
            },
            {
                route: '/vr-scene',
                title: 'VR',
            },
            {
                route: '/ar-scene',
                title: 'AR',
            },
        ];
        return (
            <div>
                <nav className="pt-navbar pt-dark">
                    <div className="pt-navbar-group pt-align-left">
                        {menuItems.map(menuItem => (
                            <Link key={menuItem.route}
                                to={menuItem.route}
                                className={classNames('pt-button pt-minimal', {'pt-active': currentRoute === menuItem.route})}>
                                {menuItem.title}
                            </Link>
                        ))}
                    </div>
                </nav>
                {this.props.children}
            </div>
        );
    }
}


export default Layout;