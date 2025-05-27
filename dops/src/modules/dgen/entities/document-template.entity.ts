import { AutoMap } from '@automapper/classes';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TemplateName } from '../../../enum/template-name.enum';
import { Base } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'dops.ORBC_DOCUMENT_TEMPLATE' })
export class DocumentTemplate extends Base {
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
   * Specifies whether the template is active. 'Y' for yes, 'N' for no.
   */
  @AutoMap()
  @Column({
    type: 'char',
    name: 'IS_ACTIVE',
    default: false,
    nullable: false,
    transformer: {
      to: (value: boolean): string => (value ? 'Y' : 'N'), // Converts the boolean value to 'Y' or 'N' for storage.
      from: (value: string): boolean => value === 'Y', // Converts the stored string back to a boolean.
    },
  })
  isActive: boolean;

  @AutoMap()
  @ApiProperty({
    example: 'TROS_TEMPLATE_V1.docx',
    description: 'The file Name.',
  })
  @Column({ length: '50', name: 'FILE_NAME', nullable: false })
  fileName: string;
}
