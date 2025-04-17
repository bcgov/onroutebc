import { NotFoundException } from '@nestjs/common';
/* DataNotFoundException scope: to send a user friendly error message 
as compared to the original error message
which contains bunch of escape characters*/
export class DataNotFoundException extends NotFoundException {
  constructor() {
    super('Data Not Found.');
  }
}
