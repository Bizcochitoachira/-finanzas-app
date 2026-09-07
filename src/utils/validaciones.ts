export function esMesFuturo(mesTexto: string): boolean {
  const hoy = new Date()
  const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
  return mesTexto >= mesActual
}