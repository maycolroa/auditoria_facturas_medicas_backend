import { Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura, FacturasImages } from './entities';

@Module({
  controllers: [FacturasController],
  providers: [FacturasService],
  imports: [TypeOrmModule.forFeature([Factura, FacturasImages])],
})
export class FacturasModule {}
