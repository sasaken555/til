# Pod Design

## Label and Annotations

Create 3 pods with names nginx1,nginx2,nginx3. All of them should have the label app=v1

```bash
# from CLI
kubectl run nginx1 --image=nginx --restart=Never --labels=app=v1
kubectl run nginx2 --image=nginx --restart=Never --labels=app=v1
kubectl run nginx3 --image=nginx --restart=Never --labels=app=v1

# もう少し数が多い場合は、1行目を --dry-run=client -o yaml でYAML出力して値置換したほうが早そう
```

Show all labels of the pods

```bash
kubectl get pods --show-labels
```

Change the labels of pod 'nginx2' to be app=v2

```bash
# 直接編集
kubectl edit pod nginx2

# CLIから上書き
# ラベル追加する場合は --overwrite を外す
kubectl label po nginx2 app=v2 --overwrite
```

Get the label 'app' for the pods

```bash
# -L, --label-columns=[]: Accepts a comma separated list of labels that are going to be presented as columns.
# Names are case-sensitive. You can also use multiple flag options like -L label1 -L label2...
kubectl get po -L app
```

Get only the 'app=v2' pods

```bash
kubectl get po -l app=v2
```

Remove the 'app' label from the pods we created before

```bash
# 全ポッド
kubectl label po --all app-
# appラベルがついているものだけ
kubectl label po -l app app-
```

Create a pod that will be deployed to a Node that has the label 'accelerator=nvidia-tesla-p100'

```bash

```

Annotate pods nginx1, nginx2, nginx3 with "description='my description'" value

```bash
kubectl annotate pods --all description='my description'
```

Check the annotations for pod nginx1

```bash
kubectl describe po nginx1 | grep Annotations
```

Remove the annotations for these three pods

```bash
kubectl annotate po nginx1 nginx2 nginx3 description-
```

Remove these pods to have a clean state in your cluster

```bash
kubectl delete po nginx{1..3}
```

## Deployments

Create a deployment with image nginx:1.7.8, called nginx, having 2 replicas, defining port 80 as the port that this container exposes (don't create a service for this deployment)

```bash
# k run --restart=Alwaysは非推奨なので, YAML生成からやらないといけない...
# k explain po.spec.ports
k create deploy nginx --image=nginx:1.7.8 --dry-run=client -o yaml

```

Update the nginx image to nginx:1.7.9

```bash
k set image deploy nginx nginx=nginx:1.7.9
```

Undo the latest rollout and verify that new pods have the old image (nginx:1.7.8)

```bash
k rollout undo deploy nginx
```

Check the details of the fourth revision (number 4)

```bash
k rollout history deploy nginx --revision=4
```

Scale the deployment to 5 replicas

```bash
k scale --replicas=5 deploy/nginx
```

Autoscale the deployment, pods between 5 and 10, targetting CPU utilization at 80%

```bash
k autoscale deploy nginx --min=5 --max=10 --cpu-percent=80
```

## Jobs

## CronJobs
