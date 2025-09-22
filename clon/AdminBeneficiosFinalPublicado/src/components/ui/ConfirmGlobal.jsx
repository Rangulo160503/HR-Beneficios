// src/ui/ConfirmGlobal.jsx
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ConfirmCtx = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false, msg: "", resolve: null, opts: {} });
  const root = useRef(null);

  const confirm = useCallback((msg, opts = {}) => {
    return new Promise((resolve) => setState({ open: true, msg, resolve, opts }));
  }, []);

  const onClose = useCallback((ok) => {
    setState(s => {
      s.resolve?.(!!ok);
      return { open: false, msg: "", resolve: null, opts: {} };
    });
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmCtx.Provider value={value}>
      {children}
      {state.open && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-2xl bg-[#111] text-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">{state.opts.title ?? "Confirmar"}</h3>
            <p className="text-sm opacity-90 mb-5">{state.msg}</p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10"
                onClick={() => onClose(false)}
              >
                {state.opts.cancelText ?? "Cancelar"}
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-[var(--brand)] hover:opacity-90"
                onClick={() => onClose(true)}
                autoFocus
              >
                {state.opts.okText ?? "Aceptar"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </ConfirmCtx.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmCtx);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx.confirm;
}

// (opcional) helper estático para sitios no-React o fuera de hooks
export let confirmAsync = async () => { throw new Error("Mount <ConfirmProvider> first"); };
export function bindConfirm(fn) { confirmAsync = fn; }
