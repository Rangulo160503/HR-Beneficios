/**
 * @typedef {Object} BeneficioImagenGateway
 * @property {(beneficioId: string, options?: object) => Promise<any>} list
 * @property {(id: string, options?: object) => Promise<any>} get
 * @property {(dto: object, options?: object) => Promise<any>} create
 * @property {(id: string, dto: object, options?: object) => Promise<any>} update
 * @property {(id: string, options?: object) => Promise<any>} remove
 */
export {};
