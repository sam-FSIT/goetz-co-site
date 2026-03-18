import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { readConfig, writeConfig } from '@/lib/config'

// POST /api/upload
// Paramètres FormData :
//   - file   : le fichier image
//   - type   : 'menu-semaine' | 'menus-speciaux' | 'galerie'
//   - event  : (optionnel) identifiant de l'événement pour menus-speciaux (ex: 'paques')
//   - label  : (optionnel) label de l'événement pour menus-speciaux

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string
    const eventId = formData.get('event') as string | null
    const eventLabel = formData.get('label') as string | null

    if (!file || !type) {
      return NextResponse.json({ error: 'Fichier ou type manquant' }, { status: 400 })
    }

    // Sécuriser le nom de fichier
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    if (!allowedExts.includes(ext)) {
      return NextResponse.json({ error: 'Format non autorisé' }, { status: 400 })
    }

    const timestamp = Date.now()
    const filename = `uploads/${type}/${timestamp}.${ext}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const blob = await put(filename, buffer, { access: 'public' })
    const publicPath = blob.url

    const config = await readConfig()

    // Mettre à jour la config selon le type
    if (type === 'menu-semaine') {
      config.menuSemaine.image = publicPath

    } else if (type === 'menus-speciaux' && eventId) {
      if (!config.menusSpeciaux.evenements[eventId]) {
        config.menusSpeciaux.evenements[eventId] = {
          actif: true,
          label: eventLabel || eventId,
          images: [],
        }
      }
      config.menusSpeciaux.evenements[eventId].images.push(publicPath)

    } else if (type === 'galerie') {
      config.galerie.push(publicPath)
    }

    await writeConfig(config)

    return NextResponse.json({ success: true, path: publicPath })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
