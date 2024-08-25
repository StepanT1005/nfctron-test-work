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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateCustomerDto } from './data/dto/create-customer.dto';
import { UpdateCustomerDto } from './data/dto/update-customer.dto';

@ApiTags('customers')
@Controller('customers')
export class AppController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Return all customers.' })
  findAll(): Promise<Customer[]> {
    return this.dataService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Return customer by ID.' })
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.dataService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'The customer has been successfully created.',
  })
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.dataService.create(createCustomerDto as Customer);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The customer has been successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.dataService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Customer has been successfully deleted.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.dataService.remove(+id);
  }
}
