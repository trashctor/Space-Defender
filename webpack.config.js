module.exports = {
  context: __dirname,
  entry: "./lib/space_defender.js",
  output: {
    path: "./lib/",
    filename: "bundle.js"
  },
  devtool: 'source-map',
  resolve: {
    extensions: ["", ".js", ".jsx"]
  }
};
