import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../entities/base.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'ORBC_PDF_TEMPLATE' })
export class Template extends Base {
  /**
   * Primary key of the Template entity, automatically generated as an integer.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'TEMPLATE_ID' })
  templateId: number;

  /**
   * Template name should be one-to-one with permitType
   */
  @AutoMap()
  @Column({ length: 100, name: 'TEMPLATE_NAME', nullable: false })
  //@OneToOne(() => Permit, (Permit) => Permit.permitType)
  templateName: string;

  /**
   * Template version
   */
  @AutoMap()
  @Column({ length: 100, name: 'TEMPLATE_VERSION', nullable: false })
  templateVersion: string;

  /**
   * Common Object Management System (COMS) reference ID
   */
  @AutoMap()
  @Column({ length: 100, name: 'COMS_REF', nullable: false })
  comsRef: string;

  /**
   * Variation of the template, if there are multiple templates associated with a single permit type
   */
  @AutoMap()
  @Column({ length: 10, name: 'VARIATION', nullable: true })
  variation: string;
}
