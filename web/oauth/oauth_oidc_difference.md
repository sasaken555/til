# OAuth/OpenID Connectの違いを理解する本

## 読む本

OAuth、OAuth認証、OpenID Connectの違いを整理して理解できる本
https://booth.pm/ja/items/1550861

## この本の目標

以下の質問を明確に説明できることを目指す。

* OAuth, OAuth認証, OpenID Connect(OIDC)とはそれぞれ何か？
* OAuthは認可のプロトコルなのに "OAuth認証" という言葉が使われる理由は？
* OAuth認証とOIDCの違いは？

## 目次

1. OAuthの復習
    1. 一体何者か？
    2. 各用語の説明

2. OAuth認証
    1. OAuthが認証に使える仕組み
    2. 素のOAuthを認証に使用する問題点
    3. OAuth認証事例: Facebook

3. OpenID Connect
    1. OIDCとは何者か？
    2. OAuthとの違い
    3. フローに沿った解説

4. チュートリアル
    1. Google OAuth2.0 APIとcurlを使ったチュートリアル

## 学んだこと

### OAuth, OAuth認証, OpenID Connect(OIDC)とは

* OAuth2.0
  * 認可(権限移譲)のフレームワークである。
    * サードパーティアプリケーション(クライアント)に、HTTPサービスへの限定的なアクセスを与える一連の手順(プロトコル)のこと。
    * 認可サーバから払い出されるアクセストークンを利用してクライアントはリソースサーバに対してリソースへの操作が可能になる。
    * 認証については方法は問わない。

* OAuth認証
  * OAuthのプロトコルを認証に応用した認証方法
    * OAuth認証 = OAuth + プロフィールAPI(お前誰やねんを取得するAPI)

* OpenID Connect
  * OAuthに認証レイヤーを追加したプロトコルである。
    * IDプロバイダが提供するアカウントでサードパーティアプリケーション(リライング・パーティー)にログインできる。
    * IDプロバイダと認可サーバは同一でも良い。

### OAuthは認可のプロトコルなのに "OAuth認証" という言葉が使われる理由

* OAuthのプロトコルとプロフィールAPIを組み合わせることで、「リクエストしたのは何者か？」を識別することができるから。

* ただのOAuthのプロトコルの応用だね。

### OAuth認証とOIDCの違い

* OpenID Connectでは "アクセストークン+プロフィールAPI" の代わりに "IDトークン" を利用して認証する。

* OAuth認証とOIDCの構成の違い
  * 突き詰めれば、<u>認証にIDトークンを使うか否か</u>
    * OAuth認証 = OAuth + プロフィールAPI
    * OIDC = OAuth + IDトークン + UserInfo API

* なぜ認証にIDトークンを利用するのか？
  * OAuth認証には成り済まし認証ができる脆弱性があるから。
    * OAuth認証ではアクセストークンをすり替えを検知できないため、他人のアクセストークンさえ手に入れば認証できてしまう。

* OIDCにおけるOAuth認証の脆弱性への対応
  * IDトークンに含まれる署名された以下の値が期待値と一致することを確認してIDトークンのすり替えを検知する。
    * `sub` ... エンドユーザーの識別子
    * `iss` ... IDトークンの発行者
    * `aud` ... IDトークンの利用者 = クライアントID
    * `exp` ... 有効期限のタイムスタンプ > 現在のタイムスタンプ
    * `iat` ... 発行日時のタイムスタンプ ⊂ 許容できる範囲内
    * `nonce` ... 認証リクエスト時に渡したランダムな文字列

## 仕様原文

* OAuth2.0の仕様
  * [The OAuth 2.0 Authorization Framework](https://openid-foundation-japan.github.io/rfc6749.ja.html)

* OpenID Connectの仕様
  * [OpenID Connect | OpenID](https://openid.net/connect/)

* OpenID Connectの各言語のクライアントライブラリ
  * [Certified OpenID Connect Implementations | OpenID](https://openid.net/developers/certified/)
