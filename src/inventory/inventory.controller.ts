import { Controller, ParseIntPipe } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  //@Post()
  @MessagePattern({ cmd: 'create_inventory' })
  create(@Payload() createInventoryDto: CreateInventoryDto) {

    return this.inventoryService.create(createInventoryDto);
  }
  //@Get()
  @MessagePattern({ cmd: 'find_all_inventory' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.inventoryService.findAll(paginationDto);
  }

  //@Get(':id')
  @MessagePattern({ cmd: 'find_one_inventory' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOne(id);
  }

  //@Patch(':id')
  @MessagePattern({ cmd: 'update_inventory' })
  update(
    //@Param('id', ParseIntPipe) id: number, 
    //@Body() updateInventoryDto: UpdateInventoryDto
    @Payload() updateInventoryDto: UpdateInventoryDto
  ) {
    return this.inventoryService.update(updateInventoryDto.id, updateInventoryDto);
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'delete_inventory' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.inventoryService.remove(id);
  }
}
