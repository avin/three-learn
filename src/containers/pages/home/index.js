import React from 'react';
import { connect } from 'react-redux';

export class Home extends React.Component {

    render() {
        return (
            <div style={{padding: 20}}>
                Home 1

            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {}
}

export default connect(
    mapStateToProps,
    {}
)(Home)