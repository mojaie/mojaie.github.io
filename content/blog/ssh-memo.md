---
title: SSHメモ
dateCreated: 2020-07-10
dateModified: 2020-07-10
tags:
  - SSH
  - environment setup
---

### 前提

- サーバ: Ubuntu 16.04
- クライアント: MacOS 10.15.5


### SSHキーの作成

毎回パスワードでログインも可能だが、SSHキーを生成しておいた方が楽かつ安全。

```shell-session
$ ssh-keygen -t rsa -b 4096 -C "comment"
```

- -t オプション: 暗号化アルゴリズム(RSA)
- -b オプション: バイト数。長いほど安全
- -C オプション: コメント

ホームディレクトリの.sshにid\_rsaファイル(秘密鍵)とid\_rsa.pub(公開鍵)が生成されている。


### エージェント登録

```shell-session
$ eval "$(ssh-agent -s)"
$ cd .ssh
$ touch config
$ vi config
```

configファイルを新規作成して、下記を記載

```
Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_rsa
```

```shell-session
$ ssh-add -K ~/.ssh/id_rsa
```

エージェントに秘密鍵が登録され、自動的にログインで使用される。


### 公開鍵のアップロード

```shell-session
$ ssh-copy-id username@hostname
```

パスワードを要求される。無事アップロードされれば、次回からパスワード無しでsshコマンドでログインできる。

```shell-session
$ ssh username@hostname
```
