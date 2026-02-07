"use client"

import { createPortal } from "react-dom"

export default function Portal({ children }: { children: React.ReactNode }) {
  const portalEl = typeof document !== "undefined" ? document.getElementById("portal") : null

  if (!portalEl) return null

  return createPortal(children, portalEl)
}
