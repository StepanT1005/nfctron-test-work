import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class DataService implements OnModuleInit {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async onModuleInit() {
    if ((await this.customerRepository.count()) === 0) {
      const customers = Array(10)
        .fill(null)
        .map(() => {
          const customer = new Customer();
          customer.name = faker.person.fullName();
          customer.email = faker.internet.email();
          customer.phone = faker.phone.number();
          return customer;
        });
      await this.customerRepository.save(customers);
    }
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    return await this.customerRepository.findOneBy({ id });
  }

  async create(customer: Customer): Promise<Customer> {
    return await this.customerRepository.save(customer);
  }

  async update(id: number, customer: Partial<Customer>): Promise<Customer> {
    await this.customerRepository.update(id, customer);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
