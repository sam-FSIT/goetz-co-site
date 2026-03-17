'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { SiteConfig } from '@/lib/config'

// Mot de passe admin — à changer ici ou via variable d'environnement NEXT_PUBLIC_ADMIN_PASSWORD
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'goetz2024'

type Section = 'menu' | 'speciaux' | 'galerie'

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [activeSection, setActiveSection] = useState<Section>('menu')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [newEventId, setNewEventId] = useState('')
  const [newEventLabel, setNewEventLabel] = useState('')
  const menuFileRef = useRef<HTMLInputElement>(null)
  const specialFileRef = useRef<HTMLInputElement>(null)
  const galerieFileRef = useRef<HTMLInputElement>(null)
  const [selectedEvent, setSelectedEvent] = useState<string>('paques')

  const login = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuth(true)
      loadConfig()
    } else {
      setPasswordError(true)
      setPasswordInput('')
    }
  }

  const loadConfig = () => {
    fetch('/api/config').then(r => r.json()).then(setConfig)
  }

  const showMessage = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3500)
  }

  // Upload d'un fichier
  const upload = async (file: File, type: string, eventId?: string, eventLabel?: string) => {
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('type', type)
    if (eventId) form.append('event', eventId)
    if (eventLabel) form.append('label', eventLabel)

    const res = await fetch('/api/upload', { method: 'POST', body: form })
    const data = await res.json()
    setUploading(false)

    if (data.success) {
      showMessage('ok', 'Image uploadée avec succès !')
      loadConfig()
    } else {
      showMessage('err', data.error || 'Erreur lors de l\'upload')
    }
  }

  // Activer/désactiver la page menus spéciaux
  const toggleMenusSpeciaux = async (actif: boolean) => {
    if (!config) return
    const updated = { ...config, menusSpeciaux: { ...config.menusSpeciaux, actif } }
    await fetch('/api/config', { method: 'POST', body: JSON.stringify(updated), headers: { 'Content-Type': 'application/json' } })
    setConfig(updated)
    showMessage('ok', actif ? 'Menus spéciaux activés.' : 'Menus spéciaux désactivés.')
  }

  // Activer/désactiver un événement
  const toggleEvenement = async (eventId: string, actif: boolean) => {
    if (!config) return
    const updated = {
      ...config,
      menusSpeciaux: {
        ...config.menusSpeciaux,
        evenements: {
          ...config.menusSpeciaux.evenements,
          [eventId]: { ...config.menusSpeciaux.evenements[eventId], actif },
        },
      },
    }
    await fetch('/api/config', { method: 'POST', body: JSON.stringify(updated), headers: { 'Content-Type': 'application/json' } })
    setConfig(updated)
    showMessage('ok', `Événement ${actif ? 'activé' : 'désactivé'}.`)
  }

  // Supprimer une image de la galerie
  const supprimerGalerie = async (index: number) => {
    if (!config) return
    const updated = { ...config, galerie: config.galerie.filter((_, i) => i !== index) }
    await fetch('/api/config', { method: 'POST', body: JSON.stringify(updated), headers: { 'Content-Type': 'application/json' } })
    setConfig(updated)
    showMessage('ok', 'Photo supprimée.')
  }

  // Réinitialiser le menu de la semaine
  const supprimerMenuSemaine = async () => {
    if (!config) return
    const updated = { ...config, menuSemaine: { image: null } }
    await fetch('/api/config', { method: 'POST', body: JSON.stringify(updated), headers: { 'Content-Type': 'application/json' } })
    setConfig(updated)
    showMessage('ok', 'Menu de la semaine supprimé.')
  }

  // Ajouter un nouvel événement
  const ajouterEvenement = async () => {
    if (!config || !newEventId.trim() || !newEventLabel.trim()) return
    const id = newEventId.trim().toLowerCase().replace(/\s+/g, '-')
    const updated = {
      ...config,
      menusSpeciaux: {
        ...config.menusSpeciaux,
        evenements: {
          ...config.menusSpeciaux.evenements,
          [id]: { actif: false, label: newEventLabel.trim(), images: [] },
        },
      },
    }
    await fetch('/api/config', { method: 'POST', body: JSON.stringify(updated), headers: { 'Content-Type': 'application/json' } })
    setConfig(updated)
    setNewEventId('')
    setNewEventLabel('')
    setSelectedEvent(id)
    showMessage('ok', `Événement "${newEventLabel}" créé.`)
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ backgroundColor: 'var(--creme)' }}>
        <div className="w-full max-w-sm p-8 rounded"
             style={{ backgroundColor: 'var(--creme-sombre)', border: '1px solid var(--sable)' }}>
          <div className="text-center mb-6">
            <Image src="/logo.JPG" alt="Logo" width={80} height={80}
                   className="rounded-full object-cover mx-auto mb-3"
                   style={{ border: '2px solid var(--sable)' }} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '1.4rem' }}>
              Administration
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif" }}>
              Boucherie Goetz &amp; Co
            </p>
          </div>
          <input
            type="password"
            placeholder="Mot de passe"
            value={passwordInput}
            onChange={e => { setPasswordInput(e.target.value); setPasswordError(false) }}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full px-4 py-2 rounded mb-3 outline-none"
            style={{
              fontFamily: "'EB Garamond', serif", fontSize: '1rem',
              border: `1px solid ${passwordError ? '#8b2020' : 'var(--sable)'}`,
              backgroundColor: 'var(--creme)', color: 'var(--texte)',
            }}
          />
          {passwordError && (
            <p className="text-sm mb-3" style={{ color: '#8b2020', fontFamily: "'EB Garamond', serif" }}>
              Mot de passe incorrect.
            </p>
          )}
          <button onClick={login} className="w-full py-2 rounded transition-colors"
                  style={{ backgroundColor: 'var(--vert)', color: 'var(--creme)', fontFamily: "'EB Garamond', serif", fontSize: '1rem', cursor: 'pointer', border: 'none' }}>
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--creme)' }}>

      {/* En-tête admin */}
      <div className="px-6 py-4 flex items-center justify-between"
           style={{ backgroundColor: 'var(--vert)', borderBottom: '2px solid var(--sable)' }}>
        <div className="flex items-center gap-3">
          <Image src="/logo.JPG" alt="Logo" width={40} height={40}
                 className="rounded-full object-cover"
                 style={{ border: '2px solid var(--sable)' }} />
          <span style={{ fontFamily: "'Playfair Display', serif", color: 'var(--sable)', fontSize: '1.1rem' }}>
            Administration — Goetz &amp; Co
          </span>
        </div>
        <a href="/" style={{ color: 'var(--creme)', fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', opacity: 0.8 }}>
          ← Voir le site
        </a>
      </div>

      {/* Message de confirmation / erreur */}
      {message && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded shadow-lg"
             style={{
               backgroundColor: message.type === 'ok' ? 'var(--vert)' : '#8b2020',
               color: 'var(--creme)',
               fontFamily: "'EB Garamond', serif",
             }}>
          {message.text}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Navigation entre sections admin */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {([
            { id: 'menu',     label: '🥩 Menu de la semaine' },
            { id: 'speciaux', label: '🎉 Menus spéciaux' },
            { id: 'galerie',  label: '📷 Galerie' },
          ] as const).map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
                    className="px-5 py-2 rounded transition-colors"
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      backgroundColor: activeSection === s.id ? 'var(--vert)' : 'var(--creme-sombre)',
                      color: activeSection === s.id ? 'var(--creme)' : 'var(--texte)',
                      border: `1px solid ${activeSection === s.id ? 'var(--vert)' : 'var(--sable)'}`,
                      cursor: 'pointer',
                    }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* ========================
            MENU DE LA SEMAINE
        ======================== */}
        {activeSection === 'menu' && (
          <div>
            <h2 className="mb-6" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '1.6rem' }}>
              Menu de la semaine
            </h2>

            {config?.menuSemaine.image ? (
              <div className="mb-6">
                <p className="mb-3 font-semibold" style={{ color: 'var(--vert)', fontFamily: "'EB Garamond', serif" }}>
                  Image actuelle :
                </p>
                <img src={config.menuSemaine.image} alt="Menu actuel"
                     className="max-w-sm rounded mb-3"
                     style={{ border: '1px solid var(--sable-clair)', boxShadow: '0 2px 10px var(--ombre)' }} />
                <button onClick={supprimerMenuSemaine}
                        className="px-4 py-1.5 rounded text-sm"
                        style={{ backgroundColor: '#8b2020', color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'EB Garamond', serif" }}>
                  Supprimer
                </button>
              </div>
            ) : (
              <p className="mb-4 italic" style={{ color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif" }}>
                Aucune image de menu en ligne pour le moment.
              </p>
            )}

            <div className="p-4 rounded" style={{ backgroundColor: 'var(--creme-sombre)', border: '1px solid var(--sable-clair)' }}>
              <p className="mb-3 font-semibold" style={{ color: 'var(--vert)', fontFamily: "'EB Garamond', serif" }}>
                {config?.menuSemaine.image ? 'Remplacer le menu :' : 'Ajouter le menu :'}
              </p>
              <input ref={menuFileRef} type="file" accept="image/*" className="block mb-3"
                     style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.95rem' }} />
              <button
                disabled={uploading}
                onClick={() => {
                  const f = menuFileRef.current?.files?.[0]
                  if (f) upload(f, 'menu-semaine')
                }}
                className="px-5 py-2 rounded"
                style={{ backgroundColor: 'var(--vert)', color: 'var(--creme)', border: 'none', cursor: 'pointer', fontFamily: "'EB Garamond', serif", opacity: uploading ? 0.6 : 1 }}>
                {uploading ? 'Envoi...' : 'Mettre en ligne'}
              </button>
            </div>
          </div>
        )}

        {/* ========================
            MENUS SPÉCIAUX
        ======================== */}
        {activeSection === 'speciaux' && config && (
          <div>
            <h2 className="mb-6" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '1.6rem' }}>
              Menus spéciaux
            </h2>

            {/* Toggle global */}
            <div className="flex items-center gap-4 p-4 rounded mb-6"
                 style={{ backgroundColor: 'var(--creme-sombre)', border: '1px solid var(--sable-clair)' }}>
              <span style={{ fontFamily: "'EB Garamond', serif", color: 'var(--texte)' }}>
                Page "Menus spéciaux" visible sur le site :
              </span>
              <button
                onClick={() => toggleMenusSpeciaux(!config.menusSpeciaux.actif)}
                className="px-4 py-1.5 rounded font-semibold transition-colors"
                style={{
                  backgroundColor: config.menusSpeciaux.actif ? '#2d6a4f' : '#8b2020',
                  color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'EB Garamond', serif",
                }}>
                {config.menusSpeciaux.actif ? '✓ Activée' : '✗ Désactivée'}
              </button>
            </div>

            {/* Liste des événements */}
            <div className="mb-6">
              <h3 className="mb-4" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '1.2rem' }}>
                Événements
              </h3>

              {Object.entries(config.menusSpeciaux.evenements || {}).map(([id, ev]) => (
                <div key={id} className="p-4 rounded mb-4"
                     style={{ backgroundColor: 'var(--creme-sombre)', border: '1px solid var(--sable-clair)' }}>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <span style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '1.1rem' }}>
                      {ev.label}
                    </span>
                    <button
                      onClick={() => toggleEvenement(id, !ev.actif)}
                      className="px-3 py-1 rounded text-sm"
                      style={{
                        backgroundColor: ev.actif ? '#2d6a4f' : '#8b2020',
                        color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'EB Garamond', serif",
                      }}>
                      {ev.actif ? '✓ Actif' : '✗ Inactif'}
                    </button>
                  </div>

                  {/* Images actuelles */}
                  {ev.images.length > 0 && (
                    <div className="flex gap-3 flex-wrap mb-3">
                      {ev.images.map((src, i) => (
                        <div key={i} className="relative">
                          <img src={src} alt={`${ev.label} ${i + 1}`}
                               className="h-24 rounded object-cover"
                               style={{ border: '1px solid var(--sable-clair)' }} />
                          <span className="block text-center text-xs italic mt-1"
                                style={{ color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif" }}>
                            {i === 0 ? 'Recto' : 'Verso'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload image pour cet événement */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="file" accept="image/*"
                      id={`file-${id}`}
                      className="text-sm"
                      style={{ fontFamily: "'EB Garamond', serif" }}
                    />
                    <button
                      disabled={uploading}
                      onClick={() => {
                        const f = (document.getElementById(`file-${id}`) as HTMLInputElement)?.files?.[0]
                        if (f) upload(f, 'menus-speciaux', id, ev.label)
                      }}
                      className="px-4 py-1.5 rounded text-sm"
                      style={{ backgroundColor: 'var(--vert)', color: 'var(--creme)', border: 'none', cursor: 'pointer', fontFamily: "'EB Garamond', serif", opacity: uploading ? 0.6 : 1 }}>
                      Ajouter une image
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Créer un nouvel événement */}
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--creme-sombre)', border: '1px solid var(--sable-clair)' }}>
              <h3 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '1.1rem' }}>
                Créer un nouvel événement
              </h3>
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif" }}>
                    Identifiant (ex: noel)
                  </label>
                  <input type="text" value={newEventId} onChange={e => setNewEventId(e.target.value)}
                         placeholder="noel"
                         className="px-3 py-1.5 rounded"
                         style={{ fontFamily: "'EB Garamond', serif", border: '1px solid var(--sable)', backgroundColor: 'var(--creme)', color: 'var(--texte)', width: '140px' }} />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif" }}>
                    Label affiché (ex: 🎄 Noël)
                  </label>
                  <input type="text" value={newEventLabel} onChange={e => setNewEventLabel(e.target.value)}
                         placeholder="🎄 Noël"
                         className="px-3 py-1.5 rounded"
                         style={{ fontFamily: "'EB Garamond', serif", border: '1px solid var(--sable)', backgroundColor: 'var(--creme)', color: 'var(--texte)', width: '180px' }} />
                </div>
                <button onClick={ajouterEvenement} disabled={!newEventId || !newEventLabel}
                        className="px-4 py-1.5 rounded"
                        style={{ backgroundColor: 'var(--vert)', color: 'var(--creme)', border: 'none', cursor: 'pointer', fontFamily: "'EB Garamond', serif", opacity: (!newEventId || !newEventLabel) ? 0.5 : 1 }}>
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================
            GALERIE
        ======================== */}
        {activeSection === 'galerie' && config && (
          <div>
            <h2 className="mb-6" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '1.6rem' }}>
              Galerie photo
            </h2>

            {/* Upload */}
            <div className="p-4 rounded mb-6"
                 style={{ backgroundColor: 'var(--creme-sombre)', border: '1px solid var(--sable-clair)' }}>
              <p className="mb-3 font-semibold" style={{ color: 'var(--vert)', fontFamily: "'EB Garamond', serif" }}>
                Ajouter une photo :
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <input ref={galerieFileRef} type="file" accept="image/*" className="text-sm"
                       style={{ fontFamily: "'EB Garamond', serif" }} />
                <button
                  disabled={uploading}
                  onClick={() => {
                    const f = galerieFileRef.current?.files?.[0]
                    if (f) upload(f, 'galerie')
                  }}
                  className="px-5 py-2 rounded"
                  style={{ backgroundColor: 'var(--vert)', color: 'var(--creme)', border: 'none', cursor: 'pointer', fontFamily: "'EB Garamond', serif", opacity: uploading ? 0.6 : 1 }}>
                  {uploading ? 'Envoi...' : 'Ajouter'}
                </button>
              </div>
            </div>

            {/* Grille photos */}
            {config.galerie.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {config.galerie.map((src, i) => (
                  <div key={i} className="relative group rounded overflow-hidden"
                       style={{ border: '1px solid var(--sable-clair)', aspectRatio: '4/3' }}>
                    <img src={src} alt={`Photo ${i + 1}`}
                         className="w-full h-full object-cover" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                         style={{ background: 'rgba(28, 58, 53, 0.7)' }}>
                      <button onClick={() => supprimerGalerie(i)}
                              className="px-3 py-1.5 rounded text-sm"
                              style={{ backgroundColor: '#8b2020', color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'EB Garamond', serif" }}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic text-center py-8"
                 style={{ color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif", border: '2px dashed var(--sable)', borderRadius: '4px' }}>
                Aucune photo dans la galerie.
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
