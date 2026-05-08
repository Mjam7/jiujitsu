import { useState, useContext, useRef, useCallback } from 'react'
import { Mic, MicOff, Plus, Trash2, Tag, ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import { StoreContext } from '../store/StoreContext'
import { CATEGORIES } from '../constants'

function useVoice(onTranscript) {
  const recognitionRef = useRef(null)
  const [listening, setListening] = useState(false)
  const [supported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

  const start = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (e) => {
      let full = ''
      for (let i = 0; i < e.results.length; i++) {
        full += e.results[i][0].transcript
      }
      onTranscript(full)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)

    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }, [onTranscript])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  return { listening, supported, start, stop }
}

function SessionCard({ session, techniques, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const tagged = techniques.filter(t => session.taggedTechniques?.includes(t.id))

  const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
              <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                {session.date || formatDate(session.createdAt)}
              </span>
              {session.duration && (
                <span className="tag-pill">{session.duration}</span>
              )}
              {session.sessionType && (
                <span className="tag-pill">{session.sessionType}</span>
              )}
            </div>
            {session.title && (
              <h3 className="font-medium text-sm mb-1">{session.title}</h3>
            )}
          </div>
          <button onClick={() => onDelete(session.id)}
            style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}>
            <Trash2 size={14} />
          </button>
        </div>

        {tagged.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tagged.map(t => {
              const cat = CATEGORIES.find(c => c.id === t.category)
              return (
                <span key={t.id} className="tag-pill active">
                  {cat?.icon} {t.name}
                </span>
              )
            })}
          </div>
        )}

        {session.transcript && (
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-2 text-xs"
            style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}>
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Hide' : 'Session notes'}
          </button>
        )}
      </div>

      {expanded && session.transcript && (
        <div className="px-4 pb-4">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            {session.transcript}
          </p>
        </div>
      )}
    </div>
  )
}

export default function SessionLog() {
  const { sessions, techniques, addSession, deleteSession, updateTechnique } = useContext(StoreContext)

  const [transcript, setTranscript] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [duration, setDuration] = useState('')
  const [sessionType, setSessionType] = useState('')
  const [taggedIds, setTaggedIds] = useState([])
  const [showTagPanel, setShowTagPanel] = useState(false)
  const [tagSearch, setTagSearch] = useState('')

  const { listening, supported, start, stop } = useVoice((t) => setTranscript(t))

  function toggleVoice() {
    if (listening) stop()
    else start()
  }

  function toggleTag(id) {
    setTaggedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function handleSave() {
    if (!transcript.trim() && !title.trim()) return
    addSession({ title, date, duration, sessionType, transcript, taggedTechniques: taggedIds })

    // Update lastTrained for tagged techniques
    taggedIds.forEach(id => updateTechnique(id, { lastTrained: date }))

    // Reset
    setTranscript('')
    setTitle('')
    setDuration('')
    setSessionType('')
    setTaggedIds([])
    setShowTagPanel(false)
  }

  const filteredTechniques = techniques.filter(t =>
    !tagSearch || t.name.toLowerCase().includes(tagSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl" style={{ color: 'var(--text-primary)' }}>SESSION LOG</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
        </p>
      </div>

      {/* New Session Entry */}
      <div className="rounded-xl p-5 space-y-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="font-mono text-xs" style={{ color: 'var(--accent)' }}>NEW SESSION</div>

        {/* Meta fields */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>DATE</label>
            <input type="date" className="input-field" value={date}
              onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>TITLE</label>
            <input className="input-field" placeholder="e.g. Monday No-Gi"
              value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>DURATION</label>
            <input className="input-field" placeholder="e.g. 90 min"
              value={duration} onChange={e => setDuration(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>TYPE</label>
            <select className="input-field" value={sessionType}
              onChange={e => setSessionType(e.target.value)}>
              <option value="">Any</option>
              <option>Drilling</option>
              <option>Sparring</option>
              <option>Comp Prep</option>
              <option>Open Mat</option>
              <option>Class</option>
              <option>Private</option>
            </select>
          </div>
        </div>

        {/* Dictation Area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>SESSION NOTES</label>
            {supported ? (
              <button
                onClick={toggleVoice}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all ${listening ? 'recording-pulse' : ''}`}
                style={{
                  background: listening ? 'rgba(192,57,43,0.15)' : 'var(--bg-elevated)',
                  border: `1px solid ${listening ? 'var(--red)' : 'var(--border)'}`,
                  color: listening ? '#c0392b' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}>
                {listening ? <MicOff size={14} /> : <Mic size={14} />}
                {listening ? 'Stop Recording' : 'Dictate'}
              </button>
            ) : (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Voice not supported in this browser</span>
            )}
          </div>
          <textarea
            className="input-field"
            rows={5}
            placeholder="Speak or type freely... e.g. 'Spent 3 rounds in half guard, focused on the underhook to dog fight sweep. Hit the knee cut three times from torreando. Struggled with posture in closed guard.'"
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
          />
          {listening && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--red)', animation: 'pulse-record 1s ease infinite' }} />
              <span className="text-xs font-mono" style={{ color: 'var(--red)' }}>Listening...</span>
            </div>
          )}
        </div>

        {/* Tagged Techniques */}
        <div>
          <button
            onClick={() => setShowTagPanel(!showTagPanel)}
            className="flex items-center gap-2 text-sm"
            style={{ color: 'var(--text-secondary)', cursor: 'pointer', background: 'none', border: 'none' }}>
            <Tag size={14} />
            Tag Techniques
            {taggedIds.length > 0 && (
              <span className="font-mono text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent-dim)' }}>
                {taggedIds.length} tagged
              </span>
            )}
          </button>

          {showTagPanel && (
            <div className="mt-3 p-3 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <input className="input-field mb-3" placeholder="Search techniques..."
                value={tagSearch} onChange={e => setTagSearch(e.target.value)} />
              {techniques.length === 0 ? (
                <p className="text-xs text-center py-2" style={{ color: 'var(--text-muted)' }}>
                  Add techniques to your library first
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {filteredTechniques.map(t => {
                    const cat = CATEGORIES.find(c => c.id === t.category)
                    const tagged = taggedIds.includes(t.id)
                    return (
                      <button key={t.id}
                        onClick={() => toggleTag(t.id)}
                        className={`tag-pill ${tagged ? 'active' : ''}`}>
                        {cat?.icon} {t.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={!transcript.trim() && !title.trim()}
          className="w-full py-2.5 rounded-lg font-medium text-sm"
          style={{
            background: (transcript.trim() || title.trim()) ? 'var(--accent-glow)' : 'var(--bg-elevated)',
            border: `1px solid ${(transcript.trim() || title.trim()) ? 'var(--accent-dim)' : 'var(--border)'}`,
            color: (transcript.trim() || title.trim()) ? 'var(--accent)' : 'var(--text-muted)',
            cursor: (transcript.trim() || title.trim()) ? 'pointer' : 'not-allowed',
          }}>
          Save Session
        </button>
      </div>

      {/* Session History */}
      {sessions.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-display text-xl" style={{ color: 'var(--text-secondary)' }}>HISTORY</h2>
          {sessions.map(s => (
            <SessionCard key={s.id} session={s} techniques={techniques} onDelete={deleteSession} />
          ))}
        </div>
      )}
    </div>
  )
}
