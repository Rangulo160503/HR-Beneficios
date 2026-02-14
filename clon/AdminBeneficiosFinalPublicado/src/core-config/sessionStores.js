import { LocalSessionStore } from "../core/infrastructure/session/LocalSessionStore";

export const adminSessionStore = new LocalSessionStore("hr_admin_session");
