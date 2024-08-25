import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DataService', () => {
  let service: DataService;
  let customerRepository: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DataService>(DataService);
    customerRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const customers = [new Customer(), new Customer()];
      jest.spyOn(customerRepository, 'find').mockResolvedValue(customers);

      expect(await service.findAll()).toEqual(customers);
    });
  });

  describe('findOne', () => {
    it('should return a customer if found', async () => {
      const customer = new Customer();
      jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(customer);

      expect(await service.findOne(1)).toEqual(customer);
    });

    it('should throw NotFoundException if customer is not found', async () => {
      jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException(`Customer with ID 1 not found`),
      );
    });
  });

  describe('create', () => {
    it('should create and return a new customer', async () => {
      const customer = new Customer();
      customer.email = 'test@example.com';
      jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(customerRepository, 'save').mockResolvedValue(customer);

      expect(await service.create(customer)).toEqual(customer);
    });

    it('should throw BadRequestException if customer with email exists', async () => {
      const customer = new Customer();
      customer.email = 'test@example.com';
      jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(customer);

      await expect(service.create(customer)).rejects.toThrow(
        new BadRequestException('Customer with this email already exists'),
      );
    });
  });

  describe('update', () => {
    it('should update and return the updated customer', async () => {
      const customer = new Customer();
      customer.id = 1;
      customer.email = 'existing@example.com';

      jest.spyOn(service, 'findOne').mockResolvedValue(customer);
      jest.spyOn(customerRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(customerRepository, 'update').mockResolvedValue(undefined);

      const updatedCustomer = await service.update(1, {
        email: 'new@example.com',
      });
      expect(updatedCustomer).toBe(customer);
    });

    it('should throw BadRequestException if customer with email already exists', async () => {
      const customer = new Customer();
      customer.id = 1;
      customer.email = 'test@example.com';

      const existingCustomer = new Customer();
      existingCustomer.id = 2;
      existingCustomer.email = 'test@example.com';

      jest.spyOn(service, 'findOne').mockResolvedValue(customer);
      jest
        .spyOn(customerRepository, 'findOneBy')
        .mockResolvedValue(existingCustomer);

      await expect(
        service.update(1, { email: 'test@example.com' }),
      ).rejects.toThrow(
        new BadRequestException('Customer with this email already exists'),
      );
    });
  });

  describe('remove', () => {
    it('should remove the customer', async () => {
      const customer = new Customer();
      jest.spyOn(service, 'findOne').mockResolvedValue(customer);
      jest.spyOn(customerRepository, 'delete').mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if customer is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(
        new NotFoundException(`Customer with ID 1 not found`),
      );
    });
  });
});
