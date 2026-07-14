import dynamic from 'next/dynamic'

const PreferencesPage = dynamic(() => import('./PreferencesPage'), {
  ssr: false,
})

export default PreferencesPage