import { CreateVisitaDto } from '../../../src/visitas_gc/dtos/create-visita.dto';
import { UpdateVisitaDto } from '../../../src/visitas_gc/dtos/update-visita.dto';

describe('Visita DTOs', () => {
    describe('CreateVisitaDto', () => {
        it('should parse ending coordinates when provided', async () => {
            const [error, dto] = await CreateVisitaDto.create({
                idColaborador: 1,
                programacion: null,
                duracionP: null,
                duracionV: null,
                latitudFin: '12.345678',
                longitudFin: '-76.543210',
            });

            expect(error).toBeUndefined();
            expect(dto?.latitudFin).toBeCloseTo(12.345678);
            expect(dto?.longitudFin).toBeCloseTo(-76.54321);
        });

        it('should default ending coordinates to null when missing', async () => {
            const [error, dto] = await CreateVisitaDto.create({
                idColaborador: 2,
                programacion: null,
                duracionP: null,
                duracionV: null,
            });

            expect(error).toBeUndefined();
            expect(dto?.latitudFin).toBeNull();
            expect(dto?.longitudFin).toBeNull();
        });
    });

    describe('UpdateVisitaDto', () => {
        it('should expose ending coordinates in values map', async () => {
            const [error, dto] = await UpdateVisitaDto.create({
                id: 10,
                latitudFin: '10.1',
                longitudFin: '-20.2',
            });

            expect(error).toBeUndefined();
            expect(dto?.values.latitudFin).toBeCloseTo(10.1);
            expect(dto?.values.longitudFin).toBeCloseTo(-20.2);
        });

        it('should ignore undefined ending coordinates', async () => {
            const [error, dto] = await UpdateVisitaDto.create({ id: 5 });

            expect(error).toBeUndefined();
            expect(dto?.values.latitudFin).toBeUndefined();
            expect(dto?.values.longitudFin).toBeUndefined();
        });
    });
});
