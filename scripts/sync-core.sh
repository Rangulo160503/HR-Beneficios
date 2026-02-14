#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CORE_SRC="$ROOT_DIR/frontend-core"

APPS=(
  "$ROOT_DIR/clon/AdminBeneficiosFinalPublicado"
  "$ROOT_DIR/clon/BeneficiosFinalPublicado"
  "$ROOT_DIR/clon/InicioBeneficiosFinalPublicado"
  "$ROOT_DIR/clon/ProveedorBeneficiosFinalPublicado"
)

if [[ ! -d "$CORE_SRC" ]]; then
  echo "frontend-core no existe en $CORE_SRC" >&2
  exit 1
fi

for app in "${APPS[@]}"; do
  target="$app/src/core"

  if [[ ! -d "$app/src" ]]; then
    echo "No se encontró src en $app" >&2
    exit 1
  fi

  echo "Sincronizando core en $target"
  rm -rf "$target"
  cp -R "$CORE_SRC" "$target"
 done

 echo "Core sincronizado en todas las apps."
