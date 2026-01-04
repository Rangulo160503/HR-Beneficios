export async function loginWithCredentials({
  authGateway,
  sessionStore,
  usuario,
  password,
  normalizeSession,
  options,
} = {}) {
  try {
    const data = await authGateway.loginWithCredentials({
      usuario,
      password,
      ...(options || {}),
    });
    const session = normalizeSession ? normalizeSession(data, { usuario }) : data?.session ?? data;

    if (sessionStore?.save) {
      sessionStore.save(session);
    } else {
      sessionStore?.setSession?.(session);
    }

    return { ok: true, session, data };
  } catch (error) {
    return { ok: false, error, message: error?.message };
  }
}
