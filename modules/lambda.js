export function triggerLambda(service, params) {
  return new Promise((resolve, reject) => {
    service.invoke(params,
      function(error, data) {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
    });
  });
}
