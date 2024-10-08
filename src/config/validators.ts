import { prisma } from "../data/sqlserver";


export class Validators {

  
    static get email() {
      return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    } 

    static async isPuntoID(id: number): Promise<boolean> {
      const puntoDeContacto = await prisma.puntoContacto.findUnique({
        where: { id:  id },
      });
      return puntoDeContacto !== null;
    }

    static async isColaboradorID(id: number): Promise<boolean> {
      const colaborador = await prisma.colaborador.findUnique({
        where: { id:  id },
      });
      return colaborador !== null;
    }

    static async isDemoplotID(id: number): Promise<boolean> {
      const demoplot = await prisma.demoPlot.findUnique({
        where: { id:  id },
      });
      return demoplot !== null;
    }

    static async getTipoUsuario(idUsuario: number): Promise<{ idTipo: number; tipo: string, zona: string }> {
      const colaborador = await prisma.colaborador.findFirst({ 
        where: { idUsuario }, 
        include: {
          ZonaAnterior: true
        } });
      if (colaborador) {
          return { idTipo: colaborador.id, tipo: 'colaborador', zona: colaborador.ZonaAnterior?.codigo! };
      }

      const gte = await prisma.gte.findFirst({ 
        where: { idUsuario }, 
        include: {
          Colaborador: {
            select: {
              ZonaAnterior: true
            }
          }
      } });
      if (gte) {
          return { idTipo: gte.id, tipo: 'gte', zona: gte.Colaborador?.ZonaAnterior?.codigo! };
      }

      throw new Error('No related entity found for this user.');
  }
  
  
  }