import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Factura } from './factura.entity';

@Entity()
export class FacturasImages {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('text')
  url: string;
  @ManyToOne(() => Factura, (fatura) => fatura.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'factura_Id' })
  factura: Factura;
}
