const React = require('react');
const PropTypes =  require('prop-types');
const Actions = require('../actions/counter.js');
const counter = require('../reducers/counterReducer.js');

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.store = props.store;
        this.state = this.store.getState()
        this.incrementAsync = this.incrementAsync.bind(this);
        this.incrementIfOdd = this.incrementIfOdd.bind(this);
        this.onIncrement = this.onIncrement.bind(this);
        this.onDecrement = this.onDecrement.bind(this);
        this.onReset = this.onReset.bind(this);
        this.render = this.render.bind(this)

        this.store.subscribe(() => {
            this.setState(this.store.getState())
        })
    }

    onIncrement() {
        this.store.dispatch(Actions.increment())
    }

    onDecrement() {
        this.store.dispatch(Actions.decrement())
    }

    onReset() {
        this.store.dispatch(Actions.reset())
    }

    incrementIfOdd() {
        if (this.store.getState().value % 2 !== 0) {
            this.onIncrement()
        }
    }

    incrementAsync() {
        setTimeout(this.onIncrement, 1000)
    }

    render() {
        return (
            <p>
                Clicked: {this.state.value} times{' '}
                <br/><br/><br/>
                <button className={'topcoat-button'} onClick={this.onIncrement}>Increment</button>{' '}
                <button className={'topcoat-button'} onClick={this.onDecrement}>Decrement</button>{' '}
                <button className={'topcoat-button'} onClick={this.onReset}>Reset</button>{' '}
                {/* <br/>
                <button className={'topcoat-button'} onClick={this.incrementIfOdd}>Increment if odd</button>{' '}
                <button className={'topcoat-button'} onClick={this.incrementAsync}>Increment async</button> */}
            </p>
        )
    }
}

// Counter.propTypes = {
//     value: PropTypes.number.isRequired,
//     onIncrement: PropTypes.func.isRequired,
//     onDecrement: PropTypes.func.isRequired
// }

module.exports = Counter