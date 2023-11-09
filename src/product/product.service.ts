import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  EditProductDto,
  ProductDto,
} from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(
    dto: ProductDto,
    userId: number,
  ) {
    try {
      const product =
        await this.prisma.product.create({
          data: {
            userId,
            ...dto,
          },
        });

      // Emit product creation log

      return product;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Product UPC already exist',
          );
        }
      }
      throw error;
    }
  }

  getAllProducts() {
    return this.prisma.product.findMany({});
  }

  getProductByUpc(upc: number) {
    return this.prisma.product.findMany({
      where: {
        upc,
      },
    });
  }

  // This is a full text search
  async searchProductByText(searchTerm: string) {
    const searchWords = searchTerm
      .split(' ')
      .join(' | ');

    return await this.prisma.product.findMany({
      orderBy: {
        _relevance: {
          fields: ['name', 'description'],
          search: searchWords,
          sort: 'asc',
        },
      },
    });
  }

  async editProductByUpc(
    productUpc: number,
    userId: number,
    dto: EditProductDto,
  ) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          upc: productUpc,
        },
      });

    if (!product || product.userId !== userId) {
      throw new ForbiddenException(
        'Access to resources denied.',
      );
    }

    return this.prisma.product.update({
      where: {
        upc: productUpc,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProductByUpc(
    userId: number,
    productUpc: number,
  ) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          upc: productUpc,
        },
      });

    if (!product || product.userId !== userId) {
      throw new ForbiddenException(
        'Access to resources denied',
      );
    }

    await this.prisma.product.delete({
      where: {
        upc: productUpc,
      },
    });
  }
}
