import { authenticate, getCredentials } from './modules/authenticate-cognito.js';
import { getFile, uploadFile } from './modules/s3.js';
import config from './config.js';

var app = new Vue({
  el: '#app',
  data: {
    file: null,
    error: null,
    config,
    auth: null,
    credentials: {
      email: config.email || '',
      password: config.password || '',
    },
    bucket: config.bucket || '',
    key: null,
    services: {},
  },
  methods: {
    login() {
      authenticate(this.credentials, this.config)
        .then(auth => {
          this.auth = auth;
          getCredentials()
            .then(data => {
              const sub = AWS.config.credentials.identityId;
              // AWS BUCKET OBJECT KEY
              this.key = config.key.replace('<sub>', sub);
              this.services.s3 = new AWS.S3();
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
        })
        .catch(error => { this.error = error; });
    },
    getFileObject() {
      getFile(this.services.s3, this.key, this.bucket)
        .then(data => {
          console.log(data);
          this.file = data;
        })
        .catch(error => { this.error = error; });
    },
    reset() {
      this.file = null;
      this.error = null;
      this.bucket = '';
      this.key = null;
      this.services.s3 = new AWS.S3();
    },
  },
});
