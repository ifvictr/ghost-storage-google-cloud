# ghost-storage-google-cloud

Google Cloud storage adapter for Ghost.

## Installation

```bash
cd /path/to/your/ghost/installation
npm install ghost-storage-google-cloud
mkdir -p content/adapters/storage
cp -r node_modules/ghost-storage-google-cloud content/adapters/storage/ghost-storage-google-cloud
```

## Usage

Add the following to your configuration file and modify it accordingly.

```json
"storage": {
    "active": "ghost-storage-google-cloud",
    "ghost-storage-google-cloud": {
        "bucket": "<your bucket name here>",
        "baseUrl": "https://example.com",
        "maxAge": 3600,
        "projectId": "example"
    }
}
```

## License

[MIT](LICENSE.txt)
