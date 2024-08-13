import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FacturasImages } from './';

@Entity()
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  factura_id: string;
  @Column()
  fecha_emision: Date;
  @Column('text', { array: true, default: ['no revisado'] })
  estado_auditoria: string[];
  @Column('float', {
    default: 0,
  })
  total: number;
  //relacion tabla facturas-images
  @OneToMany(() => FacturasImages, (facturasImages) => facturasImages.factura, {
    cascade: true,
    eager: true,
  })
  images?: FacturasImages[];
}
