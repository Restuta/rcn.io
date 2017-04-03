// global app configuration
// it's a one place to centralize all global config varibles that we need on the server
// so it's easier to reason about and see all in once place and also we can avoid use of
// global "process.env" across the applicaiton

export default {
  AWS_S3_TOKEN: process.env.AWS_S3_TOKEN
}
