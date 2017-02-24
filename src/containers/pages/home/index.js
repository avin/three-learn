import React from 'react';
import {connect} from 'react-redux';

export class Home extends React.Component {
    render() {
        return (
            <div>Home</div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {

    }
}

export default connect(
    mapStateToProps,
    {

    }
)(Home)