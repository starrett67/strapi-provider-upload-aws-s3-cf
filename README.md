# Strapi-Provider-Upload-AWS-S3-CF

## Description
This strapi provider is very similar to the aws-s3 provider. However this provider will allow you to specify a base url you want to retrieve images from and also if you want to include a hash in the s3 object key.

## Motivation
In my organization I need to save files in s3 but serve them from cloudfront. We also have our own caching strategy so having the ability to not hash the file is good because we like to overwrite images when we update them.

## Example
```
module.exports = ({ env }) => ({
  // ...
  upload: {
    provider: 'aws-s3-cf',
    providerOptions: {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),  // not required if your server is running in aws with an assumed role that can access s3
      secretAccessKey: env('AWS_ACCESS_SECRET'), // not required if your server is running in aws with an assumed role that can access s3
      region: env('AWS_REGION'),
      includeHash: false, // default is true (same as aws-s3 provider)
      baseUrl: 'https://assets.orgname.com',
      params: {
        Bucket: env('AWS_BUCKET'),
      },
    },
  },
  // ...
});
```