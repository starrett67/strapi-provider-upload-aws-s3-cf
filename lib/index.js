const AWS = require('aws-sdk')
const { URL } = require('url')

module.exports = {
  init (config) {
    const { includeHash = true, baseUrl } = config
    delete config.includeHash
    delete config.baseUrl
    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      ...config
    })

    return {
      async upload (file, customParams = {}) {
        const path = file.path ? `${file.path}/` : ''
        const hashKey = `${file.hash}${file.ext}`
        const fileName = includeHash ? hashKey : file.name
        const params = {
          Key: `${path}${fileName}`,
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
      async delete (file, customParams = {}) {
        const path = file.path ? `${file.path}/` : ''
        const hashKey = `${file.hash}${file.ext}`
        const fileName = file.url.includes(hashKey) ? hashKey : file.name
        const params = {
          Key: `${path}${fileName}`,
          ...customParams
        }
        return S3.deleteObject(params).promise()
      }
    }
  }
}
