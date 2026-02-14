/**
 * @typedef {Object} ToqueBeneficioGateway
 * @property {(beneficioId: string, range?: string, options?: object, granularity?: string) => Promise<any>} analytics
 * @property {(range?: string, options?: object) => Promise<any>} resumen
 * @property {(beneficioId: string, origen: string, options?: object) => Promise<any>} registrar
 */
export {};
