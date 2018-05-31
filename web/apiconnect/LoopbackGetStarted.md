# LoopBack Tutorial @API Connect

* IBM Cloud上でAPI Connectを触る話。
* [チュートリアルのリンク](https://www.ibm.com/support/knowledgecenter/ja/SSFS6T/com.ibm.apic.toolkit.doc/tutorial_cli_project_working.html)

## ワークフロー

## 事前準備

* Node.jsとnpmを入れておく
  * 推奨バージョンがv4 or v6なのはちょっと古いかも...

* ツールキットの用意
  * `npm install -g apiconnect` でOK
  * インストール中に node-gypのエラーが出ても最終的に完了して入れば無視してOK。python2を使ってないときに多く出る印象。

## API作成と公開

* Loopbackプロジェクトの作成
  * `apic loopback`であとは名前を入れるだけで依存モジュールを入れるところまで完了
  * とりあえず新規で作る場合はアプリケーション種類の選択で `empty-server` を選んでおけばおk

* モデルとデータソースの作成
  * コマンドライン or API Designer

  * 以下はコマンドラインのやり方。*[TODO]* API Designerでの作成方法
  * データソースは `apic create --type datasource`
    * インメモリ, 各種RDBMS, 様々なNoSQLDBを選べるぞ
    * Db2, Cloudant, MongoDB, Cassandra, MySQL, Kafka, etc...

  * モデルはは `apic create --type model`
    * 組み込みモデル or カスタムだが、大抵はカスタムの`PersistedModel`
    * プロパティの名前, データ型, 必須, デフォルト値を入れれば完成!
    * REST APIを選択すれば勝手にAPIが完成できる...
    * *[TODO]* リレーションの貼り方やJOINのやり方

* Loopbackプロジェクトのテスト
  * コマンドライン or API Designer
  * `apic start`でサーバースタート / `apic edit`でAPI Designerを開いて起動すればエンドポイントにアクセス可能

* プロジェクトのステージング&公開
  * コマンドライン or API Designer
  * ポリシーは「DataPower Gateway ポリシー (DataPower Gateway policies)」を選ぶ
    * 「Micro Gateway ポリシー (Micro Gateway policies)」から変えておくこと...違いなんぞ?
  * API Designerでボタン押していくのが楽