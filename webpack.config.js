module.exports = function (webpackEnv) {


    // ...
    return {
        externals: {
            '@sparticuz/chromium': '@sparticuz/chromium',
        },
        resolve: {

            // ...
            fallback: {

                "fs": false,
                "os": false,
                "path": false,
            }
        }
    }
}