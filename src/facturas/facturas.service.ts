import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FacturasImages, Factura } from './entities';

@Injectable()
export class FacturasService {
  private readonly logger = new Logger('FacturasService');
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    @InjectRepository(FacturasImages)
    private readonly facturaImagesRepository: Repository<FacturasImages>,
    private readonly dataSources: DataSource,
  ) {}
  async create(createFacturaDto: CreateFacturaDto) {
    try {
      const { images = [], ...facturasDetails } = createFacturaDto;
      const factura = this.facturaRepository.create({
        ...facturasDetails,
        images: images.map((images) =>
          this.facturaImagesRepository.create({ url: images }),
        ),
      });
      await this.facturaRepository.save(factura);
      return { ...factura, images };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 20, offset = 0 } = paginationDto;
    const factura = await this.facturaRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });
    return factura.map((factura) => ({
      ...factura,
      images: factura.images.map((image) => image.url),
    }));
  }

  async findOne(id: string) {
    const factura = await this.facturaRepository.findOneBy({ factura_id: id });
    if (!factura)
      throw new NotFoundException(`factura con id ${id} no encontrado`);
    return factura;
  }

  async findOnePlain(id: string) {
    const { images = [], ...facturas } = await this.findOne(id);
    return { ...facturas, images: images.map((image) => image.url) };
  }

  async update(id: string, updateFacturaDto: UpdateFacturaDto) {
    const { images, ...toUpdate } = updateFacturaDto;
    const factura = await this.facturaRepository.preload({
      factura_id: id,
      ...toUpdate,
    });
    if (!factura)
      throw new NotFoundException(`factura con el id ${id} no encontrado`);
    // create query runner
    const queryRunner = this.dataSources.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(FacturasImages, { factura: { id } });
        factura.images = images.map((image) =>
          this.facturaImagesRepository.create({ url: image }),
        );
      }
      await queryRunner.manager.save(factura);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    const factura = await this.findOne(id);
    await this.facturaRepository.remove(factura);
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('error al crear la factura');
  }
}
