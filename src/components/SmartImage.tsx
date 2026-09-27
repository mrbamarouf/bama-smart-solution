import { useState } from 'react'

type SmartImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackLabel?: string
}

export function SmartImage({ fallbackLabel = 'BAMA', className = '', ...props }: SmartImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={props.alt}>
        <span>{fallbackLabel}</span>
      </div>
    )
  }

  return <img className={className} {...props} onError={() => setFailed(true)} />
}
