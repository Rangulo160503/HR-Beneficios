export class LocalSessionStore {
  constructor(key, storage = typeof window !== "undefined" ? window.localStorage : null) {
    this.key = key;
    this.storage = storage;
  }

  getSession() {
    if (!this.storage) return null;
    try {
      const raw = this.storage.getItem(this.key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      console.error("No se pudo leer sesión", error);
      return null;
    }
  }

  setSession(session) {
    if (!this.storage) return;
    try {
      this.storage.setItem(this.key, JSON.stringify(session));
    } catch (error) {
      console.error("No se pudo guardar sesión", error);
    }
  }

  save(session) {
    this.setSession(session);
  }

  clearSession() {
    if (!this.storage) return;
    try {
      this.storage.removeItem(this.key);
    } catch (error) {
      console.error("No se pudo limpiar sesión", error);
    }
  }
}
