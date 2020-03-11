export function triggerStepFunction(service, params) {
  return new Promise((resolve, reject) => {
    service.startExecution(params,
      function(error, data) {
        if (error) {
          reject(error, error.stack);
        } else {
          resolve(data);
        }
    });
  });
}
