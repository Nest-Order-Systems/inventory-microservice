import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {

    @IsNumber()
    @IsPositive()
    id: number
}
