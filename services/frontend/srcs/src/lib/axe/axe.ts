import React from 'react'
import ReactDOM from 'react-dom/client'

export function setupAxe() {
  if (import.meta.env.VITE_ENVIRONMENT === 'development') {
    import('@axe-core/react').then((axe) => {
      axe.default(React, ReactDOM, 1000)
    })
  }
}
