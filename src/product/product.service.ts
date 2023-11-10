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
import {
  EventEmitter2,
  OnEvent,
} from '@nestjs/event-emitter';
import { MyLogger } from 'src/log/logger.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private myLogger: MyLogger,
  ) {
    this.myLogger.setContext('ProductService');
  }

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

      // Emit product creation event
      this.eventEmitter.emit(
        'product.created',
        product,
      );

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
    return this.prisma.product.findUnique({
      where: {
        upc,
      },
    });
  }

  // This is a full text search
  async searchProductByText(searchTerm: string) {
    const searchWords = searchTerm
      .split(' ')
      .join(' & ');

    return await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { search: searchWords } },
          {
            description: { search: searchWords },
          },
        ],
      },
      orderBy: {
        _relevance: {
          fields: ['name', 'description'],
          search: searchWords,
          sort: 'desc',
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

  @OnEvent('product.created', { async: true })
  handleProductCreatedEvent(payload: ProductDto) {
    // Handle logging of event created.
    this.myLogger.log(
      'Product created: ' + payload,
    );
  }
}
