/**
 * @url http://markgoodyear.com/2014/01/getting-started-with-gulp/
 * @type {*|Gulp}
 */
const gulp          = require('gulp')
    , path          = require('path')
    , {v4: uuidv4}  = require('uuid')
    , os            = require('os')
    , fs            = require('fs')
    , concat        = require('gulp-concat')
    , cleancss      = require('gulp-clean-css')
    , header        = require('gulp-header')
    , through       = require('through2')
    // , jsxbin        = require( 'jsxbin' )
    , uglify        = require('gulp-uglify')
    , UglifyJS      = require('uglify-js')
    , gnirts        = require('gulp-gnirts')
    , rimraf        = require('rimraf')
    , ncp           = require('ncp')
    , rename        = require("gulp-rename")
    , yui           = require('gulp-yuicompressor')


const kUTF8 = 'utf-8';
const kPKG_VERSION = getVersion();

fs.writeFileSync('VERSION', kPKG_VERSION, kUTF8);

const kAES_DIR            = 'aes'
    , kDIST_DIR           = 'dist'
    , kAES_RSRC_DIR       = 'aes-resources'
    , kAES_CORE_DIR       = `${kAES_RSRC_DIR}/core`
    , kAES_DIALOG_DIR     = `${kAES_CORE_DIR}/dialog`
    , kAES_CUSTOM_DIR     = `${kAES_CORE_DIR}/custom`
    , kAES_NODE_DIR       = `${kAES_CORE_DIR}/node_modules`
    , kAES_CORE_CLASS     = `${kAES_CORE_DIR}/aesp.js`
    , kAES_ABOUT_FILE     = path.resolve(kAES_CUSTOM_DIR, 'about.html')
    , kAES_HEADER_FILE    = path.resolve(kAES_CUSTOM_DIR, 'header.html')
    , kAES_HELP_FILE      = path.resolve(kAES_CUSTOM_DIR, 'help.html')
    , kAES_ANALYTICS_FILE = path.resolve(kAES_CUSTOM_DIR, 'analytics.json')
    , kCLIENT_CSS_FILE    = path.resolve(`${kDIST_DIR}/client/theme/css/client.all.css`)
    , kAES_INVOKE         = path.resolve('aes-resources/mine/aes-invoke.js')

console.log('kPKG_VERSION', kPKG_VERSION)

/**
 * Configuration.
 * @type {{host: {fileName: string, files: string[], target: string}, styles: {fileName: string, files: string[], target: string}}}
 */
const Config = {
    host : {
        fileName : 'host.all.jsx',
        target   : 'dist/host',
        files    : [
            '!host/host.all.jsx'
            , 'host/core/polyfills.js'
            , 'host/core/JSON.jsx'
            , 'host/core/Utils.jsx'
            , 'host/core/Logger.jsx'
            , 'host/core/Helpers.js'
            , 'host/core/functions.js'
            , 'host/Configuration.jsx'
            , 'host/HostResponse.js'
            , 'host/core/Strings.js'
            , 'host/core/FileList.js'
            , 'host/core/Exporter.js'
            , 'host/core/Import.js'

            , 'host/core/Iterator.js'
            , 'host/core/ArtboardsIterator.js'
            , 'host/core/ArtboardLabel.js'
            , 'host/core/FileList.js'
            , 'host/core/IconImporter.js'
            , 'host/core/Observable.js'

            , 'host/core/shared.js'
            , 'host/core/PlugPlugExternalObject.js'
            // , 'host/vendor/is_js/is.min.js'
            , 'host/vendor/is.cleaned.js'

            // , 'host/core/Console.jsx'
            , 'host/Host.jsx'
        ]
    },
    client : {
        fileName : 'main.min.js',
        target   : 'dist',
        files    : [
            '!main.min.js'
            , 'dist/main.js'
        ],
        substitutions : [
            {
                search  : /main\.js/g,
                replace : function(match) {
                    return `main.min.js`
                }
            }
        ]
    },
    aes : {
        fileName : 'main.aes.js',
        target   : 'aes',
        files    : [
            '!main.aes.js'
            , kAES_CORE_CLASS
            , 'aes/main.js'
        ],
        substitutions : [
            {
                search  : /main\.min\.js/g,
                replace : function(match) {
                    return `main.aes.js`
                }
            },
            {
                search  : /@kPKG_VERSION@/g,
                replace : function(match) {
                    return kPKG_VERSION
                }
            }
        ]
    },
    styles : {
        fileName : 'client.all.css',
        target   : 'dist/client/theme/css/',
        files    : [
            '!client/theme/css/client.all.css'
            , 'client/theme/font/stylesheet.css'
            , 'client/theme/css/topcoat-desktop-dark.css'
            , 'client/lib/jquery-ui/jquery-ui.css'
            , 'client/theme/css/main.css'
            , 'client/theme/css/brackets.css'
            , 'client/theme/material-design-icons/iconfont/material-icons.css'
            , 'client/theme/font/icomatic.css'
            , 'client/theme/style.css'
            , 'client/theme/layout.css'
        ],
        substitutions : [
            {
                search  : /MaterialIcons-Regular\.([ttf|eof|woff2|woff]+)/g,
                replace : function(match) {
                    return `../material-design-icons/iconfont/${match}`
                }
            },
            {
                search  : /icomatic\.([ttf|eof|woff2|woff|svg#icomatic]+)/g,
                replace : function(match) {
                    return `../font/${match}`
                }
            },
            {
                search  : /(url\(.*sourcesanspro)/g,
                replace : function(match) {
                    return match
                        .replace('../font/', '')
                        .replace('../', '')
                        .replace('./', '')
                        .replace('sourcesanspro', '../font/sourcesanspro');
                }
            },
            {
                search  : /(url\(.*img\/placeholder.png.*\))/g,
                replace : function(match) {
                    if (match === undefined) return;
                    return match
                        .replace('../', '')
                        .replace('./', '')
                        .replace('img/', '../img/');
                }
            },
            {
                search  : /(url\(.*images\/ui-)/g,
                replace : function(match) {
                    return match
                        .replace('ui-', 'lib/jquery-ui/images/ui-');
                }
            },
        ]
    }
}

/**
 * Wrap gulp streams into fail-safe function for better error reporting
 * Usage:
 * gulp.task('less', wrapPipe(function(success, error) {
 *   return gulp.src('less/*.less')
 *      .pipe(less().on('error', error))
 *      .pipe(gulp.dest('app/css'));
 * }));
 *
 * @author just-boris
 * @url    https://gist.github.com/just-boris/89ee7c1829e87e2db04c
 *
 * @param taskFn
 * @returns {Function}
 */
function wrapPipe(taskFn) {
    return async function(done) {
        var onSuccess = function() {
            done();
        };
        var onError = function(err) {
            done(err);
        }
        var outStream = taskFn(onSuccess, onError);
        if (outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    }
}

/**
 * Replace main.js link with uglified version.
 * @param substitutions
 * @returns {*}
 */
function doSubstitutions(substitutions) {
    return through.obj(function(file, encoding, callback) {
        if (file.isStream()) {

            substitutions.map(function(rule) {

                // console.log('@SUB 1@', [
                //     rule.search,
                //     rule.replace,
                //     file.contents.match(rule.search)
                // ])

                file.contents = contents.pipe(
                    file.contents.replace(
                        rule.search,
                        rule.replace
                    )
                );
            });

            return callback(null, file);
        }

        if (file.isBuffer()) {
            var contents = String(file.contents);
            substitutions.map(function(rule) {

                // console.log('@SUB 2@', [
                //     rule.search,
                //     rule.replace,
                //     contents.match(rule.search)
                // ])

                contents = contents.replace(
                    rule.search,
                    rule.replace
                );
            });

            file.contents = Buffer.from(contents);

            return callback(null, file);
        }
        callback(null, file);
    });
}

/**
 * Gets version number from package.json
 * @returns {*}
 */
function getVersion() {
    var pkg = JSON.parse(
        fs.readFileSync('package.json')
    );
    return pkg.version;
}

/**
 * Compress JSX file.
 */
// gulp.task('jsxbin', wrapPipe(function(success, error) {
//     const sourceFile = `${Config.host.target}/${Config.host.fileName}`
//         , targetFile = sourceFile.replace('.jsx', '.jsxbin')
//
//     jsxbin( sourceFile, targetFile )
//         .then( (outputfiles) => {
//             console.log('JSXBIN outputfiles', outputfiles)
//             console.log( 'Finished!' )
//         })
//         .catch( err => {
//             console.error( err )
//         })
// }));

/**
 * Build host scripts.
 */
gulp.task('host', wrapPipe(function(success, error) {

    const fileList = []
        , dirname  = uuidv4()
        , tmpdir   = path.join(os.tmpdir(), dirname)

    fs.mkdirSync(tmpdir);

    Config.host.files.forEach((file) => {

        console.log(`Reading file ${path.resolve(file)}`)

        if (! fs.existsSync(file)) return;

        let fileName = path.basename(file)
            , contents = fs.readFileSync(file, 'utf-8');

        var header = [
            `/* ================================================== */`,
            `/* INCLUDE : ${file} */`,
            `/* ================================================== */`
        ];
        contents = `${header.join('\n')}\n\n${contents}`
        contents += `\n\nif (kDEBUG) { alert("Include ${fileName}") }\n\n`;
        fs.writeFileSync(`${tmpdir}/${fileName}`, contents);

        fileList.push(`${tmpdir}/${fileName}`);
    });

    console.log(`Gulp tmp dir is ${tmpdir}/${dirname}`);

    gulp.src(fileList)
        .pipe(concat(Config.host.fileName).on('error', error))
        .pipe(header('var kDEBUG = false;\n\n'))
        .pipe(gulp.dest(Config.host.target))
        .pipe(uglify())
        .pipe(rename('host.ugly.jsx'))
        .pipe(gulp.dest(Config.host.target))
}));

/**
 * Build host scripts.
 */
gulp.task('client', wrapPipe(function(success, error) {

    const fileList = []

    gulp.src(Config.client.files)
        .pipe(concat(Config.client.fileName).on('error', error))
        // .pipe(gnirts())
        .pipe(uglify()) // { output : { ascii_only : true } }
        .pipe(gulp.dest(Config.client.target));

    return gulp.src("dist/client/index.html")
        .pipe(doSubstitutions(Config.client.substitutions))
        .pipe(gulp.dest(`${Config.client.target}/client/`, {overwrite: true}));
}));

/**
 * Build styles.
 */
gulp.task('styles', wrapPipe(function(success, error) {
    return gulp.src(Config.styles.files)
        .pipe(concat(Config.styles.fileName).on('error', error))
        .pipe(doSubstitutions(Config.styles.substitutions))
        .pipe(cleancss())
        .pipe(gulp.dest(Config.styles.target))
        .on('success', success);
}));

/**
 * Copy dist folder to AES version.
 */
gulp.task('aes', function(success, error) {
    return new Promise((resolve, reject) => {

        const kAES_FILES = [
            kAES_ABOUT_FILE,
            kAES_HEADER_FILE,
            kAES_HELP_FILE,
            kAES_ANALYTICS_FILE
        ]

        if (fs.existsSync(kAES_DIR)) {
            rimraf.sync(kAES_DIR);
        }

        ncp(kDIST_DIR, kAES_DIR, {clobber: true}, function(err) {
            if (err) {
                console.trace();
                throw err;
            }
            ncp(kAES_DIALOG_DIR, `aes/dialog`, {clobber: true}, function(err) {
                if (err) {
                    console.trace();
                    reject(err)
                }

                console.log(`Folder ${kAES_DIALOG_DIR} copied`)

                ncp(kAES_NODE_DIR, `aes/node_modules`, {clobber: true}, function(err) {
                    if (err) {
                        console.trace();
                        reject(err)
                    }

                    console.log(`Folder ${kAES_NODE_DIR} copied`)

                    kAES_FILES.forEach((file, i) => {
                        ncp(file, `aes/custom/${path.basename(file)}`, {clobber: true}, function(err) {
                            if (err) {
                                console.trace();
                                reject(err)
                            }
                            console.log(`File ${file} copied`)

                            if (i === (kAES_FILES.length - 1)) {
                                ncp(kCLIENT_CSS_FILE, `${kAES_DIR}/client/theme/css/client.all.css`, {clobber: true}, function(err) {
                                    if (err) {
                                        console.trace();
                                        reject(err);
                                    }
                                    console.log('client.all.css copied');

                                    ncp("dist/host", `${kAES_DIR}/host`, {clobber: true}, function(err) {
                                        if (err) {
                                            console.trace();
                                            reject(err);
                                        }

                                        console.log('host dir copied');
                                        resolve('Task aes completed.');
                                    })

                                })
                            }
                        })
                    })
                })
            })
        });
    })
})

/**
 * Prepare the Client code for the AEScripts framework.
 */
gulp.task('client-aes', wrapPipe(function(success, error) {

    const fileList = []
        , kAES_INVOKE_UGLY = kAES_INVOKE.replace('.js', '.ugly.js')
        , uglified = UglifyJS.minify(fs.readFileSync(kAES_INVOKE, kUTF8), {})
        , kAES_INVOKE_CODE = uglified.code.split('"').join("'");

    fs.writeFileSync(kAES_INVOKE_UGLY, kAES_INVOKE_CODE, kUTF8);

    gulp.src(Config.aes.files)
        .pipe(concat(Config.aes.fileName).on('error', error))
        .pipe(doSubstitutions([
            {
                search  : 'flyoutMenu.build();',
                replace : '/*flyoutMenu.build();*/'
            },
            {
                search  : /\/\*{{kCOMMENT_ON}}\*\//g,
                replace : '/*'
            },
            {
                search  : /\/\*{{kCOMMENT_OFF}}\*\//g,
                replace : '*/'
            },
            {
                search  : /\/\*{{kAESP_INVOKE}}\*\//g,
                replace : kAES_INVOKE_CODE
            },
            {
                search  : /{{kPKG_VERSION}}/g,
                replace : function(match) {
                    return kPKG_VERSION
                }
            },
        ]))
        // .pipe(gnirts())
        .pipe(uglify()) // .pipe(uglify({ output : { ascii_only : true } }))
        .pipe(gulp.dest(Config.aes.target));

    const kAES_MANIFEST       = 'aes/csxs/manifest.xml'
        , kAES_CLIENT         = 'aes/client/index.html'
        , kAES_DISPATCH_FILE  = 'aes-resources/mine/DispatchInfoList.xml'
        , kAES_EXT_INFO_FILE  = 'aes-resources/mine/ExtensionList.xml'
        , kAES_DISPATCH_TOKEN = '</DispatchInfoList>'
        , kAES_EXT_TOKEN      = '</ExtensionList>'

    let manifest        = fs.readFileSync(kAES_MANIFEST, kUTF8)
        , dispatchInfo  = fs.readFileSync(kAES_DISPATCH_FILE, kUTF8)
        , extensionInfo = fs.readFileSync(kAES_EXT_INFO_FILE, kUTF8)

    manifest = manifest
        .replace(kAES_DISPATCH_TOKEN, `${dispatchInfo}\n${kAES_DISPATCH_TOKEN}`)
        .replace(kAES_EXT_TOKEN, `${extensionInfo}\n${kAES_EXT_TOKEN}`)

    fs.writeFileSync(kAES_MANIFEST, manifest, kUTF8);

    return gulp.src(kAES_CLIENT)
        .pipe(doSubstitutions(Config.aes.substitutions))
        .pipe(gulp.dest(`${Config.aes.target}/client/`, {overwrite: true}))
        .on('success', success);
}));

/**
 * Prepare the Host code for the AEScripts framework.
 */
gulp.task('host-aes', wrapPipe(function(success, error) {
    console.log('PLATFORM', os.platform())
    if (os.platform() !== 'darwin') {
        console.log('Disabling host-aes task on Windows');
        success();
    }
    return gulp.src(`${Config.aes.target}/host/host.all.jsx`)
        .pipe(doSubstitutions([
            {
                search  : 'Exporter.prototype.export',
                replace : 'Exporter["prototype"]["export"]'
            },
            {
                search  : /Exporter\.prototype\.([^ ]+)/g,
                replace : 'Exporter["prototype"]["$1"]'
            }
        ]))
        .pipe(yui({
            type: 'js'
        }))
        .pipe(gulp.dest(`${Config.aes.target}/host/`));
}))

gulp.task('platform', wrapPipe(function(success, error) {
    console.log('PLATFORM', os.platform())
    success()
}));

/**
 * default task
 */
gulp.task('default', gulp.series(['host']));

/**
 * Build all task
 */
gulp.task('build', gulp.series([
    'client',
    'host',
    'styles',
    'aes',
    'client-aes',
    'host-aes',
    'platform'
]));
