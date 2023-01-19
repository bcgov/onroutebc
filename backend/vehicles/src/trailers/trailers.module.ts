import { Module } from '@nestjs/common';
import { TrailersService } from './trailers.service';
import { TrailersController } from './trailers.controller';
import { Trailer } from './entities/trailer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrailersProfile } from './profiles/trailer.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Trailer])],
  controllers: [TrailersController],
  providers: [TrailersService, TrailersProfile],
})
export class TrailersModule {}
