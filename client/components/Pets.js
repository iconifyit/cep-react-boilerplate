const React = require('react');
const PropTypes =  require('prop-types');
const {connect} = require('react-redux');
const Data = require('../actions/data.js');
const PetsModel = require('../models/Pets');

// const Database = require('../db/Database');

const InputForm = (props) => {
    let input;
    return (
      <form onSubmit={(e) => {
          e.preventDefault();
          props.addListItem(input.value);
          input.value = '';
        }}>
        <p>
            <input 
                style={{"width" : "100%", "color": "black"}}
                className="form-control col-md-12" 
                ref={(node) => { input = node }} 
                key={'input-field'}
                placeholder={props.placeholder}
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
    let listItems = [];
    if (items.length) {
        items.map((item) => {
            return (
                <ListItem 
                    item={item} 
                    key={item.name} 
                    remove={remove}
                />
            )
        });
    }
    return (
        <div 
            key={'list-group-' + Math.random()}
            className="list-group" 
            style={{marginTop:'30px'}}>
            <ul>
            {items.length ? items.map((item) => {
                return (
                    <li key={`li-${item.name}`}>
                        <ListItem 
                            item={item} 
                            key={item.name} 
                            remove={remove}
                        />
                    </li>
                )
            }) : <li>No pets listed.</li>}
            </ul>
        </div>
    );
}
  
class Pets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        }
        console.log('[Pets][constructor][this]', this);

        this.addListItem = this.addListItem.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    async componentDidMount() {

        this.model = await PetsModel;
        const pets = await this.model.getAll();
        this.setState({
            items: pets
        });

        console.log('[Pets][componentDidMount] pets', pets);
        console.log('[Pets][componentDidMount] this', this);
        console.log('[Pets][componentDidMount] props', this.props);
        console.log('[Pets][componentDidMount] state', this.state);
    }  

    componentDidUpdate  (prevProps, prevState) {
        console.log('[Pets] componentDidUpdate', prevProps, prevState);
    }

    async addListItem(val) {
        this.model.create({
            "name": val,
            "age": 2,
            "breed": "Unknown",
            "skills": []
        })
        .then((item) => {
            console.log('[Pets.addListItem] item', item);
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
                <h3>My Pets</h3>
                <div>
                    <InputForm addListItem={this.addListItem} placeholder={'Enter value'} />
                </div>
                <ItemsList 
                    key={'items-list'} 
                    items={this.state.items ? this.state.items : []} 
                    remove={this.handleRemove} 
                />
            </div>
        );
    }
}

module.exports = Pets;

// const mapStateToProps = (state) => {
//     const props = {
//         items : state.data.items
//     };
//     console.log('[Pets][mapStateToProps] state', state);
//     console.log('[Pets][mapStateToProps] props', props);
//     return props;
// }
  
// const mapDispatchToProps = (dispatch) => {
//     const props = {
//         getItems : () => {
//             const result = dispatch( Data.getPets() );
//             return result.items;   
//         },
//     };
//     console.log('[Pets][mapDispatchToProps] props', props);
//     return props;
// };

// module.exports = connect(mapStateToProps, mapDispatchToProps)(Pets)
