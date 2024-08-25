import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

const mockCustomerRepository = () => ({
  count: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('DataService', () => {
  let service: DataService;
  let customerRepository: MockRepository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository(),
        },
      ],
    }).compile();

    service = module.get<DataService>(DataService);
    customerRepository = module.get<MockRepository<Customer>>(
      getRepositoryToken(Customer),
    );
  });

  describe('onModuleInit', () => {
    it('should populate the database if no customers exist', async () => {
      customerRepository.count.mockResolvedValue(0);
      customerRepository.save.mockResolvedValue([]);

      await service.onModuleInit();

      expect(customerRepository.count).toHaveBeenCalled();
      expect(customerRepository.save).toHaveBeenCalledTimes(1);
      expect(customerRepository.save).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should not populate the database if customers exist', async () => {
      customerRepository.count.mockResolvedValue(10);

      await service.onModuleInit();

      expect(customerRepository.count).toHaveBeenCalled();
      expect(customerRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const customers = [new Customer(), new Customer()];
      customerRepository.find.mockResolvedValue(customers);

      expect(await service.findAll()).toEqual(customers);
      expect(customerRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single customer', async () => {
      const customer = new Customer();
      customerRepository.findOneBy.mockResolvedValue(customer);

      expect(await service.findOne(1)).toEqual(customer);
      expect(customerRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if customer is not found', async () => {
      customerRepository.findOneBy.mockResolvedValue(null);

      expect(await service.findOne(1)).toBeNull();
      expect(customerRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('create', () => {
    it('should successfully create a new customer', async () => {
      const customer = new Customer();
      customerRepository.save.mockResolvedValue(customer);

      expect(await service.create(customer)).toEqual(customer);
      expect(customerRepository.save).toHaveBeenCalledWith(customer);
    });
  });

  describe('update', () => {
    it('should successfully update an existing customer', async () => {
      const customer = new Customer();
      customerRepository.update.mockResolvedValue(undefined);
      customerRepository.findOneBy.mockResolvedValue(customer);

      expect(await service.update(1, { name: 'Updated Name' })).toEqual(
        customer,
      );
      expect(customerRepository.update).toHaveBeenCalledWith(1, {
        name: 'Updated Name',
      });
      expect(customerRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      customerRepository.delete.mockResolvedValue(undefined);

      await service.remove(1);

      expect(customerRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
