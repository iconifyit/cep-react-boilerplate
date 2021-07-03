const React = require('react');
const ReactDOM = require("react-dom");
const {
  Link
} = require("react-router-dom");

const Home = require('./Home');
const Search = require('./Search');
const About = require('./About');

class NavBar extends React.Component {
    handleClick(e) {
        // e.preventDefault();
        console.log(e.currentTarget.href);
        console.log(window.location);

        try {
            window.location = e.currentTarget.href;
        }
        catch(e) {
            console.log(e);
        }
        // ReactDOM.render(<About/>, document.getElementById('content'))
    }

    render() {
        return (
            <ul>
                <li><Link to="/" onClick={this.handleClick} replace>Home</Link></li>
                <li><Link to="/about" onClick={this.handleClick} replace>About</Link></li>
                <li><Link to="/search" onClick={this.handleClick} replace>Search</Link></li>
            </ul>
        )
    }
}

module.exports  = NavBar;