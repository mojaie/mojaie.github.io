---
title: openssl ts -verifyでess signing certificate error
dateCreated: 2021-02-18
dateModified: 2021-02-18
tags:
  - macOS
  - OpenSSL
  - Trusted timestamping
  - ELN
  - eLabFTW
---


macOS Catalina 10.15.7 でeLabFTWのタイムスタンプをopensslで検証しようとしたらess signing certificate errorになってしまった。

```
openssl ts -verify -data "document.pdf" -in "document_token.asn1" -CApath "/private/etc/ssl/certs" -CAfile "/private/etc/ssl/cert.pem" -untrusted "chain.txt"
```

```
Verification: FAILED
4547518060:error:2FFFF065:time stamp routines:CRYPTO_internal:ess signing certificate error:/AppleInternal/BuildRoot/Library/Caches/com.apple.xbs/Sources/libressl/libressl-47.140.1/libressl-2.8/crypto/ts/ts_rsp_verify.c:300:
```

理由はわからないが、下記OpenSSLのissueにあるように、認証局(dfn.de)が発行しているトークンの暗号化アルゴリズムに対応していないような気がする。

Error #2F067065 - "ess signing certificate error" when validating timestamp reply  
https://github.com/openssl/openssl/issues/7062

OpenSSLのほうは対応済みとのことなので、MacデフォルトのLibreSSLからHomebrewの1.1.1g(Pythonを入れたときに付いてきた)に切り替えると問題なく動作した。