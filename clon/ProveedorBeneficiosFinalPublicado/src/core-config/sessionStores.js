import { LocalSessionStore } from "../core/infrastructure/session/LocalSessionStore";

export const providerSessionStore = new LocalSessionStore("hr_session");
