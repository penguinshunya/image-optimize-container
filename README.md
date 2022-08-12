# Image Optimize Container

imgix に似たサービスを、Docker コンテナとして気軽に立ち上げられます。

このリポジトリをクローンして `gcloud run deploy` を実行するだけで、Cloud Run としてデプロイできます。  
しかし、初回のみ Cloud Run コンテナの起動に失敗します。  
Google Cloud コンソールから `GCS_BUCKET_NAME` 環境変数を設定して再度デプロイすると成功します。

テストは `yarn test` で実行することができます。
