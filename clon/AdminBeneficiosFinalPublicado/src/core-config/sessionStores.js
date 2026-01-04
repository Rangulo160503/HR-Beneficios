import { LocalSessionStore } from "../core/infrastructure/session/LocalSessionStore";

export const adminSessionStore = new LocalSessionStore("hr_admin_auth");
export const providerSessionStore = new LocalSessionStore("hr_proveedor_session");
