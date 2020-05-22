---
title: Argoの環境構築
dateCreated: 2020-05-19
dateModified: 2020-05-19
tags:
  - Argo
  - Kubernetes
draft: true
---


### Minikubeのインストール

下記を参考にMinikubeをインストール  
https://kubernetes.io/ja/docs/tasks/tools/install-minikube/

```
brew update
brew install minikube
```

minikube startするとhyperkitとkubectlが自動的にインストールされる。途中でsudoコマンドのためのパスワードを要求される。

```
$ minikube start

😄  Darwin 10.15.4 上の minikube v1.10.1
✨  Automatically selected the hyperkit driver
💾  docker-machine-driver-hyperkit ドライバをダウンロードしています:
    > docker-machine-driver-hyperkit.sha256: 65 B / 65 B [---] 100.00% ? p/s 0s
    > docker-machine-driver-hyperkit: 10.90 MiB / 10.90 MiB  100.00% 29.23 KiB 
🔑  The 'hyperkit' driver requires elevated permissions. The following commands will be executed:

    $ sudo chown root:wheel ~/.minikube/bin/docker-machine-driver-hyperkit 
    $ sudo chmod u+s ~/.minikube/bin/docker-machine-driver-hyperkit 


Password:
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


### Argo

Argoのgetting started  
https://argoproj.github.io/docs/argo/getting-started.html

これもbrewで入れる。

```
brew install argoproj/tap/argo
```


smatsuoka@smatsuokambp ~ % kubectl create namespace argo
namespace/argo created
smatsuoka@smatsuokambp ~ % kubectl apply -n argo -f https://raw.githubusercontent.com/argoproj/argo/stable/manifests/install.yaml
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
