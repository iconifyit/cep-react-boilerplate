const name     = 'Mason-Icon-Archiver'
const bundleId = 'com.atomic.icon-mason'
const version  = '1.0.0'

module.exports = {
    bundler: {
        src      : 'dist',
        build    : 'build',
        dest     : 'bundle',
        devPort  : 5000,
        live     : true,
        manifest : {
            name      : name,
            bundleId  : bundleId,
            cefParams : [
                '--allow-file-access-from-files',
                '--allow-file-access',
                '--enable-nodejs',
                '--mixed-context'
            ],
            cepVersion: '6.0',
            version: version,
            apps: [
                {
                    id   : 'ILST',
                    from : '1.0',
                    to   : '99 .9 ',
                    port : '4003'
                }
            ]
        }
    },
    packager: {
        name     : name,
        bundleId : bundleId,
        version  : version,
        src      : './build',
        zxp : {
            cert             : `${__dirname}/bin/selfDB.p12`,
            certPassword     : '',
            dest             : `${__dirname}/zxp/${name}-${version}.zxp`
        },
        macOs : {
            dest             : `${__dirname}/zxp/${name}-${version}.pkg`,
            keychain         : 'login.keychain',
            keychainPassword : '',
            identify         : 'Developer ID Installer: Atomic Lotus',
            resources        : `${__dirname}/resources/macos`
        },
        windows : {
            dest             : `${__dirname}/zxp/${name}-${version}.exe`,
            resources        : `${__dirname}/resources/windows`
        },
        paths : {
            cwd: `${__dirname}/zxp`
        }
    }
}
