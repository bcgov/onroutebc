import { AutoMap } from "@automapper/classes";
import { Base } from "src/modules/common/entities/base.entity";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity({ name: 'ORBC_FEATURE_FLAG' })
export class FeatureFlag extends Base {
  /**
   * An auto-generated unique identifier for the company.
   */
  @AutoMap()
  @PrimaryGeneratedColumn({ type: 'int', name: 'ID' })
  id: number;

  /**
   * The feature key.
   */
  @AutoMap()
  @Column({ length: 50, name: 'FEATURE_KEY', nullable: true })
  featureKey: string;

  /**
   * The feature key value.
   */
  @AutoMap()
  @Column({ length: 50, name: 'FEATURE_VALUE', nullable: true })
  featureValue: string;
}
