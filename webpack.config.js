const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        main: path.join(__dirname, "js/main.js"),
        option: path.join(__dirname, "js/option.js"),
    },
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: "[name].js"
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: ".",
                    to: "../",
                    context: "public"
                }
            ]
        })
    ]
}