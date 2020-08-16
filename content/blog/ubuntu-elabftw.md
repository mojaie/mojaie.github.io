---
title: Ubuntu20.04にelabFTWサーバ構築時のメモ
dateCreated: 2020-08-15
dateModified: 2020-08-16
tags:
  - SSH
  - remote
  - Ubuntu
  - Docker
  - ELN
  - environment setup
---

### 環境

- Ubuntu 20.04.1 LTS (GNU/Linux 4.15.0-112-generic x86_64)

### Docker

Ubuntu環境にDockerをインストール

Install Docker Engine on Ubuntu
https://docs.docker.com/engine/install/ubuntu/

まず既に入っているかもしれないdockerをremove。入っていませんでした。

```shell-session
$ sudo apt remove docker docker-engine docker.io containerd runc
```

必要なパッケージをインストールします。

```shell-session
$ sudo apt update
$ sudo apt install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

既に全て最新版になっていました。
マニュアルに従ってGPGのダウンロード、確認を行います。

```shell-session
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
OK
$ sudo apt-key fingerprint 0EBFCD88
pub   rsa4096 2017-02-22 [SCEA]
      9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid           [  不明  ] Docker Release (CE deb) <docker@docker.com>
sub   rsa4096 2017-02-22 [S]
```

DockerのパッケージリポジトリをUbuntuに追加します。

```shell-session
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

Dockerをインストールします。

```shell-session
$ sudo apt update
$ sudo apt install docker-ce docker-ce-cli containerd.io
```

Hello worldコンテナが起動できることを確認します。

```shell-session
$ sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
0e03bdcc26d7: Pull complete 
Digest: sha256:7f0a9f93b4aa3022c3a4c147a449bf11e0941a1fd0bf4a8e6c9408b2600777c5
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

sudoをつけるのが面倒な場合はdockerグループに現ユーザを追加します。

```shell-session
$ sudo groupadd docker
groupadd: グループ 'docker' は既に存在します
```

dockerをインストールした時点でグループが作成されていることもあるようです。

```shell-session
$ sudo usermod -aG docker $USER
$ cat /etc/group
root:x:0:
daemon:x:1:

...

docker:x:999:user
```

グループにユーザを追加したら再起動します。Dockerがsudoなしで使用できるようになっています。

```shell-session
$ sudo reboot
$ docker run hello-world
```



### elabFTW

上述の通り、sudoなしでdocker起動できるようにしておきます。UbuntuにはSNAPというパッケージ管理システムがありますが、SNAPでインストールしたdockerは利用できないようです。上述の通り、Dockerリポジトリ経由でインストールします。

マニュアルの通り、elabFTWのインストールスクリプトをダウンロードして実行します。ただ、/usr/local/bin/を汚染したくないのでホームから直接スクリプトを起動します。

```shell-session
$ curl -sL https://get.elabftw.net -o elabctl && chmod +x elabctl
sudo ./elabctl install
      _          _     _____ _______        __
  ___| |    __ _| |__ |  ___|_   _\ \      / /
 / _ \ |   / _| | '_ \| |_    | |  \ \ /\ / / 
|  __/ |__| (_| | |_) |  _|   | |   \ V  V /  
 \___|_____\__,_|_.__/|_|     |_|    \_/\_/   
                                              

Using elabctl configuration file: using default values (no config file found)
Using elabftw configuration file: /etc/elabftw.yml
---------------------------------------------
Error: docker-compose not installed. Please install the program 'docker-compose'
```

docker-composeが必須のようです。

```shell-session
$ sudo apt install docker-compose
```

気を取り直して再度インストールを試みます。

```shell-session
$ sudo ./elabctl install
```

GUIウィザード風の画面が出てきてびびりますが、適当に回答します。

- 了解
- Looks good to me
- Server
- はい
- 自分のドメインネームを入力->了解
- Use HTTPS (下記注)
- Use self-signed
- 了解
- 了解

基本的にはウィザードの言いなりで大丈夫です(あとでどうせdocker-composeの設定ファイルをいじります)。注意が必要なのは、タイムスタンプ発行にSSLが必須なので、HTTPSを使うかどうかの選択肢は実質Use HTTPSの一択です。HTTPにするのはSSL証明書を発行している他のNginxサーバ等を介して外部に接続している場合のみです。SSL証明書はletsencrypt等で調達します。

今回はVPN経由でイントラネットでの使用なのでself-signed certificate(いわゆるオレオレ証明書)を利用します。

次に、設定ファイルを編集します。docker-composeファイルです。

```shell-session
$ sudo vi /etc/elabftw.yml
```

ほぼ書き換えるところはないですが、今回letsencryptを使わないので

```
ENABLE_LETSENCRYPT=false
```

あと、タイムゾーンを指定します。TZはmysqlの設定の方にもあります。

```
PHP_TIMEZONE=Asia/Tokyo
TZ=Asia/Tokyo
```

サーバへの接続に使用するポート(hostのほう)を設定します。他とかぶってなければなんでもいいです。コンテナ側のportは固定です。

```
ports:
        # if you want elabftw to run on a different port, change the first number
        # host:container
        - '3101:443'
```

startコマンドを実行すると、MySQLのスキーマが作成されます。続けて、サーバのDockerコンテナを起動します。

```shell-session
$ sudo ./elabctl start
$ docker exec -it elabftw bin/install start
```

設定ファイルを書き換えるなどした際は、restartすることでコンテナが最新の状態になります。
```shell-session
$ sudo ./elabctl restart
```

https:\/\/サーバ名:3101/register.phpにアクセスしてアカウントを作成します。
ChromeだとNET::ERR_CERT_INVALIDで怒られるので、ページの背景の適当なところをクリックして(ウィンドウがアクティブかつ入力カーソルが出ていない状態で)、thisisunsafeとタイプします。

thisisunsafe関連  
https://www.google.com/search?q=Chrome+thisisunsafe


### SMTP2GO

サーバからのシステムメール(パスワード変更など)を送るためのSMTPサーバの設定が必須です。postfix等で自前で作ってもいいですが、SMTP2GOなどの外部サービスを利用した方が早くて確実です。

アカウントを作って説明通りに設定、テストメールを送信してみましたが、何も返ってきません...

elabFTWのDockerコンテナにアクセスしてのNginxのログを見てみます。

```shell-session
$ docker container ls
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
47f3af8300de        mysql:5.7           "docker-entrypoint.s…"   6 hours ago         Up 6 hours          0.0.0.0:3306->3306/tcp, 33060/tcp   mysql
7dc7c65a3a51        elabftw/elabimg     "/run.sh"                6 hours ago         Up 6 hours          0.0.0.0:3101->443/tcp               elabftw

$ docker exec -it 7dc7c65a3a51 /bin/bash
bash-5.0# less /var/log/nginx/error.log
```

error.logの内容

```
2020/08/15 20:47:15 [error] 79#79: *185 FastCGI sent in stderr: "PHP messa
ge: [2020-08-15T20:47:15.644515+09:00] elabftw.ERROR:  [{"userid":"1"},{"e
xception":"[object] (Swift_TransportException(code: 503): Expected respons
e code 354 but got code \"503\", with message \"503-All RCPT commands were
 rejected with this error:\r\n503-unable to verify sender address\r\n503 V
alid RCPT command must precede DATA\r\n\" at /elabftw/vendor/swiftmailer/s
wiftmailer/lib/classes/Swift/Transport/AbstractSmtpTransport.php:457)"}] [
]" while reading response header from upstream, client: 172.31.19.57, serv
er: seedws1.ad166.riken.go.jp, request: "POST /app/controllers/SysconfigAj
axController.php HTTP/2.0", upstream: "fastcgi://unix:/var/run/php-fpm.soc
k:", host: "seedws1.ad166.riken.go.jp:3101"
```

公式のヘルプを見ると503-unable to verify sender addressは架空のメールアドレスだったのがまずかったようだ。そりゃそうか。

What Do Your Email Delivery Errors Mean?
https://www.smtp2go.com/blog/email-delivery-errors-mean/

普通に自分のアドレスにしたらテストメールを受信できました。

elabFTWの使い勝手としては(他のELNを使ったことはありませんが)、最低限の機能はありそうという感じでした。ただ、日本語環境のサポートはまだ非常に弱いです。日本語で書いたノートのPDFを生成するためには、ユーザ設定でCJKフォントを有効にする必要があります。ただ、フォント埋め込みでPDFのサイズが少なくとも10MB以上になってしまう(mPDFというPHPのPDF変換ライブラリを採用しているようですが、全てのフォントを埋め込んでしまうようです...)ので、PDF/A準拠のオプション設定を外してフォント埋め込みをやめるしかないようです。デフォルトはHTMLエディタですが、ユーザ設定でMarkdown直書きも選択できます。構造式やフリーハンド描画をWeb上で編集できるのは良いですね。
