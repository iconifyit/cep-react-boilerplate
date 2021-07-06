const React = require('react'),
    { Provider } = require('react-redux'), 
    store = require('../store/illustrator.js'),
    ReactDOM = require('react-dom')
;

const {
    Switch,
    Route,
} = require("react-router-dom");
const Router = require('react-router-dom').HashRouter;

const NavBar = require('./NavBar');
const Home = require('./Home');
const Search = require('./Search');
const About = require('./About');
const PageNotFound = require('./PageNotFound');
const Copyright = require('./Copyright');
const Tester = require('./Tester');

const Database = require('../db/Database');

// const { 
//     makeStyles,
//     CssBaseline,
//     AppBar,
//     Toolbar,
//     Paper,
//     Stepper,
//     Step,
//     StepLabel,
//     // Button,
//     // Link,
//     Typography,
//     Container,
//     Box,
// } = require('@material-ui/core');

const {
    Button,
    Modal,
    Divider,
    Dialog,
    Drawer,
    Space,
    Dropdown,
    Menu,
    Layout,
    Icon,
    Link,
} = require('antd');
require('antd/dist/antd.css');

const { Header, Footer, Sider, Content } = Layout;
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            modalOpen: false,
        }
        this.toggleState = this.toggleState.bind(this);
    }
    
    async componentDidMount() {
        this.db = await Database.get();
        console.log('DB', this.db);
        this.db.pets.find().$.subscribe((items) => {
            if (! items) return;
            this.setState({items: items});
            console.log('[componentDidMount][this.state]', this.state)
        });
    }    

    toggleState(e, state) {
        try { e.preventDefault() } catch (e) {}
        this.setState({
            [state]: ! this.state[state]
        });
    }

    bodyStyles() {
        return {
            height: '100vh', 
        }
    }

    headerStyles() {
        return {
            padding: '0 16px'
        }
    }


    sectionStyles() {
        return {
            padding: '16px',
            width : '100%'
        }
    }

    containerStyles() {
        return {
            width : '100%'
        }
    }

    render() {
        return (
            <Provider store={store}>
                <React.Fragment>
                    <Router location={'/'} context={{}}>
                        <Layout style={this.bodyStyles()}>
                            <Header style={this.headerStyles()}>
                                <NavBar />
                            </Header>
                            
                            <Content style={this.sectionStyles()}>
                                <Layout style={this.containerStyles()}>
                                    <Content style={this.containerStyles()}>
                                        <Tester store={store} />
                                        <Switch>
                                            <Route exact path={'/'}>
                                                <Home db={this.db} />
                                            </Route>
                                            <Route exact path={'/about'} component={About}/>
                                            <Route exact path={'/search'}>
                                                <Search db={this.db} />
                                            </Route>
                                            <Route exact component={PageNotFound}/>
                                        </Switch>
                                    </Content>
                                </Layout>
                            </Content>

                            <Footer style={this.sectionStyles()}>
                                <Copyright />
                            </Footer>
                        </Layout>

                    </Router>
                </React.Fragment>
            </Provider>
        );
    }

}

module.exports = App;
