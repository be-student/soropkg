import type { DocsThemeConfig } from 'nextra-theme-docs'
import { useConfig } from 'nextra-theme-docs'

const StellarLogo = () => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
    <span style={{
      width: 26, height: 26, borderRadius: 4,
      background: '#FDDA24',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'Lora, Georgia, serif', fontWeight: 700, fontSize: 14, color: '#0F0F0F', lineHeight: '1' }}>S</span>
    </span>
    <span style={{ fontWeight: 500, fontSize: 15, color: '#F6F7F8' }}>soropkg</span>
  </span>
)

const config: DocsThemeConfig = {
  logo: <StellarLogo />,
  project: { link: 'https://github.com/soropkg/soropkg' },
  docsRepositoryBase: 'https://github.com/soropkg/soropkg/tree/main/packages/docs',
  head() {
    const { frontMatter, title } = useConfig()
    return (
      <>
        <title>{title ? `${title} — soropkg docs` : 'soropkg docs'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={frontMatter.description || 'soropkg — npm for Soroban smart contracts on Stellar'} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@300;400;500;600&family=Inconsolata:wght@400;500&display=swap" rel="stylesheet" />
      </>
    )
  },
  sidebar: { defaultMenuCollapseLevel: 1 },
  toc: { backToTop: true },
  editLink: { content: 'Edit this page on GitHub →' },
  feedback: { content: 'Question? Give us feedback →' },
  footer: {
    content: (
      <span style={{ fontSize: 13, color: '#7A7669' }}>
        © {new Date().getFullYear()} soropkg — Built for the{' '}
        <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" style={{ color: '#FDDA24', textDecoration: 'none' }}>Stellar</a>{' '}
        ecosystem
      </span>
    ),
  },
  banner: {
    key: 'soropkg-beta',
    content: (
      <span style={{ fontSize: 13 }}>
        soropkg is in active development —{' '}
        <a href="https://github.com/soropkg/soropkg" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Star on GitHub</a>
      </span>
    ),
  },
}

export default config
