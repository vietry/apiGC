export class CreateBlancoBiologicoDto {
  private constructor(
    public readonly cientifico: string | null,
    public readonly estandarizado: string | null,
    public readonly idVegetacion: number
  ) {}

  static async create(object: {
    [key: string]: any;
  }): Promise<[string?, CreateBlancoBiologicoDto?]> {
    const { cientifico, estandarizado, idVegetacion } = object;

    // Validaciones básicas
    if (!idVegetacion || isNaN(Number(idVegetacion))) {
      return ["ID de vegetación faltante o inválido"];
    }

    return [
      undefined,
      new CreateBlancoBiologicoDto(
        cientifico,
        estandarizado,
        Number(idVegetacion)
      ),
    ];
  }
}
