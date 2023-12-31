import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import {
  SignUpDto,
  SignInDto,
} from '../src/auth/dto';
import {
  ProductDto,
  EditProductDto,
} from '../src/product/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { ProfileDto } from '../src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const signInDto: SignInDto = {
      email: 'anu@gmail.com',
      password: '1234567',
    };

    const dto: SignUpDto = {
      email: 'anu@gmail.com',
      password: '1234567',
      first_name: 'abc',
      last_name: 'xyz',
    };

    describe('Signup', () => {
      it('should throw an error if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw an error if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw an error if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: signInDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: signInDto.email,
          })
          .expectStatus(400);
      });
      it('should throw an error if no body is provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInDto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get Profile', () => {
      it('should get current user', async () => {
        const signInDto: SignInDto = {
          email: 'anu@gmail.com',
          password: '1234567',
        };
        const cookie = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInDto)
          .returns((ctx) => {
            return ctx.res.headers['set-cookie'];
          });

        return pactum
          .spec()
          .get('/users/profile')
          .withCookies(cookie[0])
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', async () => {
        const dto: ProfileDto = {
          first_name: 'Anu',
          last_name: 'Onifade',
        };

        const signInDto: SignInDto = {
          email: 'anu@gmail.com',
          password: '1234567',
        };

        const cookie = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInDto)
          .returns((ctx) => {
            return ctx.res.headers['set-cookie'];
          });

        return pactum
          .spec()
          .patch('/users')
          .withCookies(cookie[0])
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.first_name)
          .expectBodyContains(dto.last_name);
      });
    });
  });

  describe('Products', () => {
    describe('Get empty products', () => {
      it('should get products', async () => {
        const signInDto: SignInDto = {
          email: 'anu@gmail.com',
          password: '1234567',
        };
        const cookie = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInDto)
          .returns((ctx) => {
            return ctx.res.headers['set-cookie'];
          });

        return pactum
          .spec()
          .get('/products')
          .withCookies(cookie[0])
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create product', () => {
      const dto: ProductDto = {
        name: 'First Product',
        description: 'First product description',
        upc: 11223344,
        price: '20.0',
        quantity: 5,
      };
      it('should create product', async () => {
        const signInDto: SignInDto = {
          email: 'anu@gmail.com',
          password: '1234567',
        };
        const cookie = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInDto)
          .returns((ctx) => {
            return ctx.res.headers['set-cookie'];
          });
        return pactum
          .spec()
          .post('/products')
          .withCookies(cookie[0])
          .withBody(dto)
          .expectStatus(201)
          .stores('productUpc', 'upc');
      });
    });

    describe('Get products', () => {
      it('should get products', async () => {
        const signInDto: SignInDto = {
          email: 'anu@gmail.com',
          password: '1234567',
        };
        const cookie = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInDto)
          .returns((ctx) => {
            return ctx.res.headers['set-cookie'];
          });

        return pactum
          .spec()
          .get('/products')
          .withCookies(cookie[0])
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get product by upc', () => {
      it('should get product by upc', async () => {
        const signInDto: SignInDto = {
          email: 'anu@gmail.com',
          password: '1234567',
        };
        const cookie = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInDto)
          .returns((ctx) => {
            return ctx.res.headers['set-cookie'];
          });

        return pactum
          .spec()
          .get('/products/{upc}')
          .withPathParams('upc', '$S{productUpc}')
          .withCookies(cookie[0])
          .expectStatus(200)
          .expectBodyContains('$S{productUpc}');
      });
    });

    describe('Edit product by upc', () => {
      const dto: EditProductDto = {
        name: 'A different name',
        description: 'A different description',
      };
      it('should edit product', async () => {
        const signInDto: SignInDto = {
          email: 'anu@gmail.com',
          password: '1234567',
        };
        const cookie = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInDto)
          .returns((ctx) => {
            return ctx.res.headers['set-cookie'];
          });

        return pactum
          .spec()
          .patch('/products/{upc}')
          .withPathParams('upc', '$S{productUpc}')
          .withCookies(cookie[0])
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete product by upc', () => {
      it('should delete product', async () => {
        const signInDto: SignInDto = {
          email: 'anu@gmail.com',
          password: '1234567',
        };
        const cookie = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInDto)
          .returns((ctx) => {
            return ctx.res.headers['set-cookie'];
          });

        return pactum
          .spec()
          .delete('/products/{upc}')
          .withPathParams('upc', '$S{productUpc}')
          .withCookies(cookie[0])
          .expectStatus(204);
      });

      it('should get empty product', async () => {
        const signInDto: SignInDto = {
          email: 'anu@gmail.com',
          password: '1234567',
        };
        const cookie = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(signInDto)
          .returns((ctx) => {
            return ctx.res.headers['set-cookie'];
          });

        return pactum
          .spec()
          .get('/products')
          .withCookies(cookie[0])
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
