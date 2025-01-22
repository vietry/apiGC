export class UpdateZonaAnteriorDto {
  private constructor(
    public readonly id: number,
    public readonly idEmpresa?: number,
    public readonly codigo?: string,
    public readonly nombre?: string,
    public readonly demoplot?: boolean
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};
    if (this.idEmpresa !== undefined) returnObj.idEmpresa = this.idEmpresa;
    if (this.codigo !== undefined) returnObj.codigo = this.codigo;
    if (this.nombre !== undefined) returnObj.nombre = this.nombre;
    if (this.demoplot !== undefined) returnObj.demoplot = this.demoplot;
    return returnObj;
  }

  static async create(props: {
    [key: string]: any;
  }): Promise<[string?, UpdateZonaAnteriorDto?]> {
    const { id, idEmpresa, codigo, nombre, demoplot } = props;

    if (!id || isNaN(Number(id))) return ["ID inválido o faltante"];

    let idEmpresaNumber = idEmpresa;
    if (idEmpresa !== undefined && typeof idEmpresa !== "number") {
      idEmpresaNumber = parseInt(idEmpresa);
      if (isNaN(idEmpresaNumber))
        return ["ID de Empresa debe ser un número válido"];
    }

    return [
      undefined,
      new UpdateZonaAnteriorDto(
        Number(id),
        idEmpresaNumber,
        codigo,
        nombre,
        demoplot
      ),
    ];
  }
}
