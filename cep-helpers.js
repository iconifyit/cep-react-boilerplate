/**
 * Get an extension object. Defaults to current extension.
 * @param extensionId
 * @returns {*}
 */
function getExtension( extensionId ) {
    var extension,
        extensions;

    if (typeof(extensionId) == 'undefined') {
        extensionId = csInterface.getExtensionId();
    }

    extensions = csInterface.getExtensions( [extensionId] );

    if ( extensions.length == 1 ) {

        extension = extensions[0];
        var extPath = csInterface.getSystemPath(SystemPath.EXTENSION);
        extension.basePath = slash( extension.basePath );

        if (get(extension, 'basePath', false)) {

            extension.customPath = extension.basePath + 'custom';

            // xmlString   = readFileData(toPath(extension.basePath, 'CSXS/manifest.xml'));
            // theManifest = $.parseXML(xmlString);
            // var $ext    = $('Extension[Id="' + extension.id + '"]', theManifest).eq(0);
            //
            // extension.version = $ext.attr('Version');
        }
    }

    return {
        id            : get( extension, 'id', '' ),
        name          : get( extension, 'width', '' ),
        version       : get( extension, 'version', ''),

        basePath      : slash( get( extension, 'basePath', '' ) ),
        mainPath      : slash( get( extension, 'mainPath', '' ) ),

        windowType    : get( extension, 'width', '' ),
        isAutoVisible : get( extension, 'width', '' ),

        height        : get( extension, 'height', '' ),
        width         : get( extension, 'width', '' ),
        maxHeight     : get( extension, 'width', '' ),
        maxWidth      : get( extension, 'width', '' ),
        minHeight     : get( extension, 'width', '' ),
        minWidth      : get( extension, 'width', '' )
    };
}