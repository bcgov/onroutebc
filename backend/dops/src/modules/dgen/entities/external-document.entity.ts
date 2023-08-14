import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { Base } from '../../common/entities/base.entity';
import * as ExternalDocumentEnum from '../../../enum/external-document.enum';

@Entity({ name: 'dops.ORBC_EXTERNAL_DOCUMENT' })
export class ExternalDocument extends Base {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Primary key for the document metadata record',
  })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'ID' })
  documentId: string;

  @AutoMap()
  @ApiProperty({
    example: 'CVSE1000',
    description: 'The Document Name.',
  })
  @Column({
    type: 'simple-enum',
    enum: ExternalDocumentEnum.ExternalDocument,
    length: 50,
    name: 'DOCUMENT_NAME',
    nullable: false,
  })
  documentName: ExternalDocumentEnum.ExternalDocument;

  @AutoMap()
  @ApiProperty({
    example: 'Commercial Transport',
    description: 'The descirption of the document.',
  })
  @Column({ length: '200', name: 'DOCUMENT_DESCRIPTION', nullable: true })
  documentDescription: string;

  @AutoMap()
  @ApiProperty({
    example: 'https://www.th.gov.bc.ca/forms/getForm.aspx?formId=1251',
    description: 'The URL to the external document.',
  })
  @Column({ length: '200', name: 'DOCUMENT_LOCATION', nullable: false })
  documentLocation: string;

  @AutoMap()
  @ApiProperty({
    example: 'application/pdf',
    description: 'The object MIME Type.',
  })
  @Column({ length: '200', name: 'DOCUMENT_MIME_TYPE', nullable: false })
  documentMimeType: string;

  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'The Document Version ID.',
  })
  @Column({ type: 'int', name: 'DOCUMENT_VERSION_ID', nullable: false })
  documentVersionId: number;
}
