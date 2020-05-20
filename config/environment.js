var environments = {
    staging: {
      FIREBASE_API_KEY: 'AIzaSyDrcY7Qct2WN-M41CN7Y5PVGJ36IfDUdl0',
      FIREBASE_AUTH_DOMAIN: 'ymir-vision-deb34.firebaseapp.com',
      FIREBASE_DATABASE_URL: 'https://ymir-vision-deb34.firebaseio.com',
      FIREBASE_PROJECT_ID: 'ymir-vision-deb34',
      FIREBASE_STORAGE_BUCKET: 'ymir-vision-deb34.appspot.com',
      FIREBASE_MESSAGING_SENDER_ID: '41126118185',
      GOOGLE_CLOUD_VISION_API_KEY: 'AIzaSyBsKFQQdpF89GoCWftxnLamRETtgq0-3pc'
    },
  };
  
  function getReleaseChannel() {
    let releaseChannel = Expo.Constants.manifest.releaseChannel;
    if (releaseChannel === undefined) {
      return 'staging';
    } else if (releaseChannel === 'staging') {
      return 'staging';
    } else {
      return 'staging';
    }
  }
  function getEnvironment(env) {
    console.log('Release Channel: ', getReleaseChannel());
    return environments[env];
  }
  var Environment = getEnvironment(getReleaseChannel());
  export default Environment;