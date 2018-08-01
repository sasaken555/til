# ReactでNode.jsの環境変数を扱う場合

## 要するに

- ReactのJSに環境変数を埋め込む場合は、Webpack経由で渡してあげないといけない。
  - 単純にNode.js側と同じように `process.env.AWSOME_ENV_VAL` と書いても参照できずに`undefined`となるだけ。

- Webpackで`DefinePlugin`を使って定義すれば指定した環境変数で値を上書きする模様。
  - DefinePlugin: https://webpack.js.org/plugins/define-plugin/
  - 勿論Webpackで環境変数を使いたい場合は直接`process.env.AWSOME_ENV_VAL`としてOK

## コード例

```:js
const webpack = require('webpack');
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'API_BASE_PATH': JSON.stringify(process.env.API_BASE_PATH)
      }
    })
  ],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
};
```
