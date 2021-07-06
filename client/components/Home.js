const React = require('react')
    , { ToastContainer, toast } = require('react-toastify')

require('react-toastify/dist/ReactToastify.css');

const Database = require('../db/Database');

const InputForm = ({addListItem}) => {
    let input;
    return (
      <form onSubmit={(e) => {
          e.preventDefault();
          addListItem(input.value);
          input.value = '';
        }}>
        <p>
            <input 
                style={{"width" : "100%", "color": "black"}}
                className="form-control col-md-12" 
                ref={(node) => { input = node }} 
                key={'input-field'}
            />
        </p>
      </form>
    );
};

const ListItem = ({item, remove}) => {
    return (
        <a href="#" 
            key={item.name}
            className="list-group-item" 
            onClick={ () => { remove(item.name) } }
        >{item.name}</a>
    );
}
  
const ItemsList = ({items, remove}) => {
    const listItems = items.map((item) => {
        return (
            <ListItem 
                item={item} 
                key={item.name} 
                remove={remove}
            />
        )
    });
    return (
        <div 
            key={'list-group-' + Math.random()}
            className="list-group" 
            style={{marginTop:'30px'}}>
            <ul>
            {items.map((item) => {
                return (
                    <li key={`li-${item.name}`}>
                        <ListItem 
                            item={item} 
                            key={item.name} 
                            remove={remove}
                        />
                    </li>
                )
            })}
            </ul>
        </div>
    );
}
  
class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items : []
        }
        this.addListItem = this.addListItem.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    async componentDidMount() {
        this.db = await Database.get();
        console.log('Home DB', this.db);
        this.db.pets.find().$.subscribe((items) => {
            if (! items) return;
            this.setState({items: items});
            console.log('[componentDidMount][this.state]', this.state)
        });
    }

    async addListItem(val) {
        this.props.db.pets.insert({
            "name": val,
            "age": 2,
            "breed": "Unknown",
            "skills": []
        })
        .then((item) => {
            this.state.items.push(item)
        })
        .catch(err => console.error('Error:', err));
    }

    handleRemove(name) {
        const remainder = this.state.items.filter((item) => {
            if (item.name !== name) return item;
        });

        this.setState({
            items : remainder
        })

        this.props.db.pets.find().where('name').eq(name).remove();
    }
    

    render() {
        return (
            <div style={{width: '100%'}}>
                {/* <div className="App-header">
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">To get started, edit <code>src/App.js</code> and save to reload.</p>
                {this.props.children} */}
                {/* <div>
                    <ul>
                        {this.state.items.map((item) => {
                            return (
                                <li key={item.name}>
                                    {item.name} ({item.breed})
                                </li>
                            )
                        })}
                    </ul>
                </div> */}

                <div>
                    <InputForm addListItem={this.addListItem} />
                </div>
                <ItemsList 
                    key={'items-list'} 
                    items={this.state.items} 
                    remove={this.handleRemove} 
                />
            </div>
        );
    }
}

module.exports = Home;
