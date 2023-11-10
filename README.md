# todo-with-chat

チャットアプリと連携した TODO アプリ

#### コンテナ

基本的に環境構築周りのコマンドは Makefile でまとめてあります

- `make build-local` でローカル環境でビルド
- `make up` でコンテナを立ち上げる
- `make logs` でコンテナのログを表示、Ctrl + C で終了
- `make down` でコンテナを落とす
- `make help` その他のコマンドはこちらで確認できます

### バックエンド

go 言語を用いて実装しています。`make up`でコンテナを立ち上げると`air`と呼ばれるホットリロード環境が立ち上がります。なのでソースコードに変更を加えてもビルドし直す必要はありません。立ち上げている間は`/tmp`内にコンパイル済みのバイナリが生成されています。`.gitignore`には追加しているので問題はないはずですが、もし git 上で競合が起きた場合は`tmp`ファイルを削除してください。
