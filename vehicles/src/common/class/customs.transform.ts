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

@Injectable()
export class ParamToArray<T> implements PipeTransform<string, T[]> {
  transform(value: string): T[] {
    const arr = value.split(',');
    if (arr[0] === '') return [];
    return arr as T[];
  }
}
