import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ValueTransformer } from 'typeorm';

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

@Injectable()
export class ColumnBooleanTransformer implements ValueTransformer {
  public from(value?: string | null): boolean | undefined {
    return Boolean(Number(value));
  }

  public to(value?: boolean | null): string | undefined {
    return value ? '1' : '0';
  }
}
