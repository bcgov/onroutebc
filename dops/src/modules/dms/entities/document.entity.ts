import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';

@Entity({ name: 'dops.ORBC_DOCUMENT' })
export class Document extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Primary key for the document metadata record',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  documentId: string;

  @AutoMap()
  @ApiProperty({
    example: '111195da-d092-4121-a226-10b995e2400a',
    description: 'The uuid representing the object in S3.',
  })
  @Column({ type: 'uniqueidentifier', name: 'S3_OBJECT_ID', nullable: false })
  s3ObjectId: string;

  @AutoMap()
  @ApiProperty({
    example: '1647462569641',
    description: 'The version identifier created in S3.',
  })
  @Column({ type: 'bigint', name: 'S3_VERSION_ID', nullable: true })
  s3VersionId: string;

  @AutoMap()
  @ApiProperty({
    example:
      'https://your.objectstore.com/yourbucket/coms/env/00000000-0000-0000-0000-000000000000',
    description: 'The URL to the uploaded resource.',
  })
  @Column({ length: '200', name: 'S3_LOCATION', nullable: false })
  s3Location: string;

  @AutoMap()
  @ApiProperty({
    example: 'text/plain',
    description: 'The object MIME Type.',
  })
  @Column({ length: '200', name: 'OBJECT_MIME_TYPE', nullable: false })
  objectMimeType: string;

  @AutoMap()
  @ApiProperty({
    example: 'TROS_TEMPLATE_V1.docx',
    description: 'The file Name.',
  })
  @Column({ length: '250', name: 'FILE_NAME', nullable: false })
  fileName: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'The DMS Version ID.',
  })
  @Column({ type: 'int', name: 'DMS_VERSION_ID', nullable: false })
  dmsVersionId: number;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'The Company ID.',
    required: false,
  })
  @Column({ type: 'int', name: 'COMPANY_ID', nullable: true })
  companyId: number;
}
