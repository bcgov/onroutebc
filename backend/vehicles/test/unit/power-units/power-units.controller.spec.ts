import { Test, TestingModule } from '@nestjs/testing';
import { PowerUnitsController } from '../../../src/modules/vehicles/power-units/power-units.controller';
import { PowerUnitsService } from '../../../src/modules/vehicles/power-units/power-units.service';
import { DataNotFoundException } from '../../../src/common/exception/data-not-found.exception';
import {
  createPowerUnitDtoMock,
  readPowerUnitDtoMock,
  updatePowerUnitDtoMock,
  deletePowerUnitMock,
} from '../../util/mocks/data/power-unit.mock';
import { powerUnitsServiceMock } from '../../util/mocks/service/power-units.service.mock';
import { deleteDtoMock } from '../../util/mocks/data/delete-dto.mock';
import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import { redCompanyCvClientUserJWTMock } from 'test/util/mocks/data/jwt.mock';
import { IUserJWT } from 'src/common/interface/user-jwt.interface';
import { getDirectory } from 'src/common/helper/auth.helper';

const POWER_UNIT_ID_1 = '1';
const POWER_UNIT_ID_2 = '2';
const COMPANY_ID_1 = 1;

describe('PowerUnitsController', () => {
  let controller: PowerUnitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PowerUnitsController],
      providers: [
        { provide: PowerUnitsService, useValue: powerUnitsServiceMock },
      ],
    }).compile();

    controller = module.get<PowerUnitsController>(PowerUnitsController);
  });

  it('Power unit Controller should be defined.', () => {
    expect(controller).toBeDefined();
  });

  describe('Power unit controller create function', () => {
    it('should create a power unit', async () => {
      const request = createMock<Request>();
      request.user = redCompanyCvClientUserJWTMock;
      const currentUser = request.user as IUserJWT;
      const retPowerUnit = await controller.create(
        request,
        COMPANY_ID_1,
        createPowerUnitDtoMock,
      );
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit).toEqual(readPowerUnitDtoMock);
      expect(powerUnitsServiceMock.create).toHaveBeenCalledWith(
        COMPANY_ID_1,
        createPowerUnitDtoMock,
        currentUser,
        getDirectory(currentUser),
      );
    });
  });

  describe('Power unit controller findAll function', () => {
    it('should return all the power units', async () => {
      const retPowerUnits = await controller.findAll(COMPANY_ID_1);
      expect(typeof retPowerUnits).toBe('object');
      expect(retPowerUnits).toContainEqual(readPowerUnitDtoMock);
      expect(retPowerUnits.length).toBe(1);
    });
  });

  describe('Power unit controller findOne function', () => {
    it('should return the power unit', async () => {
      const retPowerUnit = await controller.findOne(
        null,
        COMPANY_ID_1,
        POWER_UNIT_ID_1,
      );
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit).toEqual(readPowerUnitDtoMock);
    });

    it('should throw a DataNotFoundException if power unit is not found', async () => {
      await expect(async () => {
        await controller.findOne(null, COMPANY_ID_1, POWER_UNIT_ID_2);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Power unit controller update function', () => {
    it('should update the power unit', async () => {
      const request = createMock<Request>();
      request.user = redCompanyCvClientUserJWTMock;
      const currentUser = request.user as IUserJWT;

      const retPowerUnit = await controller.update(
        request,
        COMPANY_ID_1,
        POWER_UNIT_ID_1,
        updatePowerUnitDtoMock,
      );
      expect(typeof retPowerUnit).toBe('object');
      expect(retPowerUnit).toEqual({
        ...readPowerUnitDtoMock,
        unitNumber: 'KEN2',
      });
      expect(powerUnitsServiceMock.update).toHaveBeenCalledWith(
        COMPANY_ID_1,
        POWER_UNIT_ID_1,
        updatePowerUnitDtoMock,
        currentUser,
        getDirectory(currentUser),
      );
    });

    it('should thrown a DataNotFoundException if the power unit does not exist', async () => {
      await expect(async () => {
        const request = createMock<Request>();
        request.user = redCompanyCvClientUserJWTMock;
        await controller.update(
          request,
          COMPANY_ID_1,
          POWER_UNIT_ID_2,
          updatePowerUnitDtoMock,
        );
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Power unit controller remove function.', () => {
    it('should delete the power unit', async () => {
      const deleteResult = await controller.remove(
        null,
        COMPANY_ID_1,
        POWER_UNIT_ID_1,
      );
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.deleted).toBeTruthy();
      expect(powerUnitsServiceMock.remove).toHaveBeenCalledWith(
        COMPANY_ID_1,
        POWER_UNIT_ID_1,
      );
    });

    it('should thrown a DataNotFoundException if the power unit does not exist', async () => {
      await expect(async () => {
        await controller.remove(null, COMPANY_ID_1, POWER_UNIT_ID_2);
      }).rejects.toThrow(DataNotFoundException);
    });
  });

  describe('Power unit controller bulk delete function.', () => {
    it('should delete the power unit', async () => {
      const deleteResult = await controller.deletePowerUnits(
        deletePowerUnitMock,
        COMPANY_ID_1,
      );
      expect(typeof deleteResult).toBe('object');
      expect(deleteResult.success).toBeTruthy();
      expect(deleteResult.failure).toBeTruthy();
      expect(deleteResult).toEqual(deleteDtoMock);
      expect(powerUnitsServiceMock.removeAll).toHaveBeenCalledWith(
        deletePowerUnitMock.powerUnits,
        COMPANY_ID_1,
      );
    });

    it('should thrown a DataNotFoundException if the power unit does not exist or cannot be deleted', async () => {
      await expect(async () => {
        deletePowerUnitMock.powerUnits = [POWER_UNIT_ID_2];
        await controller.deletePowerUnits(deletePowerUnitMock, COMPANY_ID_1);
      }).rejects.toThrow(DataNotFoundException);
    });
  });
});
