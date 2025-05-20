import { IsString } from 'class-validator';

export class AuthPayloadDto {
  @IsString()
  username: string;
  password:string;
}
