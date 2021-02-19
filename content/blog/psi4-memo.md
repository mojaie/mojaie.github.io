---
title: PSI4メモ
dateCreated: 2021-02-19
dateModified: 2021-02-19
tags:
  - PSI4
  - environment setup
---


2016年ごろの情報なので注意。TODO: 情報の更新


### インストール

```
cd /Users/smatsuoka/Workspace
git clone --recursive https://github.com/psi4/psi4.git
mv psi4 psi4source
cd psi4source

./setup --accelerate -D ENABLE_CHEMPS2=OFF -D BUILD_CUSTOM_BOOST=TRUE --prefix /Users/smatsuoka/Workspace/psi4 build
```

- MacのBLAS/LAPACK用Accelerate.Frameworkを使うので --accelerate
- ENABLE_CHEMPS2=OFFしないとビルドできない
- Boost v1.60非対応なのでBUILD_CUSTOM_BOOST=TRUEして古いバージョンをビルド

```
cd build
make -j`getconf _NPROCESSORS_ONLN`
make install
```


### コンフォメーションは？

Tinker検討  
http://dasher.wustl.edu/tinker/


### for Ubuntu

```
sudo apt-get install psi4  # ただしバージョンはbeta5
```


### cmake

```
sudo apt-get install cmake  # デフォルトでcmakeが入ってないしapt-getだとバージョンが低い
cd ~/
wget https://cmake.org/files/v3.5/cmake-3.5.2.tar.gz
tar xvf cmake-3.5.2.tar.gz
cd cmake-3.5.2
./configure
make
sudo make install
which cmake  # -> /usr/local/bin/cmake
```


### BLAS/LAPACK

```
sudo apt-get install libopenblas-base  # プリインストールのBLASは遅いのでOpenBLASを入れる
sudo update-alternatives --config libblas.so.3  # どのBLASを使っているか確認
sudo apt-get install liblapack-dev  # LAPACKの性能はBLASほどcriticalではないらしい
```

- openblasはどうも対応してないっぽい(バグ？)
- ATLASならシングルコアだけどbuiltin-BLASのマルチコアくらいの速度出る（６倍）
- sudo apt-get install atlasに必要なもの
- ATLASはpsi4セットアップ時に自動認識される


### PSI4

```
git clone --recursive https://github.com/psi4/psi4.git

./setup -D ENABLE_CHEMPS2=OFF -D BUILD_CUSTOM_BOOST=TRUE --pcmsolver on --fc gfortran --prefix /opt/psi4
```

- PCMSolverは後から入れられないのでここで入れる
- gfortranの指定も必要

```
cd objdir
sudo make -j`getconf _NPROCESSORS_ONLN`
sudo make install

sudo apt-get install python-numpy  # 必須
```


### bash_profile設定

```
export PSIPATH=/opt/psi4
export PATH=$PSIPATH/bin:$PATH
export PSIDATADIR=$PSIPATH/share/psi4  # shareフォルダの場所
export PSI_SCRATCH=~/psi4ws/tmp  # 作業ディレクトリ 書き込み権限がある場所
```


### VMD(Macクライアント)

- 公式サイトからdmgを落としてアプリケーションフォルダに突っ込む
- imagemagick必須? (Montage使わなければ不要？)

```
brew install imagemagick
```
