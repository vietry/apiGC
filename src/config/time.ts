export function getCurrentDate(): Date {
  // Resta 5 horas (5 * 60 * 60 * 1000 milisegundos) a la hora actual
  return new Date(new Date().getTime() - 5 * 60 * 60 * 1000);
}
