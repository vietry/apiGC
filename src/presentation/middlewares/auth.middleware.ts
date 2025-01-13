import { NextFunction, Request, Response } from "express";
import { JwtAdapter, Validators } from "../../config";
import { prisma } from "../../data/sqlserver";
import { UsuarioEntity } from "../../domain";

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    if (!authorization)
      return res.status(401).json({ error: "No token provided" });
    if (!authorization.startsWith("Bearer"))
      return res.status(401).json({ error: "Invalid Bearer token" });

    const token = authorization.split(" ").at(1) || "";

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: "Invalid token" });

      const user = await prisma.usuario.findFirst({
        where: { id: parseInt(payload.id) },
      });
      if (!user) return res.status(401).json({ error: "Invalid token-user" });

      req.body.user = UsuarioEntity.fromObject(user);

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async validateAndReturnUser(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    if (!authorization)
      return res.status(401).json({ error: "No token provided" });
    if (!authorization.startsWith("Bearer"))
      return res.status(401).json({ error: "Invalid Bearer token" });

    const token = authorization.split(" ").at(1) || "";

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: "Unathorized" });

      const user = await prisma.usuario.findFirst({
        where: { id: parseInt(payload.id) },
      });
      if (!user) return res.status(401).json({ error: "Invalid token-user" });

      // Validar si el usuario está activo (opcional)

      const { password, ...userEntity } = UsuarioEntity.fromObject(user);
      const newToken = await JwtAdapter.generateToken({
        id: user.id,
        email: user.email,
      });
      if (!newToken)
        throw res.status(500).json({ error: "Error while creating JWT" });
      const tipoUser = await Validators.getTipoUsuario(user.id);
      return res.status(200).json({
        user: {
          ...userEntity,
          idTipo: tipoUser.idTipo,
          tipo: tipoUser.tipo,
          zona: tipoUser.zona,
          token: newToken,
        },
        token: newToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
