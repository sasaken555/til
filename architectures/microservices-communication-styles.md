# マイクロサービスのサービス間連携

## パターン言語

[A pattern language for microservices](https://microservices.io/patterns/index.html)

![](https://i.imgur.com/Rd7Zwxp.jpg)


## 観点一覧

パターン言語に沿って観点を抽出した。

|観点|答えるべき問い|
|:--|:--|
|通信スタイル|サービス間はどのタイプのIPCメカニズムを使うか？|
|ディスカバリ|サービスのクライアントはサービスのインスタンスのIPアドレスをどうやって知るのか？|
|信頼性|サービスが利用不能になり得るという前提で、サービス間通信の信頼性をどうやって担保するか？|
|トランザクショナルメッセージング|ビジネスデータの更新とイベント・メッセージの送信をどうやってアトミックに実現するか？|
|外部API|アプリケーションのクライアントにサービスをどのように公開するか？|


## 通信スタイル

### スタイルの分類

|sync/async|Res待ち|1:1|1:N|
|:--|:--|:--|:--|
|**同期的**|あり|Req-Res|-|
|**非同期的**|あり|非同期Req-Res|Pub-非同期Res|
|**非同期的**|なし|一方通行の通知|Pub-Sub|

### 選択肢

* Remote procedure call ... 同期Req-Resのみ実現可能(非同期の一方通行通知も可能では!?)
    * スタイル
        * 同期Req-Res
    * 実装
        * REST
        * GraphQL
        * gRPC

* Messaging ... 同期/非同期どのパターンも実現可能
    * スタイル
        * 非同期Req-Res ... リクエスト/リプライチャネルを挟んだ通信
        * 一方通行の通知 ... P2Pチャネルにメッセージを投げるだけ
        * Pub-Sub
        * Pub-非同期Res
    * メッセージブローカー物理実装
        * Amazon SQS
        * Amazon SNS
        * Amazon MQ (Apache Active MQ, Rabbit MQ)
        * Amazon MSK (Apache Kafka)
        * Amazon Kinesis Data Streams
        * Amazon EventBridge
        * JMS準拠S/W

* Domain-specific protocol
    * スタイル
        * なんでも
    * 物理実装
        * 開発言語のメソッド呼び出し
        * Java RMI (Remote Method Invocation)
    * 備考
        * 呼び出し関係にある2つのコンポーネントを1つのサービスに統合する選択を採用する。


## ディスカバリ

同期的通信スタイルを使う場合は、サービスのリクエストを送る前にサービスインスタンスのIPアドレスを知っている必要がある。
サービスレジストリ(サービスとIPアドレスの紐付けDB)への問い合わせをどこで実装するのか？

### 選択肢

||Client-side|Server-side|
|:--|:--|:--|
|**Self registration**|(1-1)アプリケーションレベル|-|
|**3rd party registration**|-|(2-2)プラットフォームレベル|

物理実装(1-1) ... KubeDNS, CoreDNS, HashiCorp Consul, AWS Cloud Map
物理実装(2-2) ... Netflix Eureka, HashiCorp Consul


## 信頼性

同期的通信スタイルを使う場合は、部分的なエラーに対処するために推奨！

### 選択肢

* Timeout △
* Retry △
* Circuit breaker

△ ... 元のパターンでは言及なし


## トランザクショナルメッセージング

メッセージングベースの通信スタイルの場合、サービスの業務データ更新とメッセージの送信をアトミックにすることが望ましい。

### 選択肢

* Transactional outbox ... DBのテーブルにトランザクション内で送信するイベントを書き込む
    * (1) Polling publisher ... 自前実装
    * (2) Transaction log tailing ... Debezium, DynamoDB Streams, DBMSのトリガーオブジェクト(DBMS固有)


## 外部API

マイクロサービスで実現されるシステムと外部のシステム間の連携方法。
システムコンテキストの内外の通信をどのように扱うか？

### 選択肢

* API gateway
* Backends for frontends (BFF)


## 参考

### AWSでのアプリケーション統合

https://aws.amazon.com/jp/products/application-integration/

