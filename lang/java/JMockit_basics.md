# JMockit でモック

## About

- Java のモックライブラリ

  - 名前は似ているけど, Mockit とは別物

- ガイド
  - [JMockit - An automated testing toolkit for Java](http://jmockit.github.io/index.html)

## 使い方

### アノテーション

- `@Mocked`
  - 空のコンストラクタ, メソッドを持つインスタンスを生成
- `@Injectable`
  - Inject 対象をモック
- `@Tested`
  - 実インスタンスを生成

### メソッド

- `Expectations`
  - モックのメソッドの戻りを定義する
- `Verifications`
  - モックの呼ばれ方を検証する
  - `withCapture()`で渡された引数を検証可能
