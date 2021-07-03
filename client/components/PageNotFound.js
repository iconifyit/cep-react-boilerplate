const React = require('react')
    , { ToastContainer, toast } = require('react-toastify')

require('react-toastify/dist/ReactToastify.css');

  
class PageNotFound extends React.Component {
    render() {
        return (
            <h2>Doh! Page Not Found.</h2>
        );
    }
}

module.exports = PageNotFound;
