# Admin cleanup import map (legacy roots)

Scan scope: `clon/AdminBeneficiosFinalPublicado/src` (`.js/.jsx/.ts/.tsx`).

## Summary
- Legacy roots analyzed: `src/context`, `src/features`, `src/hooks`, `src/ui/hooks`, `src/services`, `src/utils`.
- Import map built from static imports under `src/`.

## src/context
- References: 0
- Importers: _none_
- Recommendation: DELETE (root is absent).

## src/features
- References: 0
- Importers: _none_
- Recommendation: DELETE (root is absent).

## src/ui/hooks
- References: 0
- Importers: _none_
- Recommendation: DELETE (root is absent).

## src/hooks
| Legacy path | Importing files | Reference count | Recommendation |
| --- | --- | ---:| --- |
| `src/hooks/useAprobaciones.js` | `components/AdminShell/pages/AprobacionesPage.jsx` | 1 | KEEP |
| `src/hooks/useBeneficios.js` | `components/AdminShell/useAdminShell.js` | 1 | KEEP |
| `src/hooks/useCatalogos.js` | `components/AdminShell/useAdminShell.js` | 1 | KEEP |
| `src/hooks/useBeneficioImagenes.js` | `components/beneficio/FullForm.jsx` | 1 | KEEP |
| `src/hooks/useBenefitCardImage.js` | `components/beneficio/CardBeneficio.jsx` | 1 | KEEP |

## src/services
| Legacy path | Importing files | Reference count | Recommendation |
| --- | --- | ---:| --- |
| `src/services/adminApi.js` | `components/AdminShell/AdminMain.jsx`, `components/AdminShell/modals/CategoriaEnUsoModal.jsx`, `components/AdminShell/pages/BenefitEditModal.jsx`, `components/AdminShell/pages/ProveedoresPage.jsx`, `components/beneficio/FullForm.jsx`, `hooks/useAprobaciones.js`, `hooks/useBeneficioImagenes.js`, `hooks/useCatalogos.js` | 8 | KEEP |
| `src/services/authApi.js` | `pages/AdminLogin.jsx` | 1 | KEEP |
| `src/services/apiBase.js` | `core-config/gateways.js`, `services/adminApi.js`, `services/authApi.js` | 3 | KEEP |
| `src/services/infoBoardService.js` | `components/AdminShell/pages/InfoBoardPage.jsx` | 1 | KEEP |
| `src/services/api.js` | _none_ | 0 | DELETE (removed) |

## src/utils
| Legacy path | Importing files | Reference count | Recommendation |
| --- | --- | ---:| --- |
| `src/utils/badge.js` | `components/AdminShell/pages/ProveedoresPage.jsx`, `hooks/useCatalogos.js` | 2 | KEEP |
| `src/utils/image.js` | `components/beneficio/FullForm.jsx` | 1 | KEEP |
| `src/utils/text.js` | `components/sidebar/NavItem.jsx`, `components/sidebar/SubNavItem.jsx` | 2 | KEEP |

## Duplicates/legacy artifacts removed
- `components/AdminShell/hooks/useAprobaciones.js` (unused duplicate).
- `components/AdminShell/services/adminApi.js` (unused duplicate; only imported by the removed hook).

