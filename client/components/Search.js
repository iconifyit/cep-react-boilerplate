const React = require('react');

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            value: ''
        };
        this.db = props.db;
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    handleKeyUp(e) {
        if (e.keyCode === 13) {
            this.setState({
                active: false
            });
        }
    }

    handleKeyDown(e) {
        if (e.keyCode === 13) {
            this.setState({
                active: false
            });
        }
    }

    handleClick(e) {
        this.setState({
            active: true
        });
    }

    render() {
        return (
            <div className="search-box">
                <input
                    style={{
                        border: '1px solid #ccc',
                        backgroundColor: '#fff'
                    }}
                    type="text"
                    className="search-input"
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    onKeyUp={this.handleKeyUp.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)}
                    onClick={this.handleClick.bind(this)}
                />
            </div>
        );
    }
}

module.exports = Search;