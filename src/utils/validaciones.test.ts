import { describe, it, expect } from 'vitest'
import { esMesFuturo } from './validaciones'

describe('esMesFuturo', () => {
  it('rechaza un mes en el pasado', () => {
    expect(esMesFuturo('2020-01')).toBe(false)
  })

  it('acepta el mes actual', () => {
    const hoy = new Date()
    const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
    expect(esMesFuturo(mesActual)).toBe(true)
  })

  it('acepta un mes futuro lejano', () => {
    expect(esMesFuturo('2099-12')).toBe(true)
  })
})