import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentCardType } from 'src/common/enum/payment-card-type.enum';
import { PaymentMethodType } from 'src/common/enum/payment-method-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PermitType } from '../enum/permit-type.enum';
import { GlType } from '../enum/gl-type.enum';

@Entity('ORBC_GL_CODE_TYPE', { schema: 'permit' })
export class GlCodeType {
  @PrimaryGeneratedColumn({ name: 'GL_CODE_TYPE' })
  glCodeType: number;

  @ApiProperty({
    enum: GlType,
    description: 'Friendly name for the permit type',
    example: GlType.REVENUE_GL,
  })
  @Column({
    type: 'simple-enum',
    enum: GlType,
    length: 10,
    name: 'GL_TYPE',
    nullable: true,
  })
  glType: GlType;

  @ApiProperty({
    enum: PermitType,
    description: 'Friendly name for the permit type',
    example: PermitType.TERM_OVERSIZE,
  })
  @Column({
    type: 'simple-enum',
    enum: PermitType,
    length: 10,
    name: 'PERMIT_TYPE',
    nullable: true,
  })
  permitType: PermitType;

  @AutoMap()
  @ApiProperty({
    example: PaymentMethodType.WEB,
    description: 'The identifier of the user selected payment method.',
  })
  @Column({
    type: 'simple-enum',
    enum: PaymentMethodType,
    name: 'PAYMENT_METHOD_TYPE',
    nullable: false,
  })
  paymentMethodTypeCode: PaymentMethodType;

  @AutoMap()
  @ApiProperty({
    example: PaymentCardType.VISA,
    description: 'The identifier of the user selected payment type.',
  })
  @Column({
    type: 'simple-enum',
    enum: PaymentCardType,
    name: 'PAYMENT_CARD_TYPE',
    nullable: true,
  })
  paymentCardTypeCode: PaymentCardType;

  @AutoMap()
  @ApiProperty({
    example: '034',
    description: 'Client id ',
  })
  @Column({
    name: 'CLIENT',
  })
  client: string;

  @AutoMap()
  @ApiProperty({
    example: '55730',
    description: 'Responsibility id ',
  })
  @Column({
    name: 'RESPONSIBILITY',
  })
  responsibility: string;

  @AutoMap()
  @ApiProperty({
    example: '10425',
    description: 'Service Line',
  })
  @Column({
    name: 'SERVICE_LINE',
  })
  serviceLine: string;

  @AutoMap()
  @ApiProperty({
    example: '4321',
    description: 'Stob',
  })
  @Column({
    name: 'STOB',
  })
  stob: string;

  @AutoMap()
  @ApiProperty({
    example: '00000',
    description: 'Projet',
  })
  @Column({
    name: 'PROJECT',
  })
  project: string;

  @AutoMap()
  @ApiProperty({
    example: '000000',
    description: 'Location',
  })
  @Column({
    name: 'LOCATION',
  })
  location: string;

  @AutoMap()
  @ApiProperty({
    example: '0000',
    description: 'Future',
  })
  @Column({
    name: 'FUTURE',
  })
  future: string;
}
