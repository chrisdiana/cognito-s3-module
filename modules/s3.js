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

export function uploadFile(service, key, bucket, file) {
  return new Promise((resolve, reject) => {
    service.upload({
      Bucket: bucket,
      Key: keyPrefix + file.name,
      Body: file,
    }, function(error, data) {
      if (error) {
        reject(error, data);
      } else {
        resolve(data);
      }
    });
  });
}

