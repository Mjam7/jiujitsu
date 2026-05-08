import { useState } from 'react'
import { User } from 'lucide-react'
import ProfilePanel from './ProfilePanel'
import { BELTS } from '../constants'

export default function Nav({ activeHub, setActiveHub, profile }) {
  const [profileOpen, setProfileOpen] = useState(false)

  const belt = BELTS.find(b => b.id === profile.belt) || BELTS[0]

  const hubs = [
    { id: 'library', label: 'Technique Library' },
    { id: 'session', label: 'Session Log' },
    { id: 'game', label: 'Game Hub' },
  ]

  return (
    <>
      <nav style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 h-14">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="font-display text-xl" style={{ color: 'var(--accent)', letterSpacing: '0.08em' }}>
            THE GENTLE ART
          </div>
          <div className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>TRACKER</div>
        </div>

        {/* Hub Links */}
        <div className="flex items-center gap-1">
          {hubs.map(hub => (
            <button
              key={hub.id}
              onClick={() => setActiveHub(hub.id)}
              className="px-4 py-1 text-sm font-medium transition-colors"
              style={{
                color: activeHub === hub.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderBottom: activeHub === hub.id ? '2px solid var(--accent)' : '2px solid transparent',
                background: 'transparent',
                cursor: 'pointer',
                paddingBottom: '3px',
              }}
            >
              {hub.label}
            </button>
          ))}
        </div>

        {/* Profile Button */}
        <button
          onClick={() => setProfileOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            color: 'var(--text-primary)',
          }}
        >
          {/* Belt badge */}
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: belt.color, color: belt.textColor }}
          >
            {profile.stripes || '—'}
          </div>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {profile.name || 'Profile'}
          </span>
          <User size={14} style={{ color: 'var(--text-muted)' }} />
        </button>
      </nav>

      {profileOpen && (
        <ProfilePanel onClose={() => setProfileOpen(false)} />
      )}
    </>
  )
}
