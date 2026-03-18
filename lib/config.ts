import { kv } from '@vercel/kv'

const CONFIG_KEY = 'site-config'

export interface SiteConfig {
  menuSemaine: { image: string | null; texte?: string }
  menusSpeciaux: {
    actif: boolean
    texte?: string
    evenements: {
      [key: string]: {
        actif: boolean
        label: string
        images: string[]
      }
    }
  }
  galerie: string[]
  accueil: { texte: string }
  horaires: { jour: string; horaire: string }[]
}

export async function readConfig(): Promise<SiteConfig> {
  const config = await kv.get<SiteConfig>(CONFIG_KEY)
  if (!config) throw new Error('Config not found in KV store')
  return config
}

export async function writeConfig(config: SiteConfig): Promise<void> {
  await kv.set(CONFIG_KEY, config)
}
