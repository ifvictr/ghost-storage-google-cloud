import { Storage } from '@google-cloud/storage'
import Promise from 'bluebird'
import BaseStorage from 'ghost-storage-base'
import path from 'path'

class GoogleCloudStorage extends BaseStorage {
    constructor(config) {
        super()

        const bucketName = process.env.GHOST_GOOGLE_CLOUD_BUCKET_NAME || config.bucketName

        const client = new Storage()
        this.bucket = client.bucket(bucketName)
    }

    delete(filename, targetDir) {
        // TODO: Figure out if you need to handle response
        return this.getFile(path.join(targetDir, filename)).delete()
    }

    exists(filename, targetDir) {
        return this.getFile(path.join(targetDir, filename)).exists()
            .then(res => res[0])
            .catch(e => false)
    }

    read(options) {
        // TODO: Ensure this is correct
        return new Promise((resolve, reject) => {
            const data = []
            this.getFile(options.path).createReadStream()
                .on('data', chunk => {
                    console.log(chunk)
                    data.push(chunk)
                })
                .on('end', () => {
                    resolve(Buffer.concat(data))
                })
                .on('error', reject)
        })
    }

    save(file, targetDir) {
        const dir = targetDir || this.getTargetDir()

        return this.getUniqueFileName(file, dir)
            .then(filename => {
                const options = {
                    destination: path.join(dir, filename)
                }
                return this.bucket.upload(path.join(dir, filename), options)
            })
            .then(res => {
                // TODO: Return file URL
            })
            .catch(Promise.reject)
    }

    serve() {
        return (req, res, next) => {
            next()
        }
    }

    getFile(filename) {
        return this.bucket.file(filename)
    }
}

export default GoogleCloudStorage