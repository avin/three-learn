import React from 'react';
import {connect} from 'react-redux';

export class About extends React.Component {
    render() {
        return (
            <div>
                About 123
            </div>
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
)(About)