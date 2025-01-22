import { CustomError } from "../errors/custom.error";

export class SubZonaEntity {
  constructor(
    public id: number,
    public codi: string,
    public nombre: string | null,
    public createdAt: Date | null,
    public updatedAt: Date | null,
    public idSuperZona: number | null,
    public idZona: number | null
  ) {}

  public static fromObject(object: { [key: string]: any }): SubZonaEntity {
    const { id, codi, nombre, createdAt, updatedAt, idSuperZona, idZona } =
      object;

    if (!id) throw CustomError.badRequest("ID is required");
    if (!codi) throw CustomError.badRequest("Codigo is required");

    return new SubZonaEntity(
      id,
      codi,
      nombre,
      createdAt,
      updatedAt,
      idSuperZona,
      idZona
    );
  }
}
