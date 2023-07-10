import { AutoMap } from '@automapper/classes';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TemplateName } from '../../../enum/template-name.enum';

@Entity({ name: 'dops.ORBC_DOCUMENT_TEMPLATE' })
export class DocumentTemplate {
  /**
   * Primary key of the Template entity, automatically generated as an integer.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'TEMPLATE_ID' })
  templateId: number;

  /**
   * Template name
   */
  @AutoMap()
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: TemplateName,
    length: 50,
    name: 'TEMPLATE_NAME',
    nullable: false,
  })
  templateName: TemplateName;

  /**
   * Template version
   */
  @AutoMap()
  @Column({ type: 'integer', name: 'TEMPLATE_VERSION', nullable: false })
  templateVersion: number;

  /**
   * Document Management System (DMS) Document ID
   */
  @AutoMap()
  @Column({ length: 50, name: 'DOCUMENT_ID', nullable: false })
  documentId: string;
}
