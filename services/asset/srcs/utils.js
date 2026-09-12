const { HeadObjectCommand, ListBucketsCommand } = require("@aws-sdk/client-s3");
const objectExists = async (rustfs, bucket, key) => {
  try {
    await rustfs.send(
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

const checkConnection = async (rustfs) => {
  try {
    await rustfs.send(new ListBucketsCommand({}));
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
