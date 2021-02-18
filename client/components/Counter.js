const React = require('react');
const PropTypes =  require('prop-types');
const Actions = require('../actions/counter.js');
const counter = require('../reducers/counterReducer.js');

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.store = props.store;
        this.state = this.store.getState()
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

    render() {
        return (
            <p>
                Clicked: {this.state.value} times{' '}
                <br/><br/><br/>
                <button className={'topcoat-button'} onClick={this.onIncrement}>Increment</button>{' '}
                <button className={'topcoat-button'} onClick={this.onDecrement}>Decrement</button>{' '}
                <button className={'topcoat-button'} onClick={this.onReset}>Reset</button>{' '}
            </p>
        )
    }
}

module.exports = Counter