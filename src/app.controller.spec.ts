import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { DataService } from './data/data.service';
import { Customer } from './data/customer.entity';
describe('AppController', () => {
  let appController: AppController;
  let dataService: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: DataService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    dataService = module.get<DataService>(DataService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should return all customers', async () => {
    const result: Customer[] = [new Customer(), new Customer()];
    jest.spyOn(dataService, 'findAll').mockResolvedValue(result);

    expect(await appController.findAll()).toBe(result);
  });

  it('should return a customer by ID', async () => {
    const result = new Customer();
    jest.spyOn(dataService, 'findOne').mockResolvedValue(result);

    expect(await appController.findOne('1')).toBe(result);
  });

  it('should create a customer', async () => {
    const result = new Customer();
    jest.spyOn(dataService, 'create').mockResolvedValue(result);

    expect(await appController.create(result)).toBe(result);
  });

  it('should update a customer', async () => {
    const result = new Customer();
    jest.spyOn(dataService, 'update').mockResolvedValue(result);

    expect(await appController.update('1', { name: 'Jane Doe' })).toBe(result);
  });

  it('should remove a customer by ID', async () => {
    jest.spyOn(dataService, 'remove').mockResolvedValue(undefined);

    await expect(appController.remove('1')).resolves.toBeUndefined();
  });
});
