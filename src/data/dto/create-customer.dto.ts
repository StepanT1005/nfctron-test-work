import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the customer' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email of the customer',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+123456789',
    description: 'The phone number of the customer',
  })
  @IsPhoneNumber(null)
  phone: string;
}
