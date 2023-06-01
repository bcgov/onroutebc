import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class ReadFileDto {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Primary key for the document metadata record',
  })
  documentId: string;

  @AutoMap()
  @ApiProperty({
    example: '111195da-d092-4121-a226-10b995e2400a',
    description: 'The uuid representing the object in S3.',
  })
  s3ObjectId: string;

  @AutoMap()
  @ApiProperty({
    example: '1647462569641',
    description: 'The version identifier created in S3.',
  })
  s3VersionId: string;

  @AutoMap()
  @ApiProperty({
    example:
      'https://your.objectstore.com/yourbucket/coms/env/00000000-0000-0000-0000-000000000000',
    description: 'The URL to the uploaded resource.',
  })
  s3Location: string;

  @AutoMap()
  @ApiProperty({
    example: 'text/plain',
    description: 'The object MIME Type.',
  })
  objectMimeType: string;

  @AutoMap()
  @ApiProperty({
    example:
      'https://your.objectstore.com/yourbucket/coms/env/00000000-0000-0000-0000-000000000000?' +
      'X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential' +
      '=credential%2F20220411%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220411T204528Z&X-Amz-Expires=300' +
      '&X-Amz-Signature=SIGNATURE&X-Amz-SignedHeaders=host&x-id=GetObject',
    description: 'A Presigned S3 URL.',
  })
  preSignedS3Url: string;
}
