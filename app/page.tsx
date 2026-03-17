'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { SiteConfig } from '@/lib/config'

type Tab = 'accueil' | 'menu' | 'speciaux' | 'galerie' | 'horaires et contact'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('accueil')
  const [config, setConfig] = useState<SiteConfig | null>(null)

  useEffect(() => {
    fetch('/api/config', { cache: 'no-store' })
      .then(r => r.json())
      .then(setConfig)
  }, [])

  return (
    <>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Image de fond — fixe, couvre toutes les pages */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'url(/hero-bg.jpg)',
        backgroundSize: 'contain',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.15,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <main style={{
        position: 'relative',
        zIndex: 1,
        marginTop: '70px',
        backgroundColor: 'transparent',
        minHeight: 'calc(100vh - 70px)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>

        {/* ==============================
            ONGLET 1 — ACCUEIL
        ============================== */}
        {activeTab === 'accueil' && (
          <div className="fade-in" style={{ width: '100%', maxWidth: '960px', padding: '3rem 1.5rem' }}>

            {/* Hero */}
            <div className="flex flex-col items-center text-center pb-8">
              <Image
                src="/logo.JPG"
                alt="Logo Boucherie Goetz & Co"
                width={240}
                height={240}
                className="rounded-full object-cover mb-8"
                style={{ border: '4px solid var(--sable)', boxShadow: '0 6px 30px var(--ombre)' }}
              />
              <h1 className="font-display text-5xl md:text-6xl font-bold tracking-wide"
                  style={{ color: 'var(--vert)', fontFamily: "'Playfair Display', Georgia, serif" }}>
                Goetz <span style={{ color: 'var(--sable)', fontStyle: 'italic' }}>&</span> Co
              </h1>
              <p className="mt-3 text-lg uppercase"
                 style={{ color: 'var(--texte-doux)', letterSpacing: '0.12em', fontFamily: "'EB Garamond', serif" }}>
                Boucherie &nbsp;·&nbsp; Charcuterie &nbsp;·&nbsp; Traiteur
              </p>
            </div>

            <div className="separateur"><span>✦</span></div>

            {/* Présentation */}
            <div className="my-8 max-w-2xl mx-auto">
              <p className="text-lg leading-relaxed italic"
                 style={{
                   fontFamily: "'EB Garamond', serif",
                   color: 'var(--texte-doux)',
                   borderLeft: '3px solid var(--sable)',
                   paddingLeft: '1.5rem',
                 }}>
                {config?.accueil?.texte || "Chez Goetz & Co, nous vous proposons une sélection de viandes soigneusement choisies auprès de producteurs locaux. Artisans bouchers depuis plusieurs générations, nous mettons notre savoir-faire au service de votre table — que ce soit pour le quotidien ou les grandes occasions. Venez nous rendre visite à Hochfelden !"}
              </p>
            </div>

            <div className="separateur"><span>✦</span></div>

            {/* Informations pratiques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
              {[
                { icon: '📍', label: 'Adresse', content: '3 place du Général Koenig\n67270 HOCHFELDEN' },
                { icon: '📞', label: 'Téléphone', content: '06 52 32 46 99', href: 'tel:0652324699' },
                { icon: '✉️', label: 'Email', content: 'goetzandco@outlook.fr', href: 'mailto:goetzandco@outlook.fr' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-4 rounded"
                     style={{ backgroundColor: 'var(--creme-sombre)', border: '1px solid var(--sable-clair)' }}>
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <strong className="block text-xs uppercase tracking-widest mb-1"
                            style={{ color: 'var(--vert)', fontFamily: "'Playfair Display', serif" }}>
                      {item.label}
                    </strong>
                    {item.href ? (
                      <a href={item.href}
                         style={{ color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif", fontSize: '1rem' }}>
                        {item.content}
                      </a>
                    ) : (
                      <p className="whitespace-pre-line"
                         style={{ color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif", fontSize: '1rem' }}>
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bannière décorative */}
            <div className="flex items-center gap-4 mt-8 px-6 py-4 rounded"
                 style={{ backgroundColor: 'var(--vert)' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--sable)', opacity: 0.5 }} />
              <p className="text-center italic text-sm"
                 style={{ color: 'var(--creme)', fontFamily: "'EB Garamond', serif", letterSpacing: '0.04em' }}>
                Artisans bouchers à Hochfelden depuis plusieurs générations
              </p>
              <div style={{ flex: 1, height: '1px', background: 'var(--sable)', opacity: 0.5 }} />
            </div>

          </div>
        )}

        {/* ==============================
            ONGLET 2 — MENU DE LA SEMAINE
        ============================== */}
        {activeTab === 'menu' && (
          <div className="fade-in" style={{ width: '100%', maxWidth: '960px', padding: '3rem 1.5rem' }}>
            <div className="text-center mb-8">
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '2.2rem', fontWeight: 700 }}>
                Notre menu de la semaine
              </h2>
              <div className="separateur"><span>✦</span></div>
            </div>

            {config?.menuSemaine.texte && (
              <p className="text-center mb-6 text-lg"
                 style={{ fontFamily: "'EB Garamond', serif", color: 'var(--texte-doux)', fontStyle: 'italic', borderLeft: '3px solid var(--sable)', paddingLeft: '1rem', textAlign: 'left', maxWidth: '600px', margin: '0 auto 1.5rem', whiteSpace: 'pre-wrap' }}>
                {config.menuSemaine.texte}
              </p>
            )}
            {config?.menuSemaine.image ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={config.menuSemaine.image}
                  alt="Menu de la semaine"
                  className="w-full max-w-3xl rounded"
                  style={{ boxShadow: '0 6px 30px var(--ombre)', border: '1px solid var(--sable-clair)' }}
                />
                <p className="text-center italic"
                   style={{ color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif" }}>
                  Le menu est renouvelé chaque semaine. Renseignez-vous en boutique ou par téléphone pour les commandes.
                </p>
              </div>
            ) : (
              <div className="text-center py-16 rounded"
                   style={{ border: '2px dashed var(--sable)', color: 'var(--texte-doux)' }}>
                <p className="text-5xl mb-4">🥩</p>
                <p className="italic text-lg" style={{ fontFamily: "'EB Garamond', serif" }}>
                  Le menu de la semaine n'a pas encore été mis en ligne.
                </p>
                <p className="text-base mt-2" style={{ fontFamily: "'EB Garamond', serif" }}>
                  Contactez-nous au{' '}
                  <a href="tel:0652324699" style={{ color: 'var(--vert)' }}>06 52 32 46 99</a>
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==============================
            ONGLET 3 — MENUS SPÉCIAUX
        ============================== */}
        {activeTab === 'speciaux' && (
          <div className="fade-in" style={{ width: '100%', maxWidth: '960px', padding: '3rem 1.5rem' }}>
            <div className="text-center mb-8">
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '2.2rem', fontWeight: 700 }}>
                Nos offres spéciales
              </h2>
              <div className="separateur"><span>✦</span></div>
            </div>

            {config?.menusSpeciaux.texte && (
              <p className="text-center mb-6 text-lg"
                 style={{ fontFamily: "'EB Garamond', serif", color: 'var(--texte-doux)', fontStyle: 'italic', borderLeft: '3px solid var(--sable)', paddingLeft: '1rem', textAlign: 'left', maxWidth: '600px', margin: '0 auto 1.5rem', whiteSpace: 'pre-wrap' }}>
                {config.menusSpeciaux.texte}
              </p>
            )}

            {(() => {
              if (!config?.menusSpeciaux.actif) {
                return (
                  <div className="text-center py-16 rounded italic"
                       style={{ border: '2px dashed var(--sable)', color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif" }}>
                    <p className="text-lg">Aucun menu spécial en cours pour le moment.</p>
                    <p className="mt-2 text-base">Revenez bientôt ou contactez-nous&nbsp;!</p>
                  </div>
                )
              }
              const evenementsActifs = Object.entries(config.menusSpeciaux.evenements || {})
                .filter(([, ev]) => ev.actif)

              if (evenementsActifs.length === 0) {
                return (
                  <div className="text-center py-16 rounded italic"
                       style={{ border: '2px dashed var(--sable)', color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif" }}>
                    <p className="text-lg">Aucun menu spécial en cours pour le moment.</p>
                    <p className="mt-2 text-base">Revenez bientôt ou contactez-nous&nbsp;!</p>
                  </div>
                )
              }

              return evenementsActifs.map(([id, ev]) => (
                <div key={id} className="mb-12">
                  <h3 className="text-center mb-6"
                      style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '1.7rem' }}>
                    {ev.label}
                  </h3>
                  <div className={`grid gap-4 ${ev.images.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {ev.images.map((src, i) => (
                      <div key={i} className="text-center">
                        <img
                          src={src}
                          alt={`${ev.label} — ${i === 0 ? 'Recto' : 'Verso'}`}
                          className="w-full rounded mx-auto"
                          style={{ maxWidth: '500px', boxShadow: '0 4px 20px var(--ombre)', border: '1px solid var(--sable-clair)' }}
                        />
                        {ev.images.length > 1 && (
                          <p className="mt-2 text-sm italic"
                             style={{ color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif" }}>
                            {i === 0 ? 'Recto' : 'Verso'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            })()}
          </div>
        )}

        {/* ==============================
            ONGLET 4 — GALERIE
        ============================== */}
        {activeTab === 'galerie' && (
          <div className="fade-in" style={{ width: '100%', maxWidth: '960px', padding: '3rem 1.5rem' }}>
            <div className="text-center mb-8">
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '2.2rem', fontWeight: 700 }}>
                Nos moments &amp; événements
              </h2>
              <div className="separateur"><span>✦</span></div>
            </div>

            {config?.galerie.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {config.galerie.map((src, i) => (
                  <div key={i} className="relative overflow-hidden rounded group"
                       style={{ border: '1px solid var(--sable-clair)', aspectRatio: '4/3' }}>
                    <img
                      src={src}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                         style={{ background: 'rgba(28, 58, 53, 0.55)' }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded"
                   style={{ border: '2px dashed var(--sable)', color: 'var(--texte-doux)' }}>
                <p className="text-5xl mb-4 opacity-50">📷</p>
                <p className="italic text-lg" style={{ fontFamily: "'EB Garamond', serif" }}>
                  Les photos de nos événements arrivent bientôt&nbsp;!
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==============================
            ONGLET 5 — CONTACT
        ============================== */}
        {activeTab === 'horaires et contact' && (
          <div className="fade-in" style={{ width: '100%', maxWidth: '960px', padding: '3rem 1.5rem' }}>
            <div className="text-center mb-8">
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '2.2rem', fontWeight: 700 }}>
                Nous contacter
              </h2>
              <div className="separateur"><span>✦</span></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="mb-3 pb-2"
                      style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '1.2rem', borderBottom: '1px solid var(--sable-clair)' }}>
                    Coordonnées
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {[
                      { icon: '📍', content: '3 place du Général Koenig\n67270 HOCHFELDEN' },
                      { icon: '📞', content: '06 52 32 46 99', href: 'tel:0652324699' },
                      { icon: '✉️', content: 'goetzandco@outlook.fr', href: 'mailto:goetzandco@outlook.fr' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3"
                          style={{ color: 'var(--texte-doux)', fontFamily: "'EB Garamond', serif", fontSize: '1rem' }}>
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        {item.href ? (
                          <a href={item.href} style={{ color: 'var(--vert)' }}>{item.content}</a>
                        ) : (
                          <span className="whitespace-pre-line">{item.content}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 pb-2"
                      style={{ fontFamily: "'Playfair Display', serif", color: 'var(--vert)', fontSize: '1.2rem', borderBottom: '1px solid var(--sable-clair)' }}>
                    Horaires d'ouverture
                  </h3>
                  <table className="w-full" style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.95rem' }}>
                    <tbody>
                      {(config?.horaires || []).map(row => {
                        const ferme = row.horaire.toLowerCase() === 'fermé'
                        return (
                        <tr key={row.jour} style={{ borderBottom: '1px solid var(--sable-clair)' }}>
                          <td className="py-1.5 pr-4 font-semibold w-28"
                              style={{ color: ferme ? '#8b2020' : 'var(--vert)' }}>
                            {row.jour}
                          </td>
                          <td className="py-1.5"
                              style={{ color: ferme ? '#8b2020' : 'var(--texte-doux)', fontStyle: ferme ? 'italic' : 'normal' }}>
                            {row.horaire}
                          </td>
                        </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded overflow-hidden"
                   style={{ border: '1px solid var(--sable-clair)', boxShadow: '0 4px 20px var(--ombre)' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2648.5!2d7.5697548!3d48.758195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4796bd2f4f4baab1:0xdc90c691288b215b!2sGoetz+%26+Co!5e0!3m2!1sfr!2sfr!4v1"
                  width="100%"
                  height="400"
                  style={{ border: 'none', display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  title="Localisation Boucherie Goetz & Co"
                />
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="text-center py-8"
              style={{ backgroundColor: 'var(--vert)', borderTop: '2px solid var(--sable)', position: 'relative', zIndex: 1 }}>
        <Image src="/logo.JPG" alt="Logo" width={60} height={60}
               className="rounded-full object-cover mx-auto mb-3"
               style={{ border: '2px solid var(--sable)', opacity: 0.9 }} />
        <p style={{ fontFamily: "'Playfair Display', serif", color: 'var(--sable)', fontSize: '1.2rem' }}>
          Goetz &amp; Co
        </p>
        <p className="text-sm italic mt-1"
           style={{ color: 'var(--creme)', opacity: 0.7, fontFamily: "'EB Garamond', serif" }}>
          Boucherie · Charcuterie · Traiteur · Hochfelden
        </p>
        <p className="text-xs mt-2"
           style={{ color: 'var(--creme)', opacity: 0.4, fontFamily: "'EB Garamond', serif" }}>
          © {new Date().getFullYear()} Goetz &amp; Co — Tous droits réservés
        </p>
      </footer>
    </>
  )
}
