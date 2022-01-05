---
title: Singularityインストールメモ
dateCreated: 2021-12-20
dateModified: 2021-12-20
tags:
  - Singularity
  - environment setup
  - MacOS
---

### 環境

- Ubuntu 20.04.3 LTS
- MacOS 11.6.1
  - HomeBrew 3.3.8
  - Vagrant 2.2.19
  - singularity-ce version 3.9.0


### MacにSingularityをインストール

公式  
https://sylabs.io/guides/3.9/admin-guide/installation.html#installation-on-windows-or-mac

```shell-session
$ brew install --cask virtualbox vagrant vagrant-manager
```

途中で止まるので、システム環境設定->セキュリティとプライバシーからOracle America, Inc.を許可する。


VM用フォルダを作成して移動、vagrant起動。VMのダウンロードが3GBくらいあるので注意。

```shell-session
$ mkdir vm-singularity-ce
$ cd vm-singularity-ce
$ vagrant init sylabs/singularity-ce-3.9-ubuntu-bionic64
```

VirtualBoxの有効化に一旦再起動が必要。再起動しないと以下のようにBooting VMで止まる。

```
==> default: Booting VM...
There was an error while executing `VBoxManage`, a CLI used by Vagrant
for controlling VirtualBox. The command and stderr is shown below.

Command: ["startvm", "dfba51e9-b76e-45bc-95d5-317f9f66156e", "--type", "headless"]

Stderr: VBoxManage: error: The virtual machine 'vm-singularity-ce_default_1639961910582_55602' has terminated unexpectedly during startup with exit code 1 (0x1)
VBoxManage: error: Details: code NS_ERROR_FAILURE (0x80004005), component MachineWrap, interface IMachine
```

インストールし直す場合は一旦vagrant destroy、rm Vagrantfileしてから再度vagrant init

```shell-session
$ vagrant destroy
$ rm Vagrantfile
```

仮想環境に接続して、インストールできていることを確認。

```shell-session
$ vagrant ssh
vagrant@vagrant:~$ singularity version
3.9.0
$ vagrant logout
```

その他vagrantのコマンド  
- vagrant reload: 既にVMが動いている時に、変更したVagrantfileを反映させる
- vagrant suspend: VMを一時停止する。upで再開
- vagrant halt: VMをgracefully shutdownする

デフォルトでは、プロジェクトフォルダ(上記手順のvm-singularity-ceフォルダ)が仮想環境の/vagrantフォルダ(環境によっては/home/vagrant)としてマウントされている。  

Vagrantfileのconfig.vm.synced_folderを編集してサーバ開発環境を追加でマウント、vagrant reload

```
config.vm.synced_folder "/Users/hoge/Workspace/serverenv", "/home/vagrant/serverenv"
```

singularity-composeをインストール

```
sudo apt update
sudo apt install python3-pip
pip3 install singularity-compose
export PATH=$PATH:/home/vagrant/.local/bin
singularity-compose up
```


### 未解決


- singularity-composeがまだよくわからない。singularity自体がオーケストレーション用途ではないと思うので今後どうなるかわからない。
- コンテナ同士の相互作用を考えるよりはdefファイルでいろいろまとめて一つのイメージとしてデプロイしたほうがいいかもしれない。
- Singularityは今後Sylabs社が企業向けのパッケージやSingularityCEと呼ばれるオープンソース版の開発を続け、従来のSingularityはLinuxのプロジェクトとして別系統で開発され、Apptainerという名称になるらしい...厄介...