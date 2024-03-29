const React = require('react')
    , ReactDOM = require('react-dom')


class FlyoutMenuReact extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Menu>
                <MenuItem Id="enabledMenuItem" Label="Enabled Menu Item" Enabled="true" Checked="false"/>
                <MenuItem Id="disabledMenuItem" Label="Disabled Menu Item" Enabled="false" Checked="false"/>
                <MenuItem Label="---" />
                <MenuItem Id="checkableMenuItem" Label="Checkable Menu Item" Enabled="true" Checked="true"/>
                <MenuItem Label="---" />
                <MenuItem Id="actionMenuItem" Label="Click me to enable/disable the Target Menu!" Enabled="true" Checked="false"/>
                <MenuItem Id="targetMenuItem" Label="Target Menu Item" Enabled="true" Checked="false"/>
                <MenuItem Label="---" />
                <MenuItem Label="Parent Menu (wont work on PS CC 2014.2.0)">
                    <MenuItem Label="Child Menu 1"/>
                    <MenuItem Label="Child Menu 2"/>
                </MenuItem>
            </Menu>
        )
    }
}