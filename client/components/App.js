const React = require('react')
    , { Provider, connect } = require('react-redux')
    , store = require('../store/store.js')
;

const Data = require('../actions/data.js');
const Illustrator = require('../actions/illustrator.js')

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
const Pets = require('./Pets');

// const Database = require('../db/Database');

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

// const 
//     { Provider, connect } = require('react-redux')
//     , store = require('../store/store.js')
// ;

const { Header, Footer, Sider, Content } = Layout;
// const Context = React.createContext();
// const HelpersContext = React.createContext();
class App extends React.Component {

    constructor(props) {
        super(props);

        console.log('[App][constructor] props', props);

        this.state = {
            open: false,
        }
        this.toggleState = this.toggleState.bind(this);

        console.log('[App][constructor][this]', this);
    }
    
    async componentDidMount() {
        // const action = await this.props.getItems();
        // console.log('[componentDidMount][action]', action);
        // this.setState({ 
        //     items : action.items
        // });

        // console.log('[App].context.store', this.context.store);
        // console.log('[App].context', this.context);
        // console.log('[App]', this);
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
            <Router location={'/'} context={{store: store}}>
                <Layout style={this.bodyStyles()}>
                    <Header style={this.headerStyles()}>
                        <NavBar />
                    </Header>
                    
                    <Content style={this.sectionStyles()}>
                        <Layout style={this.containerStyles()}>
                            <Content style={this.containerStyles()}>
                                <Pets />
                                <Switch>
                                    <Route exact path={'/'}>
                                        <Home />
                                    </Route>
                                    <Route exact path={'/about'} component={About}/>
                                    <Route exact path={'/search'}>
                                        <Search />
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
        );
    }

}

// const mapStateToProps = (state) => {
//     return {
//         open : state.data.open,
//     };
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         getItems : async () => {
//             const action = await dispatch( Data.getAll() );
//             return action.items;
//         }
//     };
// };
  
// module.exports = connect(mapStateToProps, mapDispatchToProps)(App)

module.exports = App;