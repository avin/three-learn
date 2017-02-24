import React from 'react';
import { connect } from 'react-redux';
import {
    setPosition,
    setRotation
} from '../../../redux/modules/simpleScene';
import { NumericInput } from '@blueprintjs/core';

export class Control extends React.Component {

    handleChangePosition(axis, value) {
        const {setPosition, position} = this.props;
        let params = position.toJS();
        params[axis] = value;
        setPosition(params);
    };

    handleChangeRotation(axis, value) {
        const {setRotation, rotation} = this.props;
        let params = rotation.toJS();
        params[axis] = value;
        setRotation(params);
    };

    render() {
        const {position, rotation} = this.props;
        return (
            <div style={{margin: 20}}>
                <div className="row">
                    <div className="col-xs-6">
                        <div className="pt-card pt-elevation-1 no-padding" style={{marginBottom: 15}}>
                            <table className="pt-table pt-striped pt-bordered wide">
                                <thead>
                                    <tr>
                                        <th>
                                            Position
                                        </th>
                                        <th>
                                            X
                                        </th>
                                        <th>
                                            Y
                                        </th>
                                        <th>
                                            Z
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td />
                                        {['x', 'y', 'z'].map(axis => (
                                            <td key={axis}>
                                                <NumericInput
                                                    value={position.get(axis)}
                                                    onValueChange={(value) => this.handleChangePosition(axis, value)}/>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <div className="pt-card pt-elevation-1 no-padding">
                            <table className="pt-table pt-striped pt-bordered wide">
                                <thead>
                                    <tr>
                                        <th>
                                            Rotation
                                        </th>
                                        <th>
                                            X
                                        </th>
                                        <th>
                                            Y
                                        </th>
                                        <th>
                                            Z
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td />
                                        {['x', 'y', 'z'].map(axis => (
                                            <td key={axis}>
                                                <NumericInput
                                                    value={rotation.get(axis)}
                                                    onValueChange={(value) => this.handleChangeRotation(axis, value)}/>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        position: state.simpleScene.get('position'),
        rotation: state.simpleScene.get('rotation'),
    }
}

export default connect(
    mapStateToProps,
    {
        setPosition,
        setRotation
    }
)(Control)