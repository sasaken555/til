AWS Batch メモ

- コンピューティング環境
  - IAMロール
    - サービスロール
    - インスタンスロール
  - プロビジョニングモデル
    - オンデマンド
    - スポット
  - インスタンスタイプ
    - デフォルトはOptimal(M4,C4,R3から最適なものを使用する)
  - CPU
    - 最小/最大を指定する
  - ネットワーキング
    - VPC
    - サブネット
    - セキュリティグループ
- ジョブキュー
  - 1キューに対して複数のコンピューティング環境を接続できる...
  - 複数のコンピューティング環境に接続されている場合は設定した順序でジョブが実行されるようだ
