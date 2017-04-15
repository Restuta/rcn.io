// global app configuration
// it's a one place to centralize all global config varibles that we need on the server
// so it's easier to reason about and see all in once place and also we can avoid use of
// global "process.env" across the applicaiton

export default {
  //set the following with heroku config:set AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=yyy
  // AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  // AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
}
