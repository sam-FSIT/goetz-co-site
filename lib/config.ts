import fs from 'fs'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'data', 'config.json')

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

export function readConfig(): SiteConfig {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
  return JSON.parse(raw)
}

export function writeConfig(config: SiteConfig): void {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')
}
