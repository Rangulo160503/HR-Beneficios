export function isSessionExpired(session) {
  if (!session || typeof session !== "object") return false;
  const raw =
    session.expiresAt ??
    session.expires_at ??
    session.expiration ??
    null;

  if (raw == null) return false;
  const expiresAt = Number(raw);
  if (!Number.isFinite(expiresAt)) return false;
  return expiresAt <= Date.now();
}
