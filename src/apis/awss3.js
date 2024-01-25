import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.REACT_APP_S3_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const getImg = (path) => {
  const params = {
    Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
    Key: path,
    Expires: 60
  };

  return s3.getSignedUrl('getObject', params);
};

export {
  getImg
};
