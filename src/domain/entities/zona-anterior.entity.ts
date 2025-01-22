import { CustomError } from "../errors/custom.error";

export class ZonaAnteriorEntity {
  constructor(
    public id: number,
    public idEmpresa: number,
    public codigo: string,
    public nombre: string,
    public createdAt: Date | null,
    public updatedAt: Date | null,
    public demoplot: boolean | null
  ) {}

  public static fromObject(object: { [key: string]: any }): ZonaAnteriorEntity {
    const { id, idEmpresa, codigo, nombre, createdAt, updatedAt, demoplot } =
      object;

    if (!id) throw CustomError.badRequest("ID is required");
    if (!idEmpresa) throw CustomError.badRequest("ID Empresa is required");
    if (!codigo) throw CustomError.badRequest("Codigo is required");
    if (!nombre) throw CustomError.badRequest("Nombre is required");

    return new ZonaAnteriorEntity(
      id,
      idEmpresa,
      codigo,
      nombre,
      createdAt,
      updatedAt,
      demoplot
    );
  }
}
