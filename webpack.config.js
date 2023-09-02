const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const production = process.env.NODE_ENV === "production";

module.exports = {
  entry: { myAppName: path.resolve(__dirname, "./src/index.js") },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: production ? "[name].[contenthash].js" : "[name].js",
    assetModuleFilename: "assets/[name][ext]",
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader", 
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg)$/i,
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".*", ".js", ".jsx", ".scss"],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./src/assets/favicon.png",
    }),
    new MiniCssExtractPlugin({
      filename: production ? "[name].[contenthash].css" : "[name].css",
    }),
  ],
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  devtool: "source-map",
  mode: production ? "production" : "development",
};
