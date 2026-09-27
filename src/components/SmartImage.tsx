import { useState } from 'react'

type SmartImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackLabel?: string
}

export function SmartImage({ fallbackLabel = 'BAMA', className = '', src, ...props }: SmartImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={props.alt}>
        <span>{fallbackLabel}</span>
      </div>
    )
  }

  return <img className={className} src={src} {...props} onError={() => setFailed(true)} />
}
