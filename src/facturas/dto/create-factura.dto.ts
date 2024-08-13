import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateFacturaDto {
  @IsDate()
  @Type(() => Date)
  fecha_emision: Date;
  @IsString({ each: true })
  @IsArray()
  estado_auditoria: string[];
  @IsNumber()
  @IsPositive()
  @IsOptional()
  total?: number;
  @IsString()
  @IsOptional()
  observaciones?: string;
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
