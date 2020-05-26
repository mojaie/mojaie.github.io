---
title: Argoの環境構築
dateCreated: 2020-05-19
dateModified: 2020-05-26
tags:
  - Argo
  - Docker
  - Kubernetes
  - environment setup
---

### Dockerのインストール

Macの場合Docker desktopをインストールしてデーモンを起動しておきます。


### Minikubeのインストール

下記を参考にMinikubeをインストールします。HomeBrewを使うと楽です。  
https://minikube.sigs.k8s.io/docs/start/  
https://kubernetes.io/ja/docs/tasks/tools/install-minikube/

```shell-session
$ brew update
$ brew install minikube
```

minikube startするとhyperkit(Docker desktopに含まれる)のドライバとkubectlが自動的にインストールされます。

```shell-session
$ minikube start
😄  Darwin 10.15.4 上の minikube v1.10.1
✨  Automatically selected the hyperkit driver
💾  docker-machine-driver-hyperkit ドライバをダウンロードしています:
    > docker-machine-driver-hyperkit.sha256: 65 B / 65 B [---] 100.00% ? p/s 0s
    > docker-machine-driver-hyperkit: 10.90 MiB / 10.90 MiB  100.00% 29.23 KiB 
🔑  The 'hyperkit' driver requires elevated permissions. The following commands will be executed:

    $ sudo chown root:wheel /Users/username/.minikube/bin/docker-machine-driver-hyperkit 
    $ sudo chmod u+s /Users/username/.minikube/bin/docker-machine-driver-hyperkit 

Password:
```

sudoコマンドのパスワードを入力します。

```shell-session
💿  VM ブートイメージをダウンロードしています...
    > minikube-v1.10.0.iso.sha256: 65 B / 65 B [-------------] 100.00% ? p/s 0s
    > minikube-v1.10.0.iso: 174.99 MiB / 174.99 MiB [] 100.00% 8.27 MiB p/s 21s
👍  Starting control plane node minikube in cluster minikube
💾  Kubernetes v1.18.2 のダウンロードの準備をしています
    > preloaded-images-k8s-v3-v1.18.2-docker-overlay2-amd64.tar.lz4: 525.43 MiB
🔥  Creating hyperkit VM (CPUs=2, Memory=4000MB, Disk=20000MB) ...
🐳  Docker 19.03.8 で Kubernetes v1.18.2 を準備しています...
🔎  Verifying Kubernetes components...
🌟  Enabled addons: default-storageclass, storage-provisioner
🏄  Done! kubectl is now configured to use "minikube"
```

仮想環境を終了するときはminikube stop

```shell-session
$ minikube stop
```

minikubeのdocker環境を確認します。

```shell-session
$ minikube -p minikube docker-env
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.64.2:2376"
export DOCKER_CERT_PATH="/Users/username/.minikube/certs"
export MINIKUBE_ACTIVE_DOCKERD="minikube"

# To point your shell to minikube's docker-daemon, run:
# eval $(minikube -p minikube docker-env)
```

minikubeのDockerデーモンを再利用してローカルのDockerイメージを使えるようにします。
一旦設定すればDocker desktop.Appを起動しなくても`minikube start`で自動的にminikubeのDockerデーモンをターミナルから使えるようになります。

```shell-session
$ eval $(minikube -p minikube docker-env)
```

ダッシュボードを起動

```shell-session
$ minikube dashboard
```


### Argoのインストール

getting started  
https://argoproj.github.io/docs/argo/getting-started.html

これもHomeBrewで入れます。

```shell-session
$ brew install argoproj/tap/argo
```

Argoの名前空間を作成します。

```shell-session
$ kubectl create namespace argo
namespace/argo created
```

Argoをインストールします。

```shell-session
$ kubectl apply -n argo -f https://raw.githubusercontent.com/argoproj/argo/stable/manifests/install.yaml
customresourcedefinition.apiextensions.k8s.io/clusterworkflowtemplates.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/cronworkflows.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/workflows.argoproj.io created
customresourcedefinition.apiextensions.k8s.io/workflowtemplates.argoproj.io created
serviceaccount/argo created
serviceaccount/argo-server created
role.rbac.authorization.k8s.io/argo-role created
clusterrole.rbac.authorization.k8s.io/argo-aggregate-to-admin created
clusterrole.rbac.authorization.k8s.io/argo-aggregate-to-edit created
clusterrole.rbac.authorization.k8s.io/argo-aggregate-to-view created
clusterrole.rbac.authorization.k8s.io/argo-cluster-role created
clusterrole.rbac.authorization.k8s.io/argo-server-cluster-role created
rolebinding.rbac.authorization.k8s.io/argo-binding created
clusterrolebinding.rbac.authorization.k8s.io/argo-binding created
clusterrolebinding.rbac.authorization.k8s.io/argo-server-binding created
configmap/workflow-controller-configmap created
service/argo-server created
service/workflow-controller-metrics created
deployment.apps/argo-server created
deployment.apps/workflow-controller created
```

defaultネームスペースでadminを設定します。

```shell-session
$ kubectl create rolebinding default-admin --clusterrole=admin --serviceaccount=default:default
```

ArgoのexampleのページにあるworkflowのYAMLファイル例(hello-world.yaml)をカレントフォルダに置きます。

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow                  # new type of k8s spec
metadata:
  generateName: hello-world-    # name of the workflow spec
spec:
  entrypoint: whalesay          # invoke the whalesay template
  templates:
  - name: whalesay              # name of the template
    container:
      image: docker/whalesay
      command: [cowsay]
      args: ["hello world"]
      resources:                # limit the resources
        limits:
          memory: 32Mi
          cpu: 100m
```

ワークフローをサブミット

```shell-session
$ argo submit hello-world.yaml
```

実施中のジョブ一覧を確認

```shell-session
$ argo list
NAME                STATUS      AGE   DURATION   PRIORITY
hello-world-wzvfd   Succeeded   38s   8s         0
```

実施中のジョブの状態を確認

```shell-session
$ argo get hello-world-wzvfd
Name:                hello-world-wzvfd
Namespace:           default
ServiceAccount:      default
Status:              Succeeded
Conditions:          
 Completed           True
Created:             Sun May 24 23:38:07 +0900 (20 seconds ago)
Started:             Sun May 24 23:38:07 +0900 (20 seconds ago)
Finished:            Sun May 24 23:38:15 +0900 (12 seconds ago)
Duration:            8 seconds

STEP                  TEMPLATE  PODNAME            DURATION  MESSAGE
 ✔ hello-world-wzvfd  whalesay  hello-world-wzvfd  6s   
```

結果を確認

```shell-session
$ argo logs hello-world-wzvfd 
hello-world-wzvfd:  _____________ 
hello-world-wzvfd: < hello world >
hello-world-wzvfd:  ------------- 
hello-world-wzvfd:     \
hello-world-wzvfd:      \
hello-world-wzvfd:       \     
hello-world-wzvfd:                     ##        .            
hello-world-wzvfd:               ## ## ##       ==            
hello-world-wzvfd:            ## ## ## ##      ===            
hello-world-wzvfd:        /""""""""""""""""___/ ===        
hello-world-wzvfd:   ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~   
hello-world-wzvfd:        \______ o          __/            
hello-world-wzvfd:         \    \        __/             
hello-world-wzvfd:           \____\______/   
```

ジョブの削除

```shell-session
$ argo delete hello-world-wzvfd
Workflow 'hello-world-wzvfd' deleted
```


Webで管理

```shell-session
$ argo server
```
