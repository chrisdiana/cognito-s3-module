import { authenticate, getCredentials } from './modules/authenticate-cognito.js';
import { getFile, uploadFile } from './modules/s3.js';
import { triggerLambda } from './modules/lambda.js';
import config from './config.js';




var app = new Vue({
  el: '#app',
  data: {
    file: null,
    error: null,
    success: null,
    config,
    auth: null,
    credentials: {
      email: config.cognito.email || '',
      password: config.cognito.password || '',
    },
    bucket: config.s3.bucket || '',
    key: null,
    services: {},
  },
  methods: {
    login() {
      authenticate(this.credentials, this.config.cognito)
        .then(auth => {
          this.auth = auth;
          getCredentials()
            .then(data => {
              const sub = AWS.config.credentials.identityId;
              this.key = this.config.s3.key.replace('<sub>', sub);

              const s3 = new AWS.S3();
              this.services.s3 = s3;

              const lambda = new AWS.Lambda();
              this.services.lambda = lambda;
            })
            .catch(error => { this.error = error; });
        })
        .catch(error => { this.error = error; });
    },
    uploadFiles(e) {
      this.file = e.target.files[0];
      this.key = this.key + this.file.name;
      uploadFile(this.services.s3, this.key, this.bucket, this.file, true)
        .then(data => {
          console.log(data);
          this.file = data;
          this.success = data;
        })
        .catch(error => { this.error = error; });
    },
    getFileObject() {
      getFile(this.services.s3, this.key, this.bucket)
        .then(data => {
          console.log(data);
          this.file = data;
          this.success = data;
        })
        .catch(error => { this.error = error; });
    },
    triggerLambda() {
      triggerLambda(this.service.lambda, this.config.lambda)
        .then(data => {
          console.log(data);
          this.success = data;
        })
        .catch(error => { this.error = error; });
    },
    reset() {
      this.file = null;
      this.error = null;
      this.bucket = '';
      this.key = null;
      this.services.s3 = new AWS.S3();
      this.services.stepFunctions = new AWS.StepFunctions();
    },
  },
});
