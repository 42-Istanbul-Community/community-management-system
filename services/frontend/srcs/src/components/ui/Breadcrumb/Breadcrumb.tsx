import { Fragment } from 'react'
import { Link } from 'react-router'

import type { BreadcrumbProps } from './Breadcrumb.types'
import { ChevronRight } from 'lucide-react'

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Sayfa yolu">
      <ol className="text-caption flex flex-wrap items-center gap-1.5 text-neutral-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={item.label}>
              <li>
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    className="hover:text-primary-700 underline-offset-4 transition-colors hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className="text-neutral-700"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
