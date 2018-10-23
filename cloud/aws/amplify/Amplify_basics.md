# AWS Amplify チュートリアル実施メモ

## About

- クラウド開発向けのモバイル/ウェブアプリ作成 Javascript ライブラリ
- 公式: [AWS Amplify](https://aws-amplify.github.io/)

- サポート対象はモバイル orWeb
  - iOS
  - Android
  - Web
- フレームワークサポートが充実

  - React/ReactNative
  - Angular/Ionic
  - Vue.js

## 開発の流れ

- 基本は `amplify add xxx` --> `amplify publish/push` で作成とデプロイを繰り返す

  - CloudFormation でスタックをまとめているらしい。
  - `amplify publish`をキックするたびにスタックの更新をかける

- `create-react-app` からほんの 1 時間でチュートリアルできちゃうのは素敵!

## Features

- Hosting: S3 & CloudFront

  - HTTPS もできる(PROD のみ)

- Auth: Cognito

  - 認証画面も事前に用意されてる.
  - デフォルトで追加すると、名前, アドレス, パスワード, パスコードで認証させる設定.
  - OpenID Connect を使う方法: [Authentication with AWS Amplify and Android: 3rd Party OIDC Providers](https://itnext.io/authentication-with-aws-amplify-and-andro-3rd-party-oidc-providers-df4beaf4110d)

- Storage: S3 or DynamoDB

- API: GraphQL@AppSync, REST@API Gateway & Lambda

  - GraphQL のスキーマと CRUD メソッドは自動生成してくれる
  - API 認証も IAM, Cognito, API Key から選べる
  - Lambda はローカルでテストもできる！
  - CRUD のハンドラーコードと DDB がセットで作成される
  - Lambda は Expressjs の Serverless ライブラリを使っているようだ --> [awslabs/aws-serverless-express](https://github.com/awslabs/aws-serverless-express)

- Analytics: Pinpoint
  - どれくらいサイトを訪れたかを計測できたりする
