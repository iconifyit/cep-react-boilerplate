const ReactDOM            = require('react-dom')
    , React               = require('react')
    , {contextMenuRouter} = require('../../cs-internals.js')

require('../../lib/jsx-console/jsx-console.js');
require('../../lib/FlyoutMenu/FlyoutMenuImpl.js');


// TODO: I'm not sure this is the best place for this.
const addContextMenu = () => {
    const {csInterface} = CSLib;
    if (csInterface) {
        csInterface.setContextMenuByJSON(
            JSON.stringify(contextMenuRouter.menuItems), 
            (menuId) => {
                contextMenuRouter.call(menuId);
                csInterface.setContextMenu('');
            }
        )
    }
};

class AdobeExtension extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }
    componentDidMount() {
        addContextMenu();
    }

    render() {
        return (
            <script id='context-menu' type={'json'}>
                {JSON.stringify(contextMenuRouter.menuItems)}
            </script>
        );
    }
}

module.exports = AdobeExtension;