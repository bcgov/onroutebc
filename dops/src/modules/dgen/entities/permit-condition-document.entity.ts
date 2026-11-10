import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '@modules/common/entities/base.entity';
import * as PermitConditionDocumentEnum from '@app/enum/permit-condition-document.enum';
import { StorageType } from '@app/enum/storage-type.enum';
import { ExternalDocument } from './external-document.entity';
import { Document } from '@modules/dms/entities/document.entity';

@Entity({ name: 'dops.ORBC_PERMIT_CONDITION_DOCUMENT' })
export class PermitConditionDocument extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Primary key for the document metadata record',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  id: string;

  @AutoMap()
  @ApiProperty({
    example: 'CVSE1000',
    description: 'The permit condition name.',
  })
  @Column({
    type: 'simple-enum',
    enum: PermitConditionDocumentEnum.PermitConditionDocument,
    length: 50,
    name: 'PERMIT_CONDITION',
    nullable: false,
  })
  permitCondition: PermitConditionDocumentEnum.PermitConditionDocument;

  @AutoMap()
  @ApiProperty({
    example: 'EXTERNAL_URL',
    description: 'The storage type for the document.',
  })
  @Column({
    type: 'simple-enum',
    enum: StorageType,
    length: 20,
    name: 'STORAGE_TYPE',
    nullable: false,
  })
  storageType: StorageType;

  @AutoMap()
  @OneToOne(() => ExternalDocument, { cascade: false, eager: true })
  @JoinColumn({
    name: 'EXTERNAL_DOCUMENT_ID',
    referencedColumnName: 'documentId',
  })
  externalDocument: ExternalDocument;

  @AutoMap()
  @OneToOne(() => Document, { cascade: false, eager: true })
  @JoinColumn({ name: 'S3_DOCUMENT_ID', referencedColumnName: 'documentId' })
  s3Document: Document;
}
