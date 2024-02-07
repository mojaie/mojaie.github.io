---
title: Gitメモ
dateCreated: 2021-02-19
dateModified: 2023-08-21
tags:
  - git
  - GitHub
  - Sourcetree
---

### GitHubのプルリクエストをローカルでテストする

CLIからフェッチする。一旦フェッチするとSourcetreeからでも見ることができる。

｀git fetch origin pull/プルリクエスト番号/head:ユーザ/ブランチ｀

Checking out pull requests locally  
https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/checking-out-pull-requests-locally


### Gitの基本コマンド

ブランチしない場合はこれだけ  
Source Treeを使う場合はstagingに関するコマンドなどはあまり考えなくても大丈夫

- commit
- push
- fetch
- merge
- pull (fetch -> marge)


### 他のブランチの変更を現在のブランチに適用

- Remoteにブランチをまだpushしてない場合
  - rebase
  - mergeでいいけどrebaseの方がコミットグラフは綺麗になる
- 既にpushしている場合
  - merge
    - mergeしても引き続きどちらのブランチも平行して開発できる
    - rebaseはブランチの履歴が変わるのでpush後は厳禁
  - マージしたブランチを削除する場合はrebase->リモートブランチ削除でもいい


### コミットを取り消す

- Remoteにコミットをまだpushしてない場合
  - コミットを取り消して作業コピーに戻す(stagingした状態に戻す)
    - git reset
  - コミットを取り消してその内容も全て破棄
    - git reset --hard
  - 直近のコミットを修正して再コミットする場合
    - git commit -amend
  - merge(pull), rebaseを取り消す
    - git reflogで履歴を確認
    - git reset --hard 戻りたいコミット
- 既にpushしている場合
  - pushした履歴は取り消せないのでamendは厳禁
  - 変更を元に戻す新しいコミットを作成する
    - git revert
  - ローカルとリモート両方の履歴ごと消す
    - 共同作業者がいる場合は厳禁
    - git reflog、reset --hardでローカルの履歴を戻し、push --force


### ブランチ切り替え

- コミットしていない変更がある場合、ブランチは切り替えられない
  - まだコミットしていない変更を破棄(作業コピーを破棄してreset)
    - git reset --hard
  - ブランチ切り替えの前にコミットしてない変更を一時退避
    - git stash


### ブランチの変更内容をまとめてマージ

対話的rebaseもしくはmergeでsquash


### push to deploy

古いバージョンではリモートをnon-bareで作成(git 1.8.3.1で確認)  
- リモートでgit config --add receive.denyCurrentBranch ignore
- hooks/post-receiveを作成
  - git hookのカレントディレクトリは.gitなので、上の階層(Working dir)に移動してからgit reset

```
#!/bin/sh
cd ..
git --git-dir=.git reset --hard HEAD
```

git 2.3以降の場合は  
- git config --add receive.denyCurrentBranch updateInstead
- これでHEADが一致した状態でのpushしか受け付けないし、作業コピーも更新してくれるっぽい

どちらにせよ複数人で一つのリポジトリにdeployするのは良くないし、作業用リポジトリ>テスト用リポジトリ-デプロイ用リポジトリのような形にすべき


### assume-unchangedとskip-worktree

- git update-index --assume-unchanged ほげほげ
  - そのファイルは未更新とする（作業コピーがmergeで上書きされ、reset --hardで消される）
- git update-index --skip-worktree ほげほげ
  - そのファイルのローカルでの更新を（mergeやreset --hardの後も作業コピーが残る）
- git update-index --no-assume-unchanged
- git update-index --no-skip-worktree
