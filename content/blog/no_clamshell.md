---
title: macOSでクラムシェルモードを無効化する
dateCreated: 2021-04-30
dateModified: 2021-04-30
tags:
  - macOS
---

ディスプレイを接続している状態でMacBookを閉じると本体がスリープにならないいわゆるクラムシェルモード(clamshell mode)になります。外付けキーボードを接続して作業する場合などは便利なのですが、そうでない場合はMacBookを閉じてもスリープにならないので不便です。


### 環境

- MacBook Pro (13-inch, 2017, Two Thunderbolt 3 ports)
- macOS Big Sur (バージョン 11.3)
- HomeBrew 3.1.4


### noclamshell

HomeBrewでnoclamshellをインストールすることで、クラムシェルモードを簡単に無効化できます。

pirj/noclamshell
https://github.com/pirj/noclamshell

```shell
brew install pirj/homebrew-noclamshell/noclamshell
brew services start noclamshell
```

リッドを閉じている状態かどうかを2秒おきに確認して、閉じていてかつディスプレイが接続されていればスリープにするというとても単純な仕組みのようです。すごい。