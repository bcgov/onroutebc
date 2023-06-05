export interface DmsResponse {
  documentId: string;
  s3ObjectId: string;
  s3VersionId: string;
  s3Location: string;
  objectMimeType: string;
  preSignedS3Url: string;
}
