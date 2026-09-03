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

module.exports = {
  objectExists,
};
