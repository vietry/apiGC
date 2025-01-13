export class UpdateBlancoBiologicoDto {
  private constructor(
    public readonly id: number,
    public readonly cientifico?: string,
    public readonly estandarizado?: string,
    public readonly idVegetacion?: number
  ) {}

  /**
   * Retorna solo las propiedades que se desean actualizar
   */
  get values() {
    const returnObj: { [key: string]: any } = {};

    if (this.cientifico !== undefined) {
      returnObj.cientifico = this.cientifico;
    }
    if (this.estandarizado !== undefined) {
      returnObj.estandarizado = this.estandarizado;
    }
    if (this.idVegetacion !== undefined) {
      returnObj.idVegetacion = this.idVegetacion;
    }

    return returnObj;
  }

  static async create(props: {
    [key: string]: any;
  }): Promise<[string?, UpdateBlancoBiologicoDto?]> {
    const { id, cientifico, estandarizado, idVegetacion } = props;

    //let idVegetacionNumber = idVegetacion;
    // Validamos que ID sea un número válido
    if (!id || isNaN(Number(id))) {
      return ["ID inválido o faltante"];
    }

    /*if (idVegetacion !== undefined && typeof idVegetacion !== 'number') {
        idVegetacionNumber = parseInt(idVegetacion);
        if (isNaN(idVegetacionNumber)) return ['idVegetacion debe ser un número válido'];
    }*/

    return [
      undefined,
      new UpdateBlancoBiologicoDto(
        Number(id),
        cientifico ?? undefined,
        estandarizado ?? undefined,
        idVegetacion ? Number(idVegetacion) : undefined
      ),
    ];
  }
}
