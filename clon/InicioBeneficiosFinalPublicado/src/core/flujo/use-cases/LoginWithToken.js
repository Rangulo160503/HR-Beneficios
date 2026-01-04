export async function loginWithToken({
  authGateway,
  sessionStore,
  token,
  normalizeSession,
  options,
} = {}) {
  try {
    const data = await authGateway.loginWithToken({
      token,
      ...(options || {}),
    });
    const session = normalizeSession ? normalizeSession(data, { token }) : data?.session ?? data;

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
