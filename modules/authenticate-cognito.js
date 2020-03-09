function setupCognito(config) {

  AWS.config.region = config.region;

  let userPool;

  const poolData = {
    UserPoolId: config.userPoolId,
    ClientId: config.clientId,
  };

  const setUserPool = poolData => {
    const {UserPoolId, ClientId} = poolData;
    try {
      userPool = new AWSCognito
        .CognitoIdentityServiceProvider
        .CognitoUserPool(poolData);
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  };

  setUserPool(poolData);

  return userPool;
}

function getCognitoUser(credentials, userPool) {
  const authenticationData = {
      Username : credentials.email,
      Password : credentials.password,
  }

  const authenticationDetails = new AWSCognito
    .CognitoIdentityServiceProvider
    .AuthenticationDetails(authenticationData);

  const userData = {
      Username : credentials.email,
      Pool: userPool,
  };
  const cognitoUser = new AWSCognito
    .CognitoIdentityServiceProvider
    .CognitoUser(userData);

  return { cognitoUser, authenticationDetails };
}


export function authenticate(credentials, config) {

  const userPool = setupCognito(config);
  const { cognitoUser, authenticationDetails } = getCognitoUser(credentials, userPool);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: config.identityPoolId,
              Logins : {}
          });

          AWS.config.credentials.params.Logins = AWS.config.credentials.params.Logins || {};
		      AWS.config.credentials.params.Logins[config.identityPoolUrl] = idToken;

          cognitoUser.getUserAttributes((error, userAttributes) => {
            if(userAttributes) {
              resolve({ accessToken, idToken, userAttributes});
            }
            if(error) {
              reject(error);
            }
          });
        },
        onFailure: error => {
          reject(error);
        },
    });
  });
}

export function getCredentials() {
  return new Promise((resolve, reject) => {
    AWS.config.credentials.get(function(error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data, AWS.config.credentials.identityId);
      }
    });
  });
}
