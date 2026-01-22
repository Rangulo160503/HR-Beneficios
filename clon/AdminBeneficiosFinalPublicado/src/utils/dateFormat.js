const formatter = new Intl.DateTimeFormat("es-CR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export const formatFechaLargaES = (value) => {
  if (!value) return "";
  const normalized = String(value).trim();
  if (!normalized) return "";
  const dateValue = normalized.length === 10 ? `${normalized}T00:00:00` : normalized;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return formatter.format(date);
};
