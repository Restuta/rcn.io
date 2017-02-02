import shortid from 'shortid'
import aws from 'aws-sdk'
import express from 'express'

function ensureTrailingSlash(path) {
  let processedPath = path

  if (processedPath && path[path.length - 1] !== '/') {
    processedPath += '/'
  }

  return processedPath
}
const getUniqueFileName = origName => (shortid() + '-' + origName)

function S3Router(options) {

  const S3_BUCKET = options.bucket + (options.directory || '')
  const getFileKeyDir = options.getFileKeyDir || (() => '')

  if (!S3_BUCKET) {
    throw new Error('S3_BUCKET is required.')
  }

  let s3Options = {}

  if (options.region) {
    s3Options.region = options.region
  }
  if (options.signatureVersion) {
    s3Options.signatureVersion = options.signatureVersion
  }

  let router = express.Router()

  /**
   * Redirects requests with a temporary signed URL, giving access
   * to GET an upload.
   */
  function tempRedirect(req, res) {
    const params = {
      Bucket: S3_BUCKET,
      Key: ensureTrailingSlash(getFileKeyDir(req)) + req.params[0]
    }

    let s3 = new aws.S3(s3Options)
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        console.log(err) //eslint-disable-line
        return res.send(500, 'Cannot create S3 signed URL. ' + err)
      }

      res.redirect(url)
    })
  }

  /**
   * Image specific route.
   */
  router.get(/\/img\/(.*)/, (req, res) => tempRedirect(req, res))

  /**
   * Other file type(s) route.
   */
  router.get(/\/uploads\/(.*)/, (req, res) => tempRedirect(req, res))

  /**
   * Returns an object with `signedUrl` and `publicUrl` properties that
   * give temporary access to PUT an object in an S3 bucket.
   */
  router.get('/sign', function(req, res) {
    console.info(req.query)
    const filename = req.query.fileName || (getUniqueFileName(req.query.objectName))
    const mimeType = req.query.contentType

    const fileKey = ensureTrailingSlash(getFileKeyDir(req)) + filename
    console.info(fileKey)

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

      const directory = options.directory || ''
      const bucketName = options.bucket

      res.json({
        signedUrl: data,
        publicUrl: `https://${bucketName}.s3.amazonaws.com` + ensureTrailingSlash(directory) + filename,
        filename: filename
      })
    })
  })

  return router
}

module.exports = S3Router
