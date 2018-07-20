# Maven @Eclipse

- Maven
  - ビルドツール
    - 設定ファイル(pom.xml)に記述した依存関係を解決
  - Eclipseには最初から使えるようになっている
  - ローカルで使用するにはHomebrew等で入れる必要あり

- Git + Maven
  - Gitでソースを管理するときはMavenで入れたライブラリをGit管理から外したい
    - 管理せずとも`pom.xml`で同じものを入れられるから
    - そもそも全部入れると重い
  - GitHub等リモートリポジトリからクローンした直後はMavenプロジェクトと判別されない
    - 右クリック -> Configure -> Convert to Maven project で依存関係は全部入れられる
