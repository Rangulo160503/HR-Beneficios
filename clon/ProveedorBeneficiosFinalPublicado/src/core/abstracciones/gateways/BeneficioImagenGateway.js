/**
 * @typedef {Object} BeneficioImagenGateway
 * @property {(beneficioId: string, options?: object) => Promise<any>} listByBeneficio
 * @property {(imagenId: string, options?: object) => Promise<any>} get
 * @property {(dto: object, options?: object) => Promise<any>} create
 * @property {(imagenId: string, dto: object, options?: object) => Promise<any>} update
 * @property {(imagenId: string, options?: object) => Promise<any>} remove
 */
export {};
