const normalizeTokenSession = ({ token, response, defaultRoles = [] } = {}) => {
  const proveedor = response?.proveedor || response?.provider || null;
  const proveedorId =
    proveedor?.proveedorId ||
    proveedor?.ProveedorId ||
    proveedor?.id ||
    proveedor?.Id ||
    response?.proveedorId ||
    response?.ProveedorId;

  if (!proveedorId) return null;

  return {
    token,
    proveedorId,
    user: proveedor,
    roles: defaultRoles,
  };
};

export async function loginWithToken({
  authGateway,
  sessionStore,
  token,
  defaultRoles = [],
  options,
} = {}) {
  if (!authGateway?.loginWithToken) {
    throw new Error("AuthGateway.loginWithToken not available");
  }

  try {
    const response = await authGateway.loginWithToken({ token, options });

    if (response?.ok === false) {
      return { ok: false, message: response?.mensaje || "Token inválido." };
    }

    const session = normalizeTokenSession({ token, response, defaultRoles });
    if (!session) {
      return { ok: false, message: "Token inválido." };
    }

    sessionStore?.save?.(session);
    return { ok: true, session, response };
  } catch (error) {
    return { ok: false, message: error?.message || "Token inválido.", error };
  }
}
