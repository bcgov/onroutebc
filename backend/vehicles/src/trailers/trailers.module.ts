import { Module } from '@nestjs/common';
import { TrailersService } from './trailers.service';
import { TrailersController } from './trailers.controller';
import { Trailer } from './entities/trailer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Trailer])],
  controllers: [TrailersController],
  providers: [TrailersService],
})
export class TrailersModule {}
