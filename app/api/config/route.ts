import { NextResponse } from 'next/server'
import { readConfig, writeConfig, SiteConfig } from '@/lib/config'

export const dynamic = 'force-dynamic'

// GET /api/config — retourne la configuration actuelle
export async function GET() {
  try {
    const config = readConfig()
    return NextResponse.json(config)
  } catch {
    return NextResponse.json({ error: 'Erreur lecture config' }, { status: 500 })
  }
}

// POST /api/config — met à jour la configuration
export async function POST(request: Request) {
  try {
    const body: Partial<SiteConfig> = await request.json()
    const current = readConfig()
    const updated = { ...current, ...body }
    writeConfig(updated)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur écriture config' }, { status: 500 })
  }
}
