import {
  Controller,
  Post,
  Get,
  UseGuards,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import {
  EditProductDto,
  ProductDto,
} from './dto';
import { ProductService } from './product.service';
import { GetUser } from '../auth/decorator/';
import { JwtGuard } from '../auth/guard';
import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';

@UseGuards(JwtGuard)
@UseInterceptors(CacheInterceptor)
@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
  ) {}
  @Post()
  createProduct(
    @Body() dto: ProductDto,
    @GetUser('id') userId: number,
  ) {
    return this.productService.createProduct(
      dto,
      userId,
    );
  }

  @Get()
  @CacheKey('all_products')
  @CacheTTL(500)
  getAllProducts() {
    const products =
      this.productService.getAllProducts();

    // Cache result before returning
    return products;
  }

  @Get(':upc')
  getProductByUpc(
    @Param('upc', ParseIntPipe)
    productUpc: number,
  ) {
    return this.productService.getProductByUpc(
      productUpc,
    );
  }

  @Get('search/:searchTerm')
  searchProductByText(
    @Param('searchTerm') searchText: string,
  ) {
    return this.productService.searchProductByText(
      searchText,
    );
  }

  @Patch(':upc')
  editProduct(
    @Param('upc', ParseIntPipe)
    productUpc: number,
    @GetUser('id') userId: number,
    @Body() dto: EditProductDto,
  ) {
    return this.productService.editProductByUpc(
      productUpc,
      userId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':upc')
  deleteProduct(
    @Param('upc', ParseIntPipe)
    productUpc: number,
    @GetUser('id') userId: number,
  ) {
    return this.productService.deleteProductByUpc(
      userId,
      productUpc,
    );
  }
}
