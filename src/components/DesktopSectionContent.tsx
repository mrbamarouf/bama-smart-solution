import type { ReactNode } from 'react'

type DesktopSectionContentProps = {
  index: number
  indexClassName: string
  indexRowClassName?: string
  indexAdornment?: ReactNode
  children: ReactNode
}

/** Keeps the index in the same normal-flow, direction-aware column as the copy. */
export function DesktopSectionContent({
  index,
  indexClassName,
  indexRowClassName,
  indexAdornment,
  children,
}: DesktopSectionContentProps) {
  const number = (
    <div className={`desktop-section-index ${indexClassName}`}>
      <bdi dir="ltr">{String(index).padStart(2, '0')}</bdi>
    </div>
  )

  return (
    <div className="desktop-section-content">
      {indexRowClassName ? (
        <div className={indexRowClassName}>{number}{indexAdornment}</div>
      ) : number}
      {children}
    </div>
  )
}
