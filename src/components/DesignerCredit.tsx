import { content } from '../content'
import type { Language } from '../types'

const signatureSrc = '/images/designer/tarik-bamarouf-signature.png'
const signatureUrl = 'https://tarikbamarouf.com/'

export function DesignerCredit({ language }: { language: Language }) {
  return (
    <div className="designer-credit">
      <p>{content[language].footer.designerCredit}</p>
      <a
        href={signatureUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Tarik Bamarouf — Digital Experiences"
      >
        <img src={signatureSrc} width="2172" height="724" alt="Tarik Bamarouf" loading="lazy" decoding="async" />
      </a>
    </div>
  )
}
