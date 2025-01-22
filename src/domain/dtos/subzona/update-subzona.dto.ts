export class UpdateSubZonaDto {
  private constructor(
    public readonly id: number,
    public readonly codi?: string,
    public readonly nombre?: string | null,
    public readonly idSuperZona?: number | null,
    public readonly idZona?: number | null
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};
    if (this.codi !== undefined) returnObj.codi = this.codi;
    if (this.nombre !== undefined) returnObj.nombre = this.nombre;
    if (this.idSuperZona !== undefined)
      returnObj.idSuperZona = this.idSuperZona;
    if (this.idZona !== undefined) returnObj.idZona = this.idZona;
    return returnObj;
  }

  static async create(props: {
    [key: string]: any;
  }): Promise<[string?, UpdateSubZonaDto?]> {
    const { id, codi, nombre, idSuperZona, idZona } = props;

    if (!id || isNaN(Number(id))) return ["ID inválido o faltante"];

    let idSuperZonaNumber = idSuperZona;
    let idZonaNumber = idZona;

    if (
      idSuperZona !== undefined &&
      idSuperZona !== null &&
      typeof idSuperZona !== "number"
    ) {
      idSuperZonaNumber = parseInt(idSuperZona);
      if (isNaN(idSuperZonaNumber))
        return ["idSuperZona debe ser un número válido"];
    }

    if (idZona !== undefined && idZona !== null && typeof idZona !== "number") {
      idZonaNumber = parseInt(idZona);
      if (isNaN(idZonaNumber)) return ["idZona debe ser un número válido"];
    }

    return [
      undefined,
      new UpdateSubZonaDto(
        Number(id),
        codi,
        nombre,
        idSuperZonaNumber,
        idZonaNumber
      ),
    ];
  }
}
