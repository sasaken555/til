# Configuration

[CKAD Exam Prep - Configuration](https://github.com/dgkanatsios/CKAD-exercises/blob/master/d.configuration.md)から。

## ConfigMaps

Create a configmap named config with values foo=lala,foo2=lolo

```bash
# --save-configとすることで kubectl apply で変更検知可能
k create cm --save-config ckad-config \
  --from-literal=foo=lala \
  --from-literal=foo2=lolo
```

Create and display a configmap from a file

```bash
k craete cm --save-config ckad-config-txt --from-file=path/to/file
```

Create a configMap called 'options' with the value var5=val5. Create a new nginx pod that loads the value from variable 'var5' in an env variable called 'option'

```bash
# ConfigMapをCLIで作成
k create cm options --save-config --from-literal=var5=val5

# スピーディーに実施するためにYAMLの雛形を先に作る
k run nginx --image=nginx:latest --restart=Never --env=option=var5 --dry-run=client -o yaml > nginx-pod.yaml

# 雛形YAMLの環境変数参照をConfigMapに切替
# 個別にキー指定する場合は containers[].env[].valueFrom.configMapKeyRef
# ConfigMapを丸ごと指定する場合は containers[].envFrom[].valueFrom.configMapKeyRef

# 編集したYAMLを適用 (dry-runを事前にやるとYAMLの文法誤りを検出できる)
k apply -f nginx-pod.yaml --dry-run
k apply -f nginx-pod.yaml
```

## SecurityContext

## Requests and limits

Create an nginx pod with requests cpu=100m,memory=256Mi and limits cpu=200m,memory=512Mi

```bash
k run nginx-limitted --image=nginx --restart=Never --requests='cpu=100m,memory=256Mi' --limits='cpu=200m,memory=512Mi'
```

## Secrets

Create a secret called mysecret with the values password=mypass

```bash
k create secret generic mysecret --from-literal=password=mypass
```

Create a secret called mysecret2 that gets key/value from a file

```bash
echo -n admin > username
k create secret generic mysecret2 --from-file=username
```

Create an nginx pod that mounts the secret mysecret2 in a volume on path /etc/foo

```bash
# 雛形生成

# PodのVolumes定義
# po.spec.volumes[].secret.secretName にSecretを指定

# Volumeをマウント
# po.spec.containers[].volumeMounts[] にVolume名(name)とマウント先(mountPath:)を指定する
```

Delete the pod you just created and mount the variable 'username' from secret mysecret2 onto a new nginx pod in env variable called 'USERNAME'

```bash
# 削除
k delete po nginx-secure

# 雛形YAML生成

# 環境変数にsecretの値を格納
# po.spec.containers[].env[].valueFrom.secretKeyRefに Secret名(name)と値を取るキー名(key)を指定する
```

## ServiceAccounts

See all the service accounts of the cluster in all namespaces

```bash
k get sa -A
```

Create a new serviceaccount called 'myuser'

```bash
k create sa myuser
```

Create an nginx pod that uses 'myuser' as a service account

```bash
k run nginx-sa --image=nginx --restartNever=Never --serviceaccount='myuser'
```
