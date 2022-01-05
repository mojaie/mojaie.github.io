---
title: MacOSでVirturalBox+vagrantでDocker環境
dateCreated: 2021-12-28
dateModified: 2021-12-28
tags:
  - Docker
  - environment setup
  - MacOS
---

### 環境

- MacOS 11.6.1
  - HomeBrew 3.3.8
  - VirtualBox 6.1.30
  - Vagrant 2.2.19


### VirturalBox, vagrantインストール

```shell-session
$ brew install --cask virtualbox vagrant vagrant-manager
```

途中で止まるので、システム環境設定->セキュリティとプライバシーからOracle America, Inc.を許可する。

VirtualBoxの有効化に一旦システム再起動が必要。再起動しないと以下のようにBooting VMで止まる。

```
==> default: Booting VM...
There was an error while executing `VBoxManage`, a CLI used by Vagrant
for controlling VirtualBox. The command and stderr is shown below.

Command: ["startvm", "dfba51e9-b76e-45bc-95d5-317f9f66156e", "--type", "headless"]

Stderr: VBoxManage: error: The virtual machine 'vm-singularity-ce_default_1639961910582_55602' has terminated unexpectedly during startup with exit code 1 (0x1)
VBoxManage: error: Details: code NS_ERROR_FAILURE (0x80004005), component MachineWrap, interface IMachine
```

### Docker, Docker-composeのインストール

VM用フォルダを作成して移動

```shell-session
$ mkdir vm-ubuntu
$ cd vm-ubuntu
$ vagrant init
```

vm-ubuntuフォルダ内にVagrantfileが作成される。テンプレートのコメントを参考に以下記述を追記。

```
  # Ubuntu 20.04.3 LTS
  config.vm.box = "ubuntu/focal64"

  # ポート転送が必要であれば
  config.vm.network "forwarded_port", guest: 5432, host: 5432
  config.vm.network "forwarded_port", guest: 3000, host: 3000

  # DockerとDocker-composeのインストール
  config.vm.provision "docker"
  config.vm.provision "shell", inline: <<-SHELL
    apt update
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -L https://github.com/docker/compose/releases/download/v2.2.2/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
  SHELL
```

参考: Compose V2 and the new docker compose
https://docs.docker.com/compose/cli-command/#install-on-linux


vagrant起動。Ubuntuのダウンロード容量が数GBあるので注意。

```
vagrant up
```

仮想環境に接続して、インストールできていることを確認。

```shell-session
$ vagrant ssh
vagrant@ubuntu-focal:~$ docker --version
Docker version 20.10.12, build e91ed57
vagrant@ubuntu-focal:~$ docker compose version
Docker Compose version v2.2.2
$ vagrant logout
```

インストールし直す場合は一旦vagrant destroy、rm Vagrantfileしてから再度vagrant init

```shell-session
$ vagrant destroy
$ rm Vagrantfile
```

その他vagrantのコマンド  
- vagrant reload: 既にVMが動いている時に、変更したVagrantfileを反映させる。provisionからやり直したい場合は `--provision`をつける
- vagrant suspend: VMを一時停止する。upで再開
- vagrant halt: VMをgracefully shutdownする


### 問題

- ローカル->Vagrant->Dockerと2段階になるのでボリュームマウントなど権限まわりがつらい。PostgreSQLなど権限が面倒なものは厄介(postgresユーザをuid=999で決め打ち、初期化の際にpgdataの複雑な権限変更が必要)。