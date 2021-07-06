const React = require('react');
const PropTypes =  require('prop-types');
const Actions = require('../actions/illustrator.js');

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

class Tester extends React.Component {
    constructor(props) {
        super(props);
        this.store = props.store;
        this.state = this.store.getState()
        this.test = this.test.bind(this);

        this.store.subscribe(() => {
            this.setState(this.store.getState())
        })
    }

    test() {
        this.store.dispatch(Actions.alert())
    }

    toggleState(e, state) {
        try { e.preventDefault() } catch (e) {}
        this.setState({
            [state]: ! this.state[state]
        });
    }

    render() {
        return (
            <Space direction="vertical">
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
                
                <Divider dashed style={{width: '100%'}} />
            
                <Button type={'primary'} onClick={this.test}>
                    Say Hi
                </Button>

                <Divider dashed style={{width: '100%'}} />
            </Space>
        )
    }
}

module.exports = Tester