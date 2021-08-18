const themeSwitcherStyles = require('./ThemeSwitcher.css')

const ThemeSwitcher = () => {

    const info = (name, value) => {
        // console.log(name, value);
    }

    const changeThemeColor = () => {
        var hostEnv     = csInterface.getHostEnvironment(),
            UIColorObj  = hostEnv.appSkinInfo.appBarBackgroundColor,
            red         = Math.round(UIColorObj.color.red),
            green       = Math.round(UIColorObj.color.green),
            blue        = Math.round(UIColorObj.color.blue),
            alpha       = Math.round(UIColorObj.color.alpha),
            colorRGB    = "#" + red.toString(16) + green.toString(16) + blue.toString(16),
            hexSum      = Number(red + blue + green),
            bodyClass   = 'theme-gray-medium',
            body        = document.getElementsByTagName("body")[0];

        // console.log('[ThemeSwitcher.js][changeThemeColor] UIColorObj', UIColorObj);
        // console.log('[ThemeSwitcher.js][changeThemeColor] colorRGB', colorRGB);

        if (hexSum <= 200) {
            // #323232
            bodyClass = 'theme-gray-dark';
        }
        else if (hexSum > 200 && hexSum <= 500) {
            // #535353
            bodyClass = 'theme-gray-medium';
        }
        else if (hexSum > 500 && hexSum <= 650) {
            // #b8b8b8
            bodyClass = 'theme-gray-lite';
        }
        else if (hexSum > 650) {
            // #f0f0f0
            bodyClass = 'theme-white';
        }

        try {
            var _class = [];

            if (body.className.indexOf('disabled') != -1) {
                _class.push('disabled');
            }

            _class.push(bodyClass);

            body.className = _class.join(' ');
        }
        catch(e) {
            console.error(e);
        }
    }

    const updateTheme = () => {

        // console.log('[ThemeSwitcher.js][updateTheme]', 'Update theme');

        new CSInterface().addEventListener(
            CSInterface.THEME_COLOR_CHANGED_EVENT,
            changeThemeColor
        )
        changeThemeColor();
    }

    body = document.getElementsByTagName("body")[0];

    body.onload = updateTheme();

    updateTheme();
};

module.exports = ThemeSwitcher;
