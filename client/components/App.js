const React = require('react')
    , { ToastContainer, toast } = require('react-toastify')

require('react-toastify/dist/ReactToastify.css');

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items : []
        }
        this.createDatabase = this.createDatabase.bind(this);
    }

    async componentDidMount() {
        this.db = await this.createDatabase();

        this.db.pets.find().$.subscribe((items) => {
            if (! items) return;
            toast('Reloading items');
            this.setState({items: items});
        });
    }

    async createDatabase() {
        const theSchema = require('schema/schema.json');
        const theData   = require('data/pets.json');
        const RxDB      = require('rxdb');
        const dbName    = 'pets';
        const syncURL   = `http://localhost:5984/${dbName}/`;

        RxDB.addRxPlugin(require('pouchdb-adapter-http'));
        RxDB.addRxPlugin(require('pouchdb-adapter-idb'));

        const db = await RxDB.createRxDatabase({
            name: dbName,
            adapter: 'idb'
        });

        const pets = await db.addCollections({
            pets: {
                schema: theSchema
            }
        });

        db.pets.sync({ remote: syncURL });

        theData.forEach((item) => {
            db.pets.upsert(item);
        })

        db.pets.dump()
            .then(json => console.dir(json));
        
        return db;
    }

    render() {
        return (
            <div>
                <div className="App-header">
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">To get started, edit <code>src/App.js</code> and save to reload.</p>
                {this.props.children}
                <div>
                    <ul>
                        {this.state.items.map((item) => {
                            return (
                                <li key={item.name}>
                                    {item.name}<br/>
                                    {item.breed}<br/>
                                    {item.skills.join(', ')}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

module.exports = App;
