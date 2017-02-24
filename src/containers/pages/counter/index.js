import React from 'react';
import { connect } from 'react-redux';
import { setCounterValue } from '../../../redux/modules/counter';

export class Counter extends React.Component {
    handlePlus = () => {
        const {value, setCounterValue} = this.props;
        setCounterValue(value + 1);
    };
    handleMinus = () => {
        const {value, setCounterValue} = this.props;
        setCounterValue(value - 1);
    };
    render() {
        const {value} = this.props;
        return (
            <div>
                Counter: {value}
                <button type="button" onClick={this.handlePlus}>+</button>
                <button type="button" onClick={this.handleMinus}>-</button>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const value = state.counter.get('value');
    return {
        value
    }
}

export default connect(
    mapStateToProps,
    {
        setCounterValue
    }
)(Counter)