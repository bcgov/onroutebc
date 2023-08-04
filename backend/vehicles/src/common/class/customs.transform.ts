import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class LessThenPipe implements PipeTransform<number, number> {
  transform(value: number) {
    if (value <= 25) {
      return value;
    }

    throw new BadRequestException('limit must be less then or equal to 25.');
  }
}
