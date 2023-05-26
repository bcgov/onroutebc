import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ORBC_PDF_TEMPLATE' })
export class Template {
  /**
   * Primary key of the Template entity, automatically generated as an integer.
   */
  @PrimaryGeneratedColumn({ type: 'integer', name: 'TEMPLATE_ID' })
  templateId: number;

  /**
   * Template name
   */
  @Column({ length: 50, name: 'TEMPLATE_NAME', nullable: false })
  templateName: string;

  /**
   * Template version
   */
  @Column({ length: 50, name: 'TEMPLATE_VERSION', nullable: false })
  templateVersion: string;

  /**
   * Document Management System (DMS) reference ID
   */
  @Column({ length: 50, name: 'DMS_REF_ID', nullable: false })
  dmsRef: string;

  /**
   * Variation of the template, if there are multiple templates associated with a single permit type
   */
  // @Column({ length: 10, name: 'VARIATION', nullable: true })
  // variation: string;
}
