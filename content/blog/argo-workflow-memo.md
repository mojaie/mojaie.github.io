---
title: Argoの環境構築(MacOS)
dateCreated: 2020-05-19
dateModified: 2020-06-09
tags:
  - Argo
  - Docker
  - Kubernetes
  - environment setup
  - macOS
---

### Dockerのインストール

Docker desktopをインストールしてデーモンを起動しておきます。


### Minikubeのインストール

(2020.06.05追記) Docker desktopにkubernetesが含まれるので、minikubeをインストールしなくても、Docker desktopのPreferences->Kubernetes->Enable Kubernetesにチェックを入れるとkubernetesが使えます。その場合、以下スキップして「Argoのインストール」に進みます。

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
$ kubectl create rolebinding default-admin --clusterrole=admin --serviceaccount=argo:default -n argo
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
$ argo submit -n argo hello-world.yaml
```

あるいはWeb上のリソースから直接submitできます。
```shell-session
$ argo submit -n argo https://raw.githubusercontent.com/argoproj/argo/master/examples/hello-world.yaml
```


実施中のジョブ一覧を確認

```shell-session
$ argo list -n argo
NAME                STATUS      AGE   DURATION   PRIORITY
hello-world-wzvfd   Succeeded   38s   8s         0
```

実施中のジョブの状態を確認

```shell-session
$ argo get -n argo hello-world-wzvfd
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
$ argo logs -n argo hello-world-wzvfd 
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
$ argo delete -n argo hello-world-wzvfd
Workflow 'hello-world-wzvfd' deleted
```


Webで管理

```shell-session
$ argo -n argo server
```


<!--
docker run --rm mainwfjl:local julia src/test.jl
docker ps
docker images
docker build -t mainwfjl:local .
kubectl describe pod hello-world-kgxxb

docker system prune -all
docker volumes prune
-->


### Minioのインストール


(2020.06.09時点)公式チュートリアルの最新版がまだサイトに反映されていません。以下PR参照  
https://github.com/argoproj/argo/pull/3099/files

ワークフローの各ステップの結果を一時的に保存するために、S3互換のオブジェクトストレージが必要です。マニュアルに従ってhelmからMinioをインストールします。

```shell-session
$ brew install helm
$ helm repo add stable https://kubernetes-charts.storage.googleapis.com/
$ helm repo update
$ helm install argo-artifacts stable/minio \
  -n argo \
  --set service.type=LoadBalancer \
  --set defaultBucket.enabled=true \
  --set defaultBucket.name=my-bucket \
  --set persistence.enabled=false \
  --set fullnameOverride=argo-artifacts \

  NAME: argo-artifacts
  LAST DEPLOYED: Tue Jun  9 11:58:41 2020
  NAMESPACE: argo
  STATUS: deployed
  REVISION: 1
  TEST SUITE: None
  NOTES:
  Minio can be accessed via port 9000 on an external IP address. Get the service external IP address by:
  kubectl get svc --namespace argo -l app=argo-artifacts

  Note that the public IP may take a couple of minutes to be available.

  You can now access Minio server on http://<External-IP>:9000. Follow the below steps to connect to Minio server with mc client:

    1. Download the Minio mc client - https://docs.minio.io/docs/minio-client-quickstart-guide

    2. mc config host add argo-artifacts-local http://<External-IP>:9000 AKIAIOSFODNN7EXAMPLE wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY S3v4

    3. mc ls argo-artifacts-local

  Alternately, you can use your browser or the Minio SDK to access the server - https://docs.minio.io/categories/17

```

argo-artifactのサービスのIPとPORTを確認します。

```shell-session
$ kubectl get service argo-artifacts -o wide -n argo
NAME             TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
argo-artifacts   LoadBalancer   10.105.220.48   localhost     9000:32283/TCP   94s
```

minioのWebインターフェースにアクセスすると、デフォルトバケット(my-bucket)が作成されています。

argo/workflow-controller-configmapを編集します。公式チュートリアルの記述に従い、configmapに以下を追記します。


```
data:
  artifactRepository: |
    s3:
      bucket: my-bucket
      endpoint: argo-artifacts:9000
      insecure: true
      # accessKeySecret and secretKeySecret are secret selectors.
      # It references the k8s secret named 'argo-artifacts'
      # which was created during the minio helm install. The keys,
      # 'accesskey' and 'secretkey', inside that secret are where the
      # actual minio credentials are stored.
      accessKeySecret:
        name: argo-artifacts
        key: accesskey
      secretKeySecret:
        name: argo-artifacts
        key: secretkey
```

あるいは、上記を追記したconfigmapのyamlファイルを作っておいてapplyします。その場合、元のconfigmapに記載されているオブジェクト固有情報のフィールド(`creationTimestamp`, `resourceVersion`, `uid`)は消しておきます。

```shell-session
kubectl apply -n argo -f workflow-controller-configmap.yaml
```


チュートリアルのartifact-passing.yamlを実行します。

```shell-session
$ argo submit -n argo https://raw.githubusercontent.com/argoproj/argo/master/examples/artifact-passing.yaml

Name:                artifact-passing-58v85
Namespace:           argo
ServiceAccount:      default
Status:              Pending
Created:             Tue Jun 09 20:37:56 +0900 (now)

$ argo get -n argo artifact-passing-58v85
Name:                artifact-passing-58v85
Namespace:           argo
ServiceAccount:      default
Status:              Succeeded
Conditions:          
 Completed           True
Created:             Tue Jun 09 20:37:56 +0900 (23 seconds ago)
Started:             Tue Jun 09 20:37:56 +0900 (23 seconds ago)
Finished:            Tue Jun 09 20:38:14 +0900 (5 seconds ago)
Duration:            18 seconds

STEP                       TEMPLATE          PODNAME                            DURATION  MESSAGE
 ✔ artifact-passing-58v85  artifact-example                                                 
 ├---✔ generate-artifact   whalesay          artifact-passing-58v85-1826744750  7s          
 └---✔ consume-artifact    print-message     artifact-passing-58v85-2028663838  8s   
```
