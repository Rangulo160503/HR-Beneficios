const normalizeTokenSession = ({ response, defaultRoles = [] } = {}) => {
  const proveedorId =
    response?.proveedorId ||
    response?.ProveedorId ||
    response?.proveedor?.proveedorId ||
    response?.proveedor?.ProveedorId ||
    response?.provider?.id ||
    response?.provider?.Id;

  if (!proveedorId) return null;

  const accessToken =
    response?.access_token ||
    response?.Access_Token ||
    response?.accessToken ||
    response?.token ||
    null;

  if (!accessToken) return null;

  const tokenType = response?.token_type || response?.Token_Type || "Bearer";
  const role = response?.role || response?.Role || "Proveedor";

  return {
    role,
    proveedorId,
    proveedorNombre: response?.nombre || response?.Nombre || "",
    access_token: accessToken,
    token_type: tokenType,
    expires_at: response?.expires_at || response?.Expires_At || null,
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

    const session = normalizeTokenSession({ response, defaultRoles });
    if (!session) {
      return { ok: false, message: "Token inválido." };
    }

    sessionStore?.save?.(session);
    return { ok: true, session, response };
  } catch (error) {
    return { ok: false, message: error?.message || "Token inválido.", error };
  }
}
