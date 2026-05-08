import { useState, useContext } from 'react'
import { X, Plus, Trash2, Trophy, ExternalLink } from 'lucide-react'
import { StoreContext } from '../store/StoreContext'
import { BELTS, COMPETITION_RESULTS } from '../constants'

export default function ProfilePanel({ onClose }) {
  const { profile, updateProfile, addCompetition, deleteCompetition } = useContext(StoreContext)
  const [compForm, setCompForm] = useState({ tournament: '', date: '', weightClass: '', result: 'Gold 🥇', notes: '', footage: '' })
  const [showCompForm, setShowCompForm] = useState(false)

  const belt = BELTS.find(b => b.id === profile.belt) || BELTS[0]

  function handleSaveComp(e) {
    e.preventDefault()
    if (!compForm.tournament) return
    addCompetition(compForm)
    setCompForm({ tournament: '', date: '', weightClass: '', result: 'Gold 🥇', notes: '', footage: '' })
    setShowCompForm(false)
  }

  const medalEmoji = (result) => {
    if (result.includes('Gold')) return '🥇'
    if (result.includes('Silver')) return '🥈'
    if (result.includes('Bronze')) return '🥉'
    return '—'
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />

      {/* Panel */}
      <div
        className="relative w-full max-w-sm h-full overflow-y-auto fade-up"
        style={{ background: 'var(--bg-card)', borderLeft: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="font-display text-2xl" style={{ color: 'var(--accent)' }}>PRACTITIONER</div>
            <button onClick={onClose} style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}>
              <X size={20} />
            </button>
          </div>

          {/* Belt Display */}
          <div className="mb-6 p-4 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-8 flex-1 rounded"
                style={{ background: belt.color, position: 'relative', overflow: 'hidden' }}
              >
                {/* Stripe marks */}
                {Array.from({ length: profile.stripes || 0 }).map((_, i) => (
                  <div key={i} className="absolute top-0 bottom-0 w-3"
                    style={{ right: `${8 + i * 16}px`, background: 'rgba(255,255,255,0.5)' }} />
                ))}
              </div>
              <span className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                {belt.label} / {profile.stripes || 0} stripe{profile.stripes !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex gap-2">
              {BELTS.map(b => (
                <button key={b.id}
                  onClick={() => updateProfile({ belt: b.id })}
                  className="w-7 h-7 rounded border-2 transition-all"
                  style={{
                    background: b.color,
                    borderColor: profile.belt === b.id ? 'var(--accent)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  title={b.label}
                />
              ))}
              <div className="ml-auto flex items-center gap-1">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Stripes:</span>
                {[0,1,2,3,4].map(n => (
                  <button key={n}
                    onClick={() => updateProfile({ stripes: n })}
                    className="w-6 h-6 rounded text-xs transition-all"
                    style={{
                      background: profile.stripes === n ? 'var(--accent-glow)' : 'var(--bg-card)',
                      border: `1px solid ${profile.stripes === n ? 'var(--accent-dim)' : 'var(--border)'}`,
                      color: profile.stripes === n ? 'var(--accent)' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >{n}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Fields */}
          <div className="space-y-3 mb-8">
            {[
              { key: 'name', label: 'Name', placeholder: 'Your name' },
              { key: 'gym', label: 'Gym', placeholder: 'Academy name' },
              { key: 'coach', label: 'Head Coach', placeholder: 'Coach name' },
              { key: 'height', label: 'Height', placeholder: 'e.g. 5\'11"' },
              { key: 'weight', label: 'Weight', placeholder: 'e.g. 82kg' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>{f.label}</label>
                <input
                  className="input-field"
                  placeholder={f.placeholder}
                  value={profile[f.key] || ''}
                  onChange={e => updateProfile({ [f.key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          {/* Competition Tracker */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy size={14} style={{ color: 'var(--accent)' }} />
                <span className="font-display text-lg" style={{ color: 'var(--accent)' }}>COMPETITIONS</span>
              </div>
              <button
                onClick={() => setShowCompForm(!showCompForm)}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded"
                style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                }}
              >
                <Plus size={12} /> Add
              </button>
            </div>

            {showCompForm && (
              <form onSubmit={handleSaveComp} className="mb-4 p-4 rounded-lg space-y-2"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <input className="input-field" placeholder="Tournament name *"
                  value={compForm.tournament} onChange={e => setCompForm(p => ({ ...p, tournament: e.target.value }))} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="input-field"
                    value={compForm.date} onChange={e => setCompForm(p => ({ ...p, date: e.target.value }))} />
                  <input className="input-field" placeholder="Weight class"
                    value={compForm.weightClass} onChange={e => setCompForm(p => ({ ...p, weightClass: e.target.value }))} />
                </div>
                <select className="input-field"
                  value={compForm.result} onChange={e => setCompForm(p => ({ ...p, result: e.target.value }))}>
                  {COMPETITION_RESULTS.map(r => <option key={r}>{r}</option>)}
                </select>
                <input className="input-field" placeholder="Match notes"
                  value={compForm.notes} onChange={e => setCompForm(p => ({ ...p, notes: e.target.value }))} />
                <input className="input-field" placeholder="Footage URL (YouTube, etc.)"
                  value={compForm.footage} onChange={e => setCompForm(p => ({ ...p, footage: e.target.value }))} />
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="flex-1 py-1.5 rounded text-sm font-medium"
                    style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent-dim)', color: 'var(--accent)', cursor: 'pointer' }}>
                    Save
                  </button>
                  <button type="button" onClick={() => setShowCompForm(false)}
                    className="px-4 py-1.5 rounded text-sm"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {profile.competitions?.length === 0 && (
                <p className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>No competitions yet</p>
              )}
              {profile.competitions?.map(comp => (
                <div key={comp.id} className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium">{comp.tournament}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{comp.date}</span>
                        {comp.weightClass && <span className="tag-pill">{comp.weightClass}</span>}
                        <span className="text-xs">{comp.result}</span>
                      </div>
                      {comp.notes && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{comp.notes}</p>}
                      {comp.footage && (
                        <a href={comp.footage} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-xs mt-1"
                          style={{ color: 'var(--accent)' }}>
                          <ExternalLink size={10} /> Footage
                        </a>
                      )}
                    </div>
                    <button onClick={() => deleteCompetition(comp.id)}
                      style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
