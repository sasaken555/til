# GraphQLの基礎

## Introduction

- 開発をフロントエンドに合わせる
  - バックエンド
- スキーマを先に作るスタイル
  - 開発スタイルを変える!!
- 動機
  - 大規模にスケールさせたい by facebook
- データソースを抽象化するレイヤー
  - 出自的に小規模チームでもいけるんでない?

- GraphQLだけでもいいけど...
  - クライアントライブラリの必要性とは...??
  - Apolloの意味とは
    - 代表的にはCaching
    - Reduxの置き換えすらできる

## REST APIのラッパーとしてのGraphQL

- REST API相反するものではない.
- REST APIを投げた結果のデータ構造をスキーマとして定義
- クエリ内でスキーマを組み合わせることで、欲しいデータを選択的に得ることができる
  - REST APIだけで特定のデータを得る、組み合わせる、しかもリクエストタイプ(ex.端末)によって変わるといった場合は、一番大きなデータを返すAPIを用意して、フロントで削るような形になる
  - GraphQLで必要なものだけ取ってこれるのであとはフロントでレンダリングすればいいからとてもエコ :)

## 大まかに基本の部分

### 概要

- データレイヤーとフロントレイヤーの間に入るラッパーレイヤー
  - データレイヤー
    - DB
    - REST APIもデータレイヤーとして扱える!!
      - 既にビジネスロジックを組んであるんでしょ
      - Client -- GraphQL -- REST APIs -- DB
  - フロントレイヤー
    - React
    - Angular
    - Vue.js
  - 単一エンドポイント
    - vs REST API ... リソースごとに複数エンドポイント

- クエリを投げる
  - JSONのキーだけの構造
- スキーマ
  - オブジェクト(key-value)の構造
- クエリと結果が1to1となっているためかなり直感的!

投げるクエリ

```
{
  hero {
    name
    friends {
      id
      name
    }
  }
}
```

帰ってくる結果

```json
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "id": "1000",
          "name": "Luke Skywalker"
        },
        {
          "id": "1002",
          "name": "Han Solo"
        },
        {
          "id": "1003",
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```

- 基本的には...
  - 定義したスキーマから必要なフィールドを入れる
  - 必要な別のスキーマがあれば、フィールドに埋め込む

### クエリの書き方

- 引数を渡して特定のデータを取る(引数は固定値)
- エイリアスを切ってクエリを投げた結果に名前をつける
- フラグメントで事前定義したクエリを展開
- クエリの操作タイプ=`Operation`
  - query - データの取得
  - mutation - データの作成, 更新, 削除
  - subscription
- queryの頭に変数定義することで、引数を動的に変えることも可能
  - いきなり変数を埋め込むことが出来ないのか...
  - スカラー
  - 定数(Enum)
  - オブジェクト
  - デフォルト値を埋め込むことも可能
- データの見せる/見せないを動的にハンドリングすることもできる
  - `@include`(if: Boolean) - `true`なら見せる
  - `@skip`(if: Boolean) - `true`なら見せない
- データのJOIN的なこと
  - Inline Fragments
- メタデータも扱えるよ!!

### Typeとスキーマ

- GraphQLはクエリ/スキーマ中心
  - 特定の言語に左右されない

- Object Type
  - スキーマの最小単位
  - というか大元

```
type Character {
  name: String!
  appearsIn [Episode]!
}
```

- GraphQL Object Type
  - `Character`
- field
  - `name`, `appearsIn`
- scalartypes
  - `String`
- non-nullable
  - `String!`, `[Episode]!`

GraphQLのQueryについて一通りドキュメントを読み込みました。
typeとSchemaが途中までしか読んでいないので、ここの理解をして実際にSchemaを組み立ててみます。
