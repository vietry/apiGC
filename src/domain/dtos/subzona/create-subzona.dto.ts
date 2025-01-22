export class CreateSubZonaDto {
  private constructor(
    public readonly codi: string,
    public readonly nombre?: string | null,
    public readonly idSuperZona?: number | null,
    public readonly idZona?: number | null
  ) {}

  static async create(object: {
    [key: string]: any;
  }): Promise<[string?, CreateSubZonaDto?]> {
    const { codi, nombre, idSuperZona, idZona } = object;

    if (!codi || codi.trim().length === 0) return ["Código es requerido"];

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
      new CreateSubZonaDto(codi, nombre, idSuperZonaNumber, idZonaNumber),
    ];
  }
}
