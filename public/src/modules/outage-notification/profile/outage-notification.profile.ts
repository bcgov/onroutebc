import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { OutageNotification } from '@modules/outage-notification/entities/outage-notification.entity';
import { ReadOutageNotificationDto } from '@modules/outage-notification/dto/read-outage-notification.dto';

@Injectable()
export class OutageNotificationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, OutageNotification, ReadOutageNotificationDto);
    };
  }
}
