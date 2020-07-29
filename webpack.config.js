module.exports = {
    mode: 'development',
    devtool: false,
    entry: {
        index: './src/index.ts'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [{
            test: /\.ts/,
            use: [{
                loader: 'ts-loader'
            }],
            exclude: /node_modules/
        }]
    }
}