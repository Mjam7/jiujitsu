import { useContext } from 'react'
import { ArrowDown } from 'lucide-react'
import { StoreContext } from '../store/StoreContext'
import { CATEGORIES, getGameTier, CONFIDENCE_LABELS } from '../constants'

function TierCard({ technique }) {
  const cat = CATEGORIES.find(c => c.id === technique.category)
  const daysSince = technique.lastTrained
    ? Math.floor((Date.now() - new Date(technique.lastTrained)) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="technique-card rounded-lg p-3"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{cat?.icon}</span>
          <span className="text-sm font-medium">{technique.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs font-bold" style={{ color: 'var(--accent)' }}>
            {technique.confidence}/10
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="tag-pill">{cat?.label}</span>
        {daysSince !== null && (
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {daysSince === 0 ? 'Today' : `${daysSince}d ago`}
          </span>
        )}
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          {CONFIDENCE_LABELS[technique.confidence]}
        </span>
      </div>
    </div>
  )
}

function Tier({ label, sublabel, color, accent, techniques, emptyMsg }) {
  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: `1px solid ${color}22` }}>
      <div className="flex items-baseline gap-3 mb-4">
        <div className="font-display text-5xl" style={{ color }}>{label}-Game</div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{sublabel}</div>
        <div className="ml-auto font-mono text-sm" style={{ color }}>
          {techniques.length} move{techniques.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Colour bar */}
      <div className="h-0.5 rounded mb-4" style={{ background: `linear-gradient(90deg, ${color}66, transparent)` }} />

      {techniques.length === 0 ? (
        <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>{emptyMsg}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {techniques.map(t => <TierCard key={t.id} technique={t} />)}
        </div>
      )}
    </div>
  )
}

function FlowNode({ label, category, sub }) {
  const cat = CATEGORIES.find(c => c.id === category)
  return (
    <div className="rounded-lg px-4 py-3 text-center"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--accent-dim)',
        minWidth: '160px',
      }}>
      {cat && <div className="text-lg mb-0.5">{cat.icon}</div>}
      <div className="text-sm font-medium">{label}</div>
      {sub && <div className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  )
}

function StrategyMap({ techniques }) {
  const aGame = techniques.filter(t => getGameTier(t) === 'A')

  // Build a simple flow: takedown/guard-pull → pass → submission
  const takedowns = aGame.filter(t => t.category === 'takedown' || t.category === 'guard-pull')
  const passes = aGame.filter(t => t.category === 'pass')
  const submissions = aGame.filter(t => t.category === 'submission')
  const backTakes = aGame.filter(t => t.category === 'back-take')
  const sweeps = aGame.filter(t => t.category === 'sweep')

  const hasMap = takedowns.length > 0 || passes.length > 0 || submissions.length > 0

  if (!hasMap) {
    return (
      <div className="py-12 text-center">
        <p className="font-display text-2xl mb-2" style={{ color: 'var(--text-muted)' }}>MAP UNAVAILABLE</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Build your A-Game first — add techniques with confidence 7+ and recent training dates
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max">
        {/* Entry Column */}
        <div className="flex flex-col items-center gap-2">
          <div className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>ENTRY</div>
          {takedowns.slice(0, 3).map(t => (
            <FlowNode key={t.id} label={t.name} category={t.category} sub={`${t.confidence}/10`} />
          ))}
          {takedowns.length === 0 && (
            <div className="rounded-lg px-4 py-3 text-center text-sm"
              style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border)', minWidth: '160px', color: 'var(--text-muted)' }}>
              No entry moves
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-px" style={{ background: 'var(--border)' }} />
            <ArrowDown size={12} style={{ color: 'var(--border)', transform: 'rotate(-90deg)' }} />
          </div>
        </div>

        {/* Passing Column */}
        <div className="flex flex-col items-center gap-2">
          <div className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>PASSING</div>
          {passes.slice(0, 3).map(t => (
            <FlowNode key={t.id} label={t.name} category={t.category} sub={`${t.confidence}/10`} />
          ))}
          {passes.length === 0 && (
            <div className="rounded-lg px-4 py-3 text-center text-sm"
              style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border)', minWidth: '160px', color: 'var(--text-muted)' }}>
              No passes
            </div>
          )}
          {sweeps.length > 0 && (
            <>
              <div className="font-mono text-xs mt-2" style={{ color: 'var(--text-muted)' }}>SWEEPS</div>
              {sweeps.slice(0, 2).map(t => (
                <FlowNode key={t.id} label={t.name} category={t.category} sub={`${t.confidence}/10`} />
              ))}
            </>
          )}
        </div>

        {/* Arrow */}
        <div className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-px" style={{ background: 'var(--border)' }} />
            <ArrowDown size={12} style={{ color: 'var(--border)', transform: 'rotate(-90deg)' }} />
          </div>
        </div>

        {/* Finishing Column */}
        <div className="flex flex-col items-center gap-2">
          <div className="font-mono text-xs mb-2" style={{ color: 'var(--text-muted)' }}>FINISH</div>
          {submissions.slice(0, 3).map(t => (
            <FlowNode key={t.id} label={t.name} category={t.category} sub={`${t.confidence}/10`} />
          ))}
          {backTakes.slice(0, 2).map(t => (
            <FlowNode key={t.id} label={t.name} category={t.category} sub={`${t.confidence}/10`} />
          ))}
          {(submissions.length === 0 && backTakes.length === 0) && (
            <div className="rounded-lg px-4 py-3 text-center text-sm"
              style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border)', minWidth: '160px', color: 'var(--text-muted)' }}>
              No finishes
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GameHub() {
  const { techniques } = useContext(StoreContext)

  const aGame = techniques.filter(t => getGameTier(t) === 'A')
  const bGame = techniques.filter(t => getGameTier(t) === 'B')
  const cGame = techniques.filter(t => getGameTier(t) === 'C')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl" style={{ color: 'var(--text-primary)' }}>GAME HUB</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Your strategic landscape, auto-sorted by confidence and recency
        </p>
      </div>

      {techniques.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-5xl mb-4">🗺️</p>
          <p className="font-display text-3xl mb-2" style={{ color: 'var(--text-muted)' }}>BUILD YOUR GAME</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Add techniques to your library. The Game Hub will sort and map them automatically.
          </p>
        </div>
      ) : (
        <>
          {/* Strategy Map */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="font-display text-xl mb-1" style={{ color: 'var(--accent)' }}>STRATEGY MAP</div>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Your A-Game flow — entry to finish
            </p>
            <StrategyMap techniques={techniques} />
          </div>

          {/* Tiers */}
          <Tier
            label="A"
            sublabel="Confidence 7+ · Trained in last 21 days"
            color="#27ae60"
            techniques={aGame}
            emptyMsg="No A-Game moves yet. Hit confidence 7+ and train recently."
          />
          <Tier
            label="B"
            sublabel="Confidence 4–6 · Training regularly"
            color="#c8a96e"
            techniques={bGame}
            emptyMsg="No B-Game moves yet."
          />
          <Tier
            label="C"
            sublabel="New techniques · Low confidence · The Lab"
            color="#c0392b"
            techniques={cGame}
            emptyMsg="No C-Game moves. Add new techniques to experiment with."
          />
        </>
      )}
    </div>
  )
}
