export class CreateUsuarioDto {
  private constructor(
    public readonly nombres: string,
    public readonly apellidos: string | null,
    public readonly password: string,
    public readonly celular: string | null,
    public readonly email: string,
    public readonly emailValidado: boolean,
    public readonly rol: string,
    public readonly idFoto: number | null,
    public readonly createdAt: Date | null,
    public readonly updatedAt: Date | null
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateUsuarioDto?] {
    const {
      nombres,
      apellidos,
      password,
      celular,
      email,
      emailValidado,
      rol,
      idFoto,
      createdAt,
      updatedAt,
    } = props;

    if (!nombres || nombres.length === 0)
      return ["Nombres property is required", undefined];
    if (!apellidos || apellidos.length === 0)
      return ["Nombres property is required", undefined];
    if (!password || password.length === 0)
      return ["Password property is required", undefined];
    if (password.length < 6) return ["El password es muy corto"];
    if (!email || email.length === 0) return ["Email faltante", undefined];
    if (!rol) return ["Rol property is required", undefined];

    return [
      undefined,
      new CreateUsuarioDto(
        nombres,
        apellidos,
        password,
        celular,
        email,
        emailValidado,
        rol,
        idFoto,
        createdAt,
        updatedAt
      ),
    ];
  }
}
