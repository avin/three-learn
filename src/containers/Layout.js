import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';

class Layout extends React.Component {
    static propTypes = {
        children: PropTypes.element
    };

    render() {
        return (
            <div>
                <div>
                    <IndexLink to="/">Home</IndexLink>
                    {' | '}
                    <Link to="/counter">Counter</Link>
                    {' | '}
                    <Link to="/about">About</Link>
                </div>
                <hr/>
                {this.props.children}
            </div>
        );
    }
}



export default Layout;