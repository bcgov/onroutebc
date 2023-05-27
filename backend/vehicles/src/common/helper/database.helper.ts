import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ApplicationSource } from 'src/modules/permit/interface/application-source.interface';
import { Revision } from 'src/modules/permit/interface/revision.interface';
import { Sequence } from 'src/modules/permit/interface/sequence.interface';
import { DataSource } from 'typeorm';

@Injectable()
export class Datasource {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async callDatabaseSequence(databaseSequenceName: string): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    const query =
      'Select NEXT VALUE FOR ' + databaseSequenceName + ' as Next_Value;';
    const sequence: Sequence[] = (await queryRunner.query(query)) as Sequence[];
    console.log('sequence', sequence);
    console.log('sequence ', sequence[0].Next_Value);
    return String(sequence[0].Next_Value);
  }

  /**
   * Generate Application Number
   * @param permitNumber to generate application number from permit number.
   * @param applicationSource to get the source code
   * @param permitId if permit id is present then it is a permit amendment
   * and application number will be generated from exisitng permit number.
   */
  async generateApplicationNumber(
    permitNumber: string,
    permitApplicationOrigin: string,
    permitId: string,
  ): Promise<string> {
    let seq: string;
    let source;
    let rnd;
    let rev = '-R00';
    let revision: number;
    if (permitId) {
      //Amendment to existing permit.//Get revision Id from database.
      revision = await this.getRevision(permitId);

      //Format revision id
      rev = '-R' + String(revision + 1).padStart(2, '0');
      if (permitNumber) {
        seq = permitNumber.substring(3, 11);
        rnd = permitNumber.substring(12, 15);
      } else {
        seq = await this.callDatabaseSequence('permit.ORBC_PERMIT_NUMBER_SEQ');
        rnd = String(Math.floor(Math.random() * (100 - 999 + 1)) + 999);
      }
      source = await this.getPermitApplicationOrigin(permitApplicationOrigin);
    } else {
      //New Permit application.
      seq = await this.callDatabaseSequence('permit.ORBC_PERMIT_NUMBER_SEQ');
      source = await this.getPermitApplicationOrigin(permitApplicationOrigin);

      rnd = String(Math.floor(Math.random() * (100 - 999 + 1)) + 999);
    }

    const applicationNumber = String(
      'A' +
        String(source) +
        '-' +
        String(seq.padStart(8, '0')) +
        '-' +
        String(rnd) +
        String(rev),
    );

    return applicationNumber;
  }

  /**
   * Get Application Origin Code from database lookup table ORBC_VT_PERMIT_APPLICATION_ORIGIN
   * @param permitApplicationOrigin
   *
   */
  private async getPermitApplicationOrigin(
    permitApplicationOrigin: string,
  ): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    const query =
      "Select CODE from PERMIT.ORBC_VT_PERMIT_APPLICATION_ORIGIN WHERE ID = '" +
      permitApplicationOrigin +
      "'";
    console.log('Query ', query);
    const code: ApplicationSource[] = (await queryRunner.query(
      query,
    )) as ApplicationSource[];
    console.log('code is ', code);
    console.log('code.Code is ', code[0].CODE);
    return code[0].CODE;
  }

  /**
   *
   * @param permitId Get Permit Revision from database permit table
   */
  async getRevision(permitId: string): Promise<number> {
    console.log('Permit id ', permitId);
    const queryRunner = this.dataSource.createQueryRunner();
    const query =
      "Select REVISION from PERMIT.ORBC_PERMIT WHERE ID = '" + permitId + "'";
    const code: Revision[] = (await queryRunner.query(query)) as Revision[];
    console.log('Revision ', code[0].REVISION);
    return code[0].REVISION;
  }
}
