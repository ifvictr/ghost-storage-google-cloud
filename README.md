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

Here's a comprehensive list of configurations:

| **Name**    | **Required?** | **Description**                                                          | **Environment variable (prefixed with `GHOST_GOOGLE_CLOUD_`)** |
|-------------|---------------|--------------------------------------------------------------------------|----------------------------------------------------------------|
| `baseUrl`   | no            | Base URL of newly saved images. Uses Google Cloud Storage URL by default | `BASE_URL`                                                     |
| `bucket`    | yes           | Name of the storage bucket                                               | `BUCKET`                                                       |
| `maxAge`    | no            | Seconds it takes for cache to expire. Defaults to one year               | `MAX_AGE`                                                      |
| `projectId` | no            | The ID of the project that should be billed                              | `PROJECT_ID`                                                   |

## License

[MIT](LICENSE.txt)
