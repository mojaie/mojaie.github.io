---
title: Ubuntu 22.04.1にアップグレードしたらSupervisorが動かなくなった
dateCreated: 2022-10-12
dateModified: 2022-10-12
tags:
  - Ubuntu
  - Supervisor
---


### 環境

- Ubuntu 22.04.1


### ログ

```shell-session
$ sudo apt install supervisor
パッケージリストを読み込んでいます... 完了
依存関係ツリーを作成しています... 完了        
状態情報を読み取っています... 完了        
提案パッケージ:
  supervisor-doc
以下のパッケージが新たにインストールされます:
  supervisor
アップグレード: 0 個、新規インストール: 1 個、削除: 0 個、保留: 0 個。
278 kB のアーカイブを取得する必要があります。
この操作後に追加で 1,684 kB のディスク容量が消費されます。
取得:1 http://ftp.hogehoge/Linux/ubuntu jammy/universe amd64 supervisor all 4.2.1-1ubuntu1 [278 kB]
278 kB を 0秒 で取得しました (2,512 kB/s)
以前に未選択のパッケージ supervisor を選択しています。
(データベースを読み込んでいます ... 現在 224057 個のファイルとディレクトリがインストールされています。)
.../supervisor_4.2.1-1ubuntu1_all.deb を展開する準備をしています ...
supervisor (4.2.1-1ubuntu1) を展開しています...
supervisor (4.2.1-1ubuntu1) を設定しています ...
ureadahead (0.100.0-21) のトリガを処理しています ...
man-db (2.10.2-1) のトリガを処理しています ...
```


```shell-session
$ supervisord
-bash: /usr/local/bin/supervisord: /usr/bin/python: 誤ったインタプリタです: そのようなファイルやディレクトリはありません
```

pythonがないらしいのでpython3のリンクを作成


```shell-session
$ sudo ln -s /usr/bin/python3 /usr/bin/python
$ supervisord
/usr/lib/python3/dist-packages/pkg_resources/__init__.py:116: PkgResourcesDeprecationWarning: 1.16.0-unknown is an invalid version and will not be supported in a future release
  warnings.warn(
/usr/lib/python3/dist-packages/pkg_resources/__init__.py:116: PkgResourcesDeprecationWarning: 0.1.43ubuntu1 is an invalid version and will not be supported in a future release
  warnings.warn(
/usr/lib/python3/dist-packages/pkg_resources/__init__.py:116: PkgResourcesDeprecationWarning: 1.1build1 is an invalid version and will not be supported in a future release
  warnings.warn(
Traceback (most recent call last):
  File "/usr/lib/python3/dist-packages/pkg_resources/__init__.py", line 573, in _build_master
    ws.require(__requires__)
  File "/usr/lib/python3/dist-packages/pkg_resources/__init__.py", line 891, in require
    needed = self.resolve(parse_requirements(requirements))
  File "/usr/lib/python3/dist-packages/pkg_resources/__init__.py", line 782, in resolve
    raise VersionConflict(dist, req).with_context(dependent_req)
pkg_resources.VersionConflict: (supervisor 4.2.1 (/usr/lib/python3/dist-packages), Requirement.parse('supervisor==3.2.0'))

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/usr/local/bin/supervisord", line 5, in <module>
    from pkg_resources import load_entry_point
  File "/usr/lib/python3/dist-packages/pkg_resources/__init__.py", line 3267, in <module>
    def _initialize_master_working_set():
  File "/usr/lib/python3/dist-packages/pkg_resources/__init__.py", line 3241, in _call_aside
    f(*args, **kwargs)
  File "/usr/lib/python3/dist-packages/pkg_resources/__init__.py", line 3279, in _initialize_master_working_set
    working_set = WorkingSet._build_master()
  File "/usr/lib/python3/dist-packages/pkg_resources/__init__.py", line 575, in _build_master
    return cls._build_from_requirements(__requires__)
  File "/usr/lib/python3/dist-packages/pkg_resources/__init__.py", line 588, in _build_from_requirements
    dists = ws.resolve(reqs, Environment())
  File "/usr/lib/python3/dist-packages/pkg_resources/__init__.py", line 777, in resolve
    raise DistributionNotFound(req, requirers)
pkg_resources.DistributionNotFound: The 'supervisor==3.2.0' distribution was not found and is required by the application

```

なんかpkg_resourceのバージョン認識がおかしい...

仕方がないのでpython2で入れてみる

```shell-session
$ sudo rm /usr/bin/python
$ sudo ln -s /usr/bin/python2 /usr/bin/python
$ sudo apt install python-pkg-resources
$ supervisord -v
3.2.0
```


謎