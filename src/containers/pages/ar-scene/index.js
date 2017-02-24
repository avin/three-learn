import React from 'react';
import {connect} from 'react-redux';

export class ArScene extends React.Component {
    render() {
        return (
            <div>
                <canvas ref="canvas" width={800} height={600}/>
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
)(ArScene)