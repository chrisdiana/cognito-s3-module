import { authenticate, getCredentials } from './modules/authenticate-cognito.js';
import { getFile, uploadFile } from './modules/s3.js';


// AWS COGNITO CONFIG
const config = {
  userPoolId: 'us-east-1_sCBy94ExW',
  clientId: '6cchsjlqa0mo6flfvna2fuldf1',
	identityPoolId: 'us-east-1:a8e91859-0f59-41fa-93ac-84c337c44da1',
  identityPoolUrl: 'cognito-idp.us-east-1.amazonaws.com/us-east-1_sCBy94ExW',
	region: 'us-east-1',
};

var app = new Vue({
  el: '#app',
  data: {
    file: null,
    error: null,
    config,
    auth: null,
    credentials: {
      email: 'XXXXXXXXXX',
      password: '',
    },
    bucket: 'datumbased-k-means-test',
    //bucket: 'datumbased-standard-ml-kmeans-backend-s3data-dev',
    key: null,
    services: {},
  },
  methods: {
    login() {
      authenticate(this.credentials, this.config)
        .then(auth => {
          this.auth = auth;
          const sub = AWS.config.credentials.identityId;

          // AWS BUCKET OBJECT KEY
          this.key = `users/${sub}/`;
          this.services.s3 = new AWS.S3();
        })
        .catch(error => { this.error = error; });
    },
    uploadFiles(e) {
      this.file = e.target.files[0];
      this.key = this.key + this.file.name;
      uploadFile(this.services.s3, this.key, this.bucket, this.file)
        .then(data => {
          console.log(data);
          this.file = null;
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