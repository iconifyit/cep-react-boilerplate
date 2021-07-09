const React = require('react');
const {connect} = require('react-redux');
const Illustrator = require('../actions/illustrator.js')
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
    Button,
} = require('antd');
require('antd/dist/antd.css');

class NavBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        }

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

    toggleState(e, state) {
        try { e.preventDefault() } catch (e) {}
        this.setState({
            [state]: ! this.state[state]
        });
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
    };

    render() {
        return (
            <Space wrap>
                <div>
                    <Dropdown.Button onClick={this.handleButtonClick} overlay={this.Menu}>
                        Menu
                    </Dropdown.Button>

                    <span style={{marginRight: '10px', display: 'inline-block'}}></span>

                    <Button 
                        type={'primary'} 
                        onClick={() => this.setState({open: true})}
                    >
                        Show Modal
                    </Button>
                    <Modal
                        title="Dad Joke"
                        centered
                        visible={this.state.open}
                        onOk={(e) => this.toggleState(e, 'open')}
                        onCancel={(e) => this.toggleState(e, 'open')}
                    >
                        <p>How much space do you need to grow fungi? (A) As mushroom as it takes.</p>
                    </Modal>

                    <span style={{marginRight: '10px', display: 'inline-block'}}></span>

                    <Button type={'primary'} onClick={this.props.alert}>
                        Hi
                    </Button>
                </div>
            </Space>
        )
    }
}

// module.exports  = NavBar;

const mapStateToProps = (state) => {
    console.log('[NavBar][mapStateToProps]', state);
    return {
        open : state.open,
    };
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        alert : () => { return dispatch( Illustrator.alert() ) }
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(NavBar)