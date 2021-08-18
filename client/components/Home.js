const React = require('react');


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

class Home extends React.Component {
    constructor(props) {
        super(props);
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
                <h2>Home Page</h2>
            </Space>
        )
    }
}
  
module.exports = Home;
  