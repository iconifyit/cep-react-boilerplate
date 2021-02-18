const React = require('react')
const ReactDOM = require('react-dom');
const { createStore } = require('redux');

class App extends React.Component {
    componentDidMount() {
        csInterface.setContextMenuByJSON(
            JSON.stringify(this.props.contextMenuRouter.menuItems), 
            (menuId) => {
                this.props.contextMenuRouter.call(menuId);
                csInterface.setContextMenu('');
            }
        )
    }

    render() {
        return (
            <div>
                <div className="App-header">
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">To get started, edit <code>src/App.js</code> and save to reload.</p>
                {this.props.children}
            </div>
        );
    }
}

module.exports = App;
