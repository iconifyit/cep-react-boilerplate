const React = require('react'),
    { Provider } = require('react-redux'), 
    store = require('../store/store.js')
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

const Database = require('../db/Database');

class App extends React.Component {
    
    async componentDidMount() {
        this.db = await Database.get();
        console.log('DB', this.db);
        this.db.pets.find().$.subscribe((items) => {
            if (! items) return;
            this.setState({items: items});
            console.log('[componentDidMount][this.state]', this.state)
        });
    }

    render() {
        return (
            <Provider store={store}>
                <React.Fragment>
                    <Router location={'/'} context={{}}>
                        <NavBar />
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
                    </Router>
                </React.Fragment>
            </Provider>
        );
    }
}

module.exports = App;
