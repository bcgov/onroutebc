import { AutoMap } from '@automapper/classes';
import { FeatureFlagValue } from 'src/common/enum/feature-flag-value.enum';
import { Base } from 'src/modules/common/entities/base.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'ORBC_FEATURE_FLAG' })
export class FeatureFlag extends Base {
  /**
   * An auto-generated unique identifier for the FeatureFlag.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'FEATURE_ID' })
  featureId: number;

  /**
   * The feature key.
   */
  @AutoMap()
  @Column({ length: 50, name: 'FEATURE_KEY', nullable: false })
  featureKey: string;

  /**
   * Feature Flag Value - either 'ENABLED' or 'DISABLED'.
   */
  @AutoMap()
  @Column({
    type: 'simple-enum',
    enum: FeatureFlagValue,
    length: 1,
    name: 'FEATURE_VALUE',
    default: FeatureFlagValue.DISABLED,
    nullable: false,
  })
  featureValue: FeatureFlagValue;
}
