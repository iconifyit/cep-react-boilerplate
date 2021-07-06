const React = require('react');
const ReactDOM = require("react-dom");
const {
  Link
} = require("react-router-dom");

const Home = require('./Home');
const Search = require('./Search');
const About = require('./About');

const {
    Modal,
    Divider,
    Dialog,
    Drawer,
    Space,
    Dropdown,
    Menu,
} = require('antd');
require('antd/dist/antd.css');

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.Menu = this.Menu.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleClick(e) {
        // e.preventDefault();
        console.log(e.currentTarget.href);
        console.log(window.location);

        try { e.preventDefault() } catch (err) { }

        try {
            window.location = e.currentTarget.href;
        }
        catch(e) {
            console.log(e);
        }
        // ReactDOM.render(<About/>, document.getElementById('content'))
    }

    handleButtonClick(e) {
        console.log('click left button', e);
    }

    handleMenuClick(e) {
        console.log('click', e);
    }

    Menu(props) {
        return (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">
                    <Link to="/" onClick={this.handleClick} replace>Home</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/about" onClick={this.handleClick} replace>About</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to="/search" onClick={this.handleClick} replace>Search</Link>
                </Menu.Item>
            </Menu>
        );
        // return (
        //     <ul>
        //         <li><Link to="/" onClick={this.handleClick} replace>Home</Link></li>
        //         <li><Link to="/about" onClick={this.handleClick} replace>About</Link></li>
        //         <li><Link to="/search" onClick={this.handleClick} replace>Search</Link></li>
        //     </ul>
        // )
    };

    render() {
        return (
            <Space wrap>
                <div>
                    <Dropdown.Button onClick={this.handleButtonClick} overlay={this.Menu}>
                        Menu
                    </Dropdown.Button>
                </div>
            </Space>
        )
    }
}

module.exports  = NavBar;