import shortid from 'shortid'
import aws from 'aws-sdk'
import express from 'express'
import path from 'path'

const getUniqueFileName = origName => (shortid() + '-' + origName)

function S3Router(options) {
  const S3_BUCKET = options.bucket + (options.directory || '')
  // only for returning to the client
  const directory = options.directory || ''

  if (!S3_BUCKET) {
    throw new Error('S3_BUCKET is required.')
  }

  let s3Options = {
    region: options.region,
    signatureVersion: options.signatureVersion
  }

  let router = express.Router()

  /**
   * Returns an object with `signedUrl` and `publicUrl` properties that
   * give temporary access to PUT an object in an S3 bucket.
   */
  router.get('/sign', function(req, res) {
    const filename = req.query.fileName || getUniqueFileName(req.query.objectName)
    const mimeType = req.query.contentType
    const fileKey = filename

    const params = {
      Bucket: S3_BUCKET,
      Key: fileKey,
      Expires: 60,
      ContentType: mimeType,
      ACL: options.ACL || 'private',
    }


    // Set any custom headers
    if (options.headers) {
      res.set(options.headers)
    }

    const s3 = new aws.S3(s3Options)

    s3.getSignedUrl('putObject', params, function(err, data) {
      if (err) {
        console.log(err) //eslint-disable-line
        return res.send(500, 'Cannot create S3 signed URL. ' + err)
      }

      const bucketName = options.bucket

      res.json({
        signedUrl: data,
        publicUrl: `https://${bucketName}.s3.amazonaws.com` + path.join(directory, filename),
        filename: filename
      })
    })
  })

  return router
}

export default S3Router
