RIOT
===============

## 概要
[React.js](https://reactjs.org/)と[Firebase](https://firebase.google.com/?hl=ja)を用いたチャットアプリです。
Googleでのログイン、アカウント作成が可能になっています。

## 事前に用意するもの
- Node.js (version 8.1.1)
- yarn (version 1.7.1)

### 環境構築

#### NodebrewおよびNode.jsのインストール
[Homebrewのインストール手順](https://qiita.com/rabbit1013/items/1494cf345ff172c3b9cd)
上記サイトに則りHomebrewをインストール
```bash
$ brew install nodebrew
$ nodebrew setup
$ nodebrew install-binary v8.1.1
$ nodebrew use v8.1.1
$ echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> ~/.bash_profile
$ source ~/.bash_profile
$ node -v
8.1.1
```

#### yarnのインストール
```bash
$ npm install -g yarn
```

#### 開発に使用するパッケージのインストール
```
$ yarn install
```

#### ビルドコマンド
```
$ yarn build
```
