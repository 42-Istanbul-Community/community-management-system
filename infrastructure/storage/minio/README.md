# MinIO

MinIO is used as the project's object storage service and provides an S3-compatible API.

## Service Configuration

MinIO environment variables are already configured in the **ID, Community, and Content services**.

Each service has its own MinIO credentials and bucket configuration.

* `MINIO_ENDPOINT`: Internal MinIO service address.
* `MINIO_BUCKET`: Bucket assigned to the service.
* `MINIO_ACCESS_KEY`: Access key assigned to the service.
* `MINIO_SECRET_KEY`: Secret key assigned to the service.

You do **not** need to add or configure these variables manually.

Credentials are provided through Docker Secrets.

## Next.js Usage

Install the S3 client:

```bash
npm install @aws-sdk/client-s3
```

Create the MinIO client:

```ts
import { S3Client } from "@aws-sdk/client-s3";

const minio = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});
```

### Create — Upload

```ts
import { PutObjectCommand } from "@aws-sdk/client-s3";

await minio.send(
  new PutObjectCommand({
    Bucket: process.env.MINIO_BUCKET,
    Key: "example.pdf",
    Body: fileBuffer,
    ContentType: "application/pdf",
  })
);
```

### Read — Download

```ts
import { GetObjectCommand } from "@aws-sdk/client-s3";

const response = await minio.send(
  new GetObjectCommand({
    Bucket: process.env.MINIO_BUCKET,
    Key: "example.pdf",
  })
);

const file = await response.Body?.transformToByteArray();
```

### Update — Replace

S3 does not have a separate update operation. Uploading an object with the same `Key` replaces the existing object.

```ts**
import { PutObjectCommand } from "@aws-sdk/client-s3";

await minio.send(
  new PutObjectCommand({
    Bucket: process.env.MINIO_BUCKET,
    Key: "example.pdf",
    Body: updatedFileBuffer,
    ContentType: "application/pdf",
  })
);
```

### Delete

```ts
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

await minio.send(
  new DeleteObjectCommand({
    Bucket: process.env.MINIO_BUCKET,
    Key: "example.pdf",
  })
);
```

### List Objects

To list the objects stored in a bucket:

```ts
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

const response = await minio.send(
  new ListObjectsV2Command({
    Bucket: process.env.MINIO_BUCKET,
  })
);

for (const object of response.Contents ?? []) {
  console.log(object.Key);
}
```