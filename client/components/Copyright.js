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
    Anchor,
} = require('antd');
require('antd/dist/antd.css');


class Copyright extends React.Component {
    render() {
        return (
            <div>
                {'Copyright ©'}
                <a 
                    href="#" 
                    onClick={(e) => {e.preventDefault()}} 
                    color="inherit"
                >
                    {new Date().getFullYear()} {' - Iconify.'}
                </a>
            </div>
        )
    }
}

module.exports = Copyright;