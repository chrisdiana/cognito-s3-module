export function getFile(service, key, bucket) {
  return new Promise((resolve, reject) => {
    service.getObject({
      Bucket: bucket,
      Key: key
    }, function(error, data) {
      if (error) {
        reject(error, data);
      } else {
        const objectData = data.Body.toString('utf-8');
        resolve(objectData);
      }
    });
  });
}

export function uploadFile(service, key, bucket, file, encryption) {
  return new Promise((resolve, reject) => {
    const obj = {
      Bucket: bucket,
      Key: key,
      Body: file,
    };

    if(encryption) {
      obj['ServerSideEncryption'] = 'AES256';
    }

    service.upload(obj, function(error, data) {
      if (error) {
        reject(error, data);
      } else {
        resolve(data);
      }
    });
  });
}

export function getList(service, params) {
  return new Promise((resolve, reject) => {
    service.listObjectsV2(params,
      function(error, data) {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
    });
  });
}
