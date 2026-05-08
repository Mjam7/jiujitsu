import { useState, useContext } from 'react'
import { Plus, Search, ChevronDown, ChevronUp, Trash2, Edit3, ExternalLink, X, Video } from 'lucide-react'
import { StoreContext } from '../store/StoreContext'
import { CATEGORIES, GRIP_TYPES, CONFIDENCE_LABELS } from '../constants'

const EMPTY_FORM = {
  name: '', category: 'guard', confidence: 5,
  grips: [], notes: '', videos: [''], lastTrained: ''
}

function ConfidenceBar({ value }) {
  const pct = (value / 10) * 100
  const color = value >= 7 ? '#27ae60' : value >= 4 ? '#c8a96e' : '#c0392b'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mono text-xs w-4" style={{ color }}>{value}</span>
    </div>
  )
}

function GripTag({ grip, onRemove }) {
  return (
    <span className="flex items-center gap-1 tag-pill active">
      {grip.type}: {grip.detail}
      {onRemove && (
        <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex' }}>
          <X size={10} />
        </button>
      )}
    </span>
  )
}

function TechniqueForm({ initial = EMPTY_FORM, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const [gripInput, setGripInput] = useState({ type: 'Sleeve', detail: '' })

  function addGrip() {
    if (!gripInput.detail.trim()) return
    setForm(f => ({ ...f, grips: [...f.grips, { ...gripInput }] }))
    setGripInput(g => ({ ...g, detail: '' }))
  }

  function removeGrip(i) {
    setForm(f => ({ ...f, grips: f.grips.filter((_, idx) => idx !== i) }))
  }

  function addVideo() {
    setForm(f => ({ ...f, videos: [...f.videos, ''] }))
  }

  function updateVideo(i, val) {
    setForm(f => {
      const videos = [...f.videos]
      videos[i] = val
      return { ...f, videos }
    })
  }

  function removeVideo(i) {
    setForm(f => ({ ...f, videos: f.videos.filter((_, idx) => idx !== i) }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave({ ...form, videos: form.videos.filter(v => v.trim()) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5 rounded-xl"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>NAME *</label>
          <input className="input-field" placeholder="e.g. Knee Cut Pass"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>CATEGORY</label>
          <select className="input-field" value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="flex justify-between text-xs mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>
          <span>CONFIDENCE</span>
          <span style={{ color: 'var(--accent)' }}>{form.confidence}/10 — {CONFIDENCE_LABELS[form.confidence]}</span>
        </label>
        <input type="range" min={1} max={10} value={form.confidence}
          onChange={e => setForm(f => ({ ...f, confidence: +e.target.value }))}
          className="w-full" />
      </div>

      {/* Grips */}
      <div>
        <label className="block text-xs mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>GI GRIPS</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.grips.map((g, i) => (
            <GripTag key={i} grip={g} onRemove={() => removeGrip(i)} />
          ))}
        </div>
        <div className="flex gap-2">
          <select className="input-field" style={{ maxWidth: '120px' }}
            value={gripInput.type} onChange={e => setGripInput(g => ({ ...g, type: e.target.value }))}>
            {GRIP_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <input className="input-field" placeholder="e.g. Cross-collar sleeve"
            value={gripInput.detail} onChange={e => setGripInput(g => ({ ...g, detail: e.target.value }))}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGrip() } }} />
          <button type="button" onClick={addGrip}
            className="px-3 py-2 rounded text-sm"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            + Add
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>NOTES & CUES</label>
        <textarea className="input-field" placeholder="Personal cues, setups, common mistakes..."
          value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
      </div>

      {/* Videos */}
      <div>
        <label className="block text-xs mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>REFERENCE VIDEOS</label>
        <div className="space-y-2">
          {form.videos.map((v, i) => (
            <div key={i} className="flex gap-2">
              <input className="input-field" placeholder="YouTube / Instagram URL"
                value={v} onChange={e => updateVideo(i, e.target.value)} />
              {form.videos.length > 1 && (
                <button type="button" onClick={() => removeVideo(i)}
                  style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}>
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addVideo}
          className="mt-2 text-xs flex items-center gap-1"
          style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}>
          <Plus size={12} /> Add another video
        </button>
      </div>

      <div>
        <label className="block text-xs mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>LAST TRAINED</label>
        <input type="date" className="input-field" value={form.lastTrained}
          onChange={e => setForm(f => ({ ...f, lastTrained: e.target.value }))} />
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex-1 py-2 rounded font-medium text-sm"
          style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent-dim)', color: 'var(--accent)', cursor: 'pointer' }}>
          Save Technique
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2 rounded text-sm"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function TechniqueCard({ technique, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const cat = CATEGORIES.find(c => c.id === technique.category)

  return (
    <div className="technique-card rounded-xl p-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{cat?.icon}</span>
            <h3 className="font-medium text-sm">{technique.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="tag-pill">{cat?.label}</span>
            {technique.lastTrained && (
              <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                {technique.lastTrained}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(technique)}
            style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}>
            <Edit3 size={14} />
          </button>
          <button onClick={() => onDelete(technique.id)}
            style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <ConfidenceBar value={technique.confidence || 0} />

      {technique.grips?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {technique.grips.map((g, i) => <GripTag key={i} grip={g} />)}
        </div>
      )}

      {(technique.notes || technique.videos?.length > 0) && (
        <>
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-3 text-xs"
            style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}>
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Less' : 'Details'}
          </button>

          {expanded && (
            <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
              {technique.notes && (
                <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {technique.notes}
                </p>
              )}
              {technique.videos?.filter(v => v).map((v, i) => (
                <a key={i} href={v} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-xs"
                  style={{ color: 'var(--accent)' }}>
                  <Video size={12} />
                  <span className="truncate">{v}</span>
                  <ExternalLink size={10} />
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function TechniqueLibrary() {
  const { techniques, addTechnique, updateTechnique, deleteTechnique } = useContext(StoreContext)
  const [showForm, setShowForm] = useState(false)
  const [editingTechnique, setEditingTechnique] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name') // name | confidence | recent

  function handleSave(data) {
    if (editingTechnique) {
      updateTechnique(editingTechnique.id, data)
      setEditingTechnique(null)
    } else {
      addTechnique(data)
      setShowForm(false)
    }
  }

  function handleEdit(technique) {
    setEditingTechnique(technique)
    setShowForm(false)
  }

  const filtered = techniques
    .filter(t => {
      const matchCat = activeCategory === 'all' || t.category === activeCategory
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.notes?.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
    .sort((a, b) => {
      if (sortBy === 'confidence') return (b.confidence || 0) - (a.confidence || 0)
      if (sortBy === 'recent') return new Date(b.lastTrained || 0) - new Date(a.lastTrained || 0)
      return a.name.localeCompare(b.name)
    })

  const countByCategory = (catId) => techniques.filter(t => t.category === catId).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl" style={{ color: 'var(--text-primary)' }}>TECHNIQUE LIBRARY</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {techniques.length} technique{techniques.length !== 1 ? 's' : ''} catalogued
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingTechnique(null) }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm"
          style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent-dim)', color: 'var(--accent)', cursor: 'pointer' }}>
          <Plus size={16} /> Add Technique
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && !editingTechnique && (
        <TechniqueForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
      {editingTechnique && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>EDITING:</span>
            <span className="text-sm font-medium">{editingTechnique.name}</span>
            <button onClick={() => setEditingTechnique(null)}
              style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', marginLeft: 'auto' }}>
              <X size={16} />
            </button>
          </div>
          <TechniqueForm
            initial={editingTechnique}
            onSave={handleSave}
            onCancel={() => setEditingTechnique(null)}
          />
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`tag-pill ${activeCategory === 'all' ? 'active' : ''}`}>
          All ({techniques.length})
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`tag-pill ${activeCategory === cat.id ? 'active' : ''}`}>
            {cat.icon} {cat.label} ({countByCategory(cat.id)})
          </button>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }} />
          <input className="input-field pl-8" placeholder="Search techniques..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field" style={{ maxWidth: '160px' }}
          value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="confidence">Sort: Confidence</option>
          <option value="recent">Sort: Recent</option>
        </select>
      </div>

      {/* Technique Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-4xl mb-3">🥋</p>
          <p className="font-display text-2xl mb-2" style={{ color: 'var(--text-muted)' }}>
            {techniques.length === 0 ? 'START YOUR LIBRARY' : 'NO RESULTS'}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {techniques.length === 0 ? 'Add your first technique above' : 'Try a different search or filter'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(t => (
            <TechniqueCard key={t.id} technique={t}
              onEdit={handleEdit}
              onDelete={deleteTechnique} />
          ))}
        </div>
      )}
    </div>
  )
}
