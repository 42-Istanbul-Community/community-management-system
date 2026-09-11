const { HeadObjectCommand } = require("@aws-sdk/client-s3");
const objectExists = async (minio, bucket, key) => {
  try {
    await minio.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    return true;
  } catch (error) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return false;
    }

    throw error;
  }
};

const checkConnection = async (minio) => {
  try {
    await minio.send(new ListBucketsCommand({}));
    return true;
  }
  catch (error) {
    return false;
  }
};

module.exports = {
  objectExists,
  checkConnection,
};
