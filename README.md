# todo-with-chat

チャットアプリと連携した TODO アプリ

### 環境構築

`.env.sample`を参考に`.env`を作成してください。

### コンテナ

基本的に環境構築周りのコマンドは Makefile でまとめてあります

- `make build-local` でローカル環境でビルド
- `make up` でコンテナを立ち上げる
- `make logs` でコンテナのログを表示、Ctrl + C で終了
- `make down` でコンテナを落とす
- `make migrate` でマイグレーションを実行
- `make help` その他のコマンドはこちらで確認できます

フロントエンドに関するコマンドは以下の通りです。

- `make front-start` で react のサーバーを立ち上げる (1 つのターミナルが占有されます)
- `make front-exec` でフロントエンドコンテナのシェルに入る
- `make front-install` で react の npm パッケージをインストールする

### バックエンド

#### ホットリロード

`make up`でコンテナを立ち上げると`air`と呼ばれるホットリロード環境が立ち上がります。なのでソースコードに変更を加えてもビルドし直す必要はありません。立ち上げている間は`/tmp`内にコンパイル済みのバイナリが生成されています。`.gitignore`には追加しているので問題はないはずですが、もし git 上で競合が起きた場合は`tmp`ファイルを削除してください。

#### データベース

データベースは MySQL を使用します。`compose.yml`の記述によって、コンテナが立ち上がると同時にテーブルとテストデータが作成されます。環境をリセットしたい場合は`make down`でコンテナを落としてください。
また必要に応じて、マイグレーションツールとして sqldef を使用できます。sqldef は go install でインストールできます。

```bash
$ go install github.com/k0kubun/sqldef/cmd/mysqldef@latest
```

go 言語のパスが通っていない場合は、`go env`で`GOPATH`を確認してください。
参考: https://zenn.dev/awonosuke/articles/47336619a4f039

### フロントエンド

TypeScript + React で実装します。
React のプロジェクトは create-react-app を使用して作成しました。

コンテナを立ち上げただけでは React のサーバーは立ち上がらないので、`make front-start` を実行して React App をスタートさせてください。立ち上げ後、ブラウザで `localhost:3000` にアクセスするとアプリケーションの動作を確認することができます。

他のメンバーがパッケージを追加インストールした後など、ローカルに不足するパッケージが存在してエラーが発生する場合には、`make front-install` を実行してください。
