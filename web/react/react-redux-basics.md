# React & Redux の基本

## 構造

* Action --> Reducer --> Store --> View --> (繰り返し)

## Terminology

* Action / Action Creator
  * stateへの変更操作
  * Action Creatorは変更操作(Action)を返す関数

* Reducer
  * Actionとstateを受け取って、新しいstateを返す
  * 同じ値を与えたら同じ結果が返る**業務ロジックのない**関数(= Pure Function)
  * REST APIの呼び出しといった状態や元データそのものに手を加えたる操作はAction Creator側で実装する(Middlewareを活用するらしい?)

* Store
  * アプリ内で唯一無二のstate格納場所

* Presentational Components
  * 状態を受け取って画面表示する役割
  * ReactのComponentそのまま

* Container Components
  * Reactの画面とReduxの状態を結びつける役割

## Webpackでbundle

* webpack.config.jsのbundle先は絶対パスを指定しないと怒られる。`path.resolve(__dirname, 'dist')` とすると安全。
* pluginには、`env`, `react`, `stage-2` を入れること
* entryポイントは `js`, `jsx`どちらでもOK

## 参考

* [React + Redux: Architecture Overview](https://articles.coltpini.com/react-redux-architecture-overview-7b3e52004b6e)
* [webpack.config.js](https://medium.freecodecamp.org/part-1-react-app-from-scratch-using-webpack-4-562b1d231e75)
* [Using the ES7 Spread Operator with Webpack](https://stefan.magnuson.co/articles/frontend/using-es7-spread-operator-with-webpack/)

## あとで読む

* [React + ReduxでREST APIを叩いてリスト表示する方法](https://qiita.com/kazmaw/items/a2def8978127ffb11f92)
* [Redux Architecture Guidelines](http://joeellis.la/redux-architecture/)
* [dackdive's blog
 "Redux Architecture Guidelines"を読んだ](http://dackdive.hateblo.jp/entry/2017/06/27/103041)
