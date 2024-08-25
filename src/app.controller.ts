import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { DataService } from './data/data.service';
import { Customer } from './data/customer.entity';

@Controller('customers')
export class AppController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  findAll(): Promise<Customer[]> {
    return this.dataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.dataService.findOne(+id);
  }

  @Post()
  create(@Body() customer: Customer): Promise<Customer> {
    return this.dataService.create(customer);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() customer: Partial<Customer>,
  ): Promise<Customer> {
    return this.dataService.update(+id, customer);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.dataService.remove(+id);
  }
}
