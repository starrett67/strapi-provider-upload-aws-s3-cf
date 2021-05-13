const AWS = require('aws-sdk')
const { URL } = require('url')
const path = require('path')

module.exports = {
  init (config) {
    const { includeHash = true, baseUrl, prefix = '' } = config
    delete config.includeHash
    delete config.baseUrl
    delete config.prefix
    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      ...config
    })

    return {
      async upload (file, customParams = {}) {
        const pathPrefix = path.join(prefix, file.path ? `${file.path}/` : '')
        const hashKey = `${file.hash}${file.ext}`
        const fileName = includeHash ? hashKey : file.name
        const params = {
          Key: `${pathPrefix}${fileName}`,
          Body: Buffer.from(file.buffer, 'binary'),
          ACL: 'public-read',
          ContentType: file.mime,
          ...customParams
        }
        const { Location, Key } = await S3.upload(params).promise()

        file.url = Location
        if (baseUrl) {
          const url = new URL(Key, baseUrl)
          file.url = url.href
        }
      },
      delete (file, customParams = {}) {
        const pathPrefix = path.join(prefix, file.path ? `${file.path}/` : '')
        const hashKey = `${file.hash}${file.ext}`
        const fileName = file.url.includes(hashKey) ? hashKey : file.name
        const params = {
          Key: `${pathPrefix}${fileName}`,
          ...customParams
        }
        return S3.deleteObject(params).promise()
      }
    }
  }
}
