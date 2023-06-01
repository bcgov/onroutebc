import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class ReadCOMSDto {
  @AutoMap()
  @ApiProperty({
    required: true,
    description:
      'A unique form field chosen for the key for each file in the multi-part form-data post',
  })
  fieldName: string;

  @AutoMap()
  @ApiProperty({
    required: true,
    description: 'The object MIME Type',
  })
  mimeType: string;

  @AutoMap()
  @ApiProperty({
    required: false,
    description: 'The primary identifier for this version in the COMS database',
  })
  versionId?: string;

  @AutoMap()
  @ApiProperty({
    required: true,
    description: 'The primary identifier for this object',
  })
  id: string;

  @AutoMap()
  @ApiProperty({
    required: true,
    description: 'The canonical S3 path string of the object',
  })
  path: string;

  @AutoMap()
  @ApiProperty({
    required: true,
    default: false,
    description: 'Determines whether this object is publicly accessible',
  })
  public: boolean;

  @AutoMap()
  @ApiProperty({
    required: true,
    default: true,
    description: 'Determines whether this object is considered active',
  })
  active: boolean;

  @AutoMap()
  @ApiProperty({
    required: false,
    description: 'The primary identifier for the bucket',
  })
  bucketId?: string;

  @AutoMap()
  @ApiProperty({
    required: true,
    description:
      "The subject id of the current user if request was authenticated with a Bearer token (ex. JWT), or a 'nil' uuid if request was authenticated via Basic auth",
  })
  createdBy: string;

  @AutoMap()
  @ApiProperty({
    required: true,
    description: 'Time when this record was created',
  })
  createdAt: string;

  @AutoMap()
  @ApiProperty({
    required: false,
    description:
      "The subject id of the current user if request was authenticated with a Bearer token (ex. JWT), or a 'nil' uuid if request was authenticated via Basic auth",
  })
  updatedBy?: string;

  @AutoMap()
  @ApiProperty({
    required: true,
    description: 'Time when this record was last updated',
  })
  updatedAt: string;

  @AutoMap()
  @ApiProperty({
    required: true,
    description: 'User-defined metadata',
  })
  metadata: object;

  @AutoMap()
  @ApiProperty({
    required: false,
    description: 'User-defined tags',
  })
  tags?: object;

  @AutoMap()
  @ApiProperty({
    required: true,
    description: 'S3 Identifier for a specific version of this object',
  })
  ETag: string;

  @AutoMap()
  @ApiProperty({
    required: true,
    description: 'S3 Identifier for the bucket',
  })
  Bucket?: string;

  @AutoMap()
  @ApiProperty({
    required: true,
    description: 'Key of the object',
  })
  Key: string;

  @AutoMap()
  @ApiProperty({
    required: true,
    description: 'URL to the resource just uploaded',
  })
  Location: string;

  @AutoMap()
  @ApiProperty({
    required: false,
    description:
      'If the object is stored using server-side encryption either with an AWS KMS key or an Amazon S3-managed encryption key, this field specifies the server-side encryption algorithm used when storing this object in Amazon S3 (for example, AES256, aws:kms).',
  })
  ServerSideEncryption?: string;

  @AutoMap()
  @ApiProperty({
    required: false,
    description: 'A version identifier created in S3',
  })
  s3VersionId?: string;
}
