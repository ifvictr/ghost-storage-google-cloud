import { Storage } from '@google-cloud/storage'
import Promise from 'bluebird'
import BaseStorage from 'ghost-storage-base'
import isUrl from 'is-url'
import path from 'path'
import { URL } from 'url'
import * as utils from './utils'

const GOOGLE_STORAGE_URL = 'https://storage.googleapis.com'

class GoogleCloudStorage extends BaseStorage {
    constructor(config) {
        super()

        // Required config
        const bucketName = process.env.GHOST_GOOGLE_CLOUD_BUCKET || config.bucket

        // Optional config
        const baseUrl = utils.removeTrailingSlashes(process.env.GHOST_GOOGLE_CLOUD_BASE_URL || config.baseUrl || '')
        this.baseUrl = isUrl(baseUrl)
            ? baseUrl
            : `${GOOGLE_STORAGE_URL}/${bucketName}`
        this.maxAge = process.env.GHOST_GOOGLE_CLOUD_MAX_AGE || config.maxAge || (60 * 60 * 24 * 365) // Default to one year
        this.projectId = process.env.GHOST_GOOGLE_CLOUD_PROJECT_ID || config.projectId

        const client = new Storage()
        this.bucket = client.bucket(bucketName, { userProject: this.projectId })
    }

    delete(filename, targetDir) {
        return this.bucket.file(path.join(targetDir, filename)).delete()
    }

    exists(filename, targetDir) {
        return this.bucket.file(path.join(targetDir, filename)).exists()
            .then(res => res[0])
    }

    read(options) {
        return new Promise((resolve, reject) => {
            const data = []
            this.bucket.file(options.path).createReadStream()
                .on('data', data.push)
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
                    destination: filename,
                    metadata: {
                        cacheControl: `public, max-age=${this.maxAge}`,
                        contentType: file.type
                    },
                    public: true
                }
                return this.bucket.upload(file.path, options)
            })
            .then(res => this.getUrl(res[0].name))
            .catch(Promise.reject)
    }

    serve() {
        // No need to serve because absolute URLs are returned
        return (req, res, next) => {
            next()
        }
    }

    getUrl(filepath) {
        const url = new URL(this.baseUrl)
        url.pathname = `${utils.removeTrailingSlashes(url.pathname)}/${filepath}`

        return url.toString()
    }
}

export default GoogleCloudStorage
