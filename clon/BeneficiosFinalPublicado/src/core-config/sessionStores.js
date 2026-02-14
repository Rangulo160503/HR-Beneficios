import { LocalSessionStore } from "../core/infrastructure/session/LocalSessionStore";

export const clientSessionStore = new LocalSessionStore("hr_client_session");
