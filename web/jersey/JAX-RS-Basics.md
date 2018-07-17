# JerseyでJAX-RSの基本

## JAX-RS

- 基本はREST Webアプリのアーキテクチャを組むためのAPI集。
  - JavaEE(JakartaEE)の仕様にも入っている。
  - 2018-07-18時点で最新はJavaEE 8のJAX-RS 2.1

- データのハンドリングやセキュリティの仕組みはまた別
  - データ ... JPA(Hibernate)
  - セキュリティ ... JWT
  - etc...

- 参照実装は`Jersey`
  - GlassFishに最初から入っているよ
  - 他にも `WAS`, `WebLogic`, `Apache CXF` とかがある

## Jersey

- JavaEEに入っているJAX-RSだけでなく、便利なライブラリ,モジュール,実装(ラップされたクラスとか)が入っている
- 使いたいライブラやモジュールがあれば適宜Maven/Gradleから入れる

## Jerseyで REST API を作る

### 所感

- 基本はMavenから作った方が雛形を自動生成できるから楽。
- Gradleは一から作らないといけないからしんどいが、依存関係は`build.gradle`が見やすいおかげで間違えにくいかも。

### How To

1. EclipseのRemote Catalogに以下のパラメータを追加

> `http://repo1.maven.org/maven2/archetype-catalog.xml`  
> 参考: [Eclipse java - How do I include Jersey archetype in Maven?](https://stackoverflow.com/questions/46646253/eclipse-java-how-do-i-include-jersey-archetype-in-maven)

2. 新しいプロジェクトの作成時にRemoteCatalogから雛形を選んで作成

> org.glassfish.jersey.archetypes > jersey-quickstart-webapp

3. あとは好きなように作れ。依存関係だけ忘れずに。

> 作ってみた: https://github.com/sasaken555/jersey-ponz-article