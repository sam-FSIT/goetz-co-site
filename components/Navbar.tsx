'use client'

import Image from 'next/image'
import { useState } from 'react'

type Tab = 'accueil' | 'menu' | 'speciaux' | 'galerie' | 'contact'

interface NavbarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'accueil',  label: 'Accueil' },
  { id: 'menu',     label: 'Menu de la semaine' },
  { id: 'speciaux', label: 'Menus spéciaux' },
  { id: 'galerie',  label: 'Galerie' },
  { id: 'contact',  label: 'Contact' },
]

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleTabClick = (tab: Tab) => {
    onTabChange(tab)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav style={{ backgroundColor: 'var(--vert)', borderBottom: '2px solid var(--sable)' }}
         className="fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="max-w-5xl mx-auto px-4 h-[70px] flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => handleTabClick('accueil')} className="flex-shrink-0">
          <Image
            src="/logo.JPG"
            alt="Logo Goetz & Co"
            width={48}
            height={48}
            className="rounded-full object-cover"
            style={{ border: '2px solid var(--sable)' }}
          />
        </button>

        {/* Navigation desktop — centrée */}
        <ul className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button
                onClick={() => handleTabClick(tab.id)}
                className="px-4 py-1.5 text-sm tracking-wide transition-all duration-200"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  color: activeTab === tab.id ? 'var(--sable)' : 'var(--creme)',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid var(--sable)' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  padding: '0.4rem 1rem',
                }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Spacer pour équilibrer le logo */}
        <div className="hidden md:block w-[48px]" />

        {/* Hamburger mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span style={{ background: 'var(--creme)' }} className="block w-6 h-0.5 rounded" />
          <span style={{ background: 'var(--creme)' }} className="block w-6 h-0.5 rounded" />
          <span style={{ background: 'var(--creme)' }} className="block w-6 h-0.5 rounded" />
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <ul style={{ backgroundColor: 'var(--vert)', borderBottom: '2px solid var(--sable)' }}
            className="md:hidden flex flex-col shadow-lg">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button
                onClick={() => handleTabClick(tab.id)}
                className="w-full text-left px-6 py-3 text-base transition-colors"
                style={{
                  fontFamily: "'EB Garamond', serif",
                  color: activeTab === tab.id ? 'var(--sable)' : 'var(--creme)',
                  background: 'none',
                  border: 'none',
                  borderLeft: activeTab === tab.id ? '3px solid var(--sable)' : '3px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
