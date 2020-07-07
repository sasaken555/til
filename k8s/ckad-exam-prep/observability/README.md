# Observability

[CKAD Exam Prep - Configuration](https://github.com/dgkanatsios/CKAD-exercises/blob/master/e.observability.md) から。

## Probes

* Pod内のコンテナの正常性を確認する診断処理のこと。
* 3種類のProbeが存在するが、全て指定の時間間隔で診断処理が実行される。

### Liveness Probe

* Pod内のコンテナが正常に稼働していることを診断する。(起動しているが)
* 規定回数処理に失敗した場合、稼働してないと見なしてコンテナを再起動。
* コンテナを落とした時の挙動は `restartPolicy` に依存する。

### Readiness Probe

* Pod内のコンテナが正常に処理を受付可能であることを診断する。
* 規定回数処理に失敗した場合、該当Podをリクエストを流す対象から外す。
* 再度規定回数分の処理に成功した場合、リクエストを流す?

### Startup Probe

* Pod内のコンテナが正常に起動したことを診断する。
* 起動が遅く、Liveness Probeのチェック処理で落としたくない(一般的にレガシーな)アプリで有用。
* Startup Probeが設定されている場合は、このProbeの処理完了後にLiveness Probe/Readiness Probeが走る。
* まだ alpha ステータスなので、機能が大幅に変更になる可能性がある。

## 参考

* [コンテナのProbe](https://kubernetes.io/ja/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)
* [タスク / Podとコンテナの設定 / Liveness Probe、Readiness ProbeおよびStartup Probeを使用する](https://kubernetes.io/ja/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
