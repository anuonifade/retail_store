import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { LoggerModule } from 'src/log/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
