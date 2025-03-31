import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class InventoryService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('InventoryService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected')
  }
  create(createInventoryDto: CreateInventoryDto) {

    return this.inventory.create({
      data: createInventoryDto
    });
  }

  async findAll(paginationDto: PaginationDto) {

    const { page, limit } = paginationDto;

    const totalPage = await this.inventory.count({ where: { available: true } })
    const lastPage = Math.ceil(totalPage / limit);


    return {
      data: await this.inventory.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true }
      }),
      meta: {
        total: totalPage,
        page: page,
        lastPage: lastPage,
      }
    }
  }

  async findOne(id: number) {
    const product = await this.inventory.findFirst({
      where: { id: id, available: true }
    });

    if (!product) {
      throw new RpcException({
        message: `Product with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST
      })
    }

    return product;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {

    const { id: _, ...data } = updateInventoryDto

    await this.findOne(id);

    return this.inventory.update({
      where: { id },
      data: data,
    })
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.inventory.update({
      where: { id },
      data: {
        available: false
      }
    });

    return product


  }
}
