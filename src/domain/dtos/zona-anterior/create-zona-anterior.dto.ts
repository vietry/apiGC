export class CreateZonaAnteriorDto {
  private constructor(
    public readonly idEmpresa: number,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly demoplot?: boolean
  ) {}

  static async create(object: {
    [key: string]: any;
  }): Promise<[string?, CreateZonaAnteriorDto?]> {
    const { idEmpresa, codigo, nombre, demoplot } = object;

    let idEmpresaNumber = idEmpresa;
    if (!idEmpresa) return ["ID de Empresa es requerido"];
    if (typeof idEmpresa !== "number") {
      idEmpresaNumber = parseInt(idEmpresa);
      if (isNaN(idEmpresaNumber))
        return ["ID de Empresa debe ser un número válido"];
    }

    if (!codigo || codigo.trim().length === 0) return ["Código es requerido"];
    if (!nombre || nombre.trim().length === 0) return ["Nombre es requerido"];

    return [
      undefined,
      new CreateZonaAnteriorDto(idEmpresaNumber, codigo, nombre, demoplot),
    ];
  }
}
