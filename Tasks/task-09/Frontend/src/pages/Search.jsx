import { useState } from 'react'
import { booksAPI, membersAPI } from '../api'
import { EmptyState } from '../components/UI'

export default function Search() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('books')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const response = type === 'books'
        ? await booksAPI.getAll({ params: { search: query } })
        : await membersAPI.getAll({ params: { search: query } })
      const data = response?.data || (Array.isArray(response) ? response : [])
      setResults(data)
      setSearched(true)
    } catch {
      setResults([]); setSearched(true)
    } finally { setLoading(false) }
  }

  function handleTypeChange(t) {
    setType(t); setResults([]); setSearched(false); setQuery('')
  }

  const bookHeaders   = ['Book ID', 'Title', 'Author', 'Category', 'Qty']
  const memberHeaders = ['Member ID', 'Name', 'Department', 'Email', 'Phone']

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px', animation: 'slideDown 0.5s ease both' }}>
        <div style={{ fontSize: '10px', color: 'rgba(0,210,255,0.6)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '6px' }}>🔍 Real-time Catalog Search</div>
        <h1 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1, background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 60%, #00d2ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Search</h1>
      </div>

      {/* Search card */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', overflow: 'hidden', backdropFilter: 'blur(20px)', marginBottom: '24px', animation: 'slideUp 0.5s 0.1s ease both', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, transparent, #00d2ff, transparent)' }} />

        <div style={{ padding: '28px' }}>
          {/* Type toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {[{ id: 'books', label: '📚 Books' }, { id: 'members', label: '👥 Members' }].map(t => (
              <button key={t.id} onClick={() => handleTypeChange(t.id)}
                style={{
                  padding: '8px 20px', borderRadius: '10px', cursor: 'pointer',
                  background: type === t.id ? 'rgba(0,210,255,0.15)' : 'rgba(255,255,255,0.04)',
                  color: type === t.id ? '#00d2ff' : 'rgba(255,255,255,0.4)',
                  fontWeight: 700, fontSize: '12px', fontFamily: 'JetBrains Mono, monospace',
                  border: `1px solid ${type === t.id ? 'rgba(0,210,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  transition: 'all 0.25s ease',
                  boxShadow: type === t.id ? '0 0 16px rgba(0,210,255,0.15)' : 'none',
                }}
              >{t.label}</button>
            ))}
          </div>

          {/* Search input */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.4, pointerEvents: 'none' }}>🔍</span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={type === 'books' ? 'Search by title, author, ID...' : 'Search by name, member ID...'}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '14px 16px 14px 46px',
                  background: focused ? 'rgba(0,210,255,0.05)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${focused ? '#00d2ff' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px', color: '#ffffff', fontSize: '14px', outline: 'none',
                  fontFamily: 'JetBrains Mono, monospace', transition: 'all 0.25s ease',
                  boxShadow: focused ? '0 0 0 3px rgba(0,210,255,0.1), 0 0 20px rgba(0,210,255,0.1)' : 'none',
                }}
              />
              {query && (
                <button type="button" onClick={() => { setQuery(''); setResults([]); setSearched(false) }}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '6px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '11px', padding: '2px 8px' }}
                >✕</button>
              )}
            </div>

            <button type="submit" disabled={loading || !query.trim()}
              style={{
                padding: '14px 28px', borderRadius: '12px', border: '1px solid rgba(0,210,255,0.4)',
                background: loading ? 'rgba(0,210,255,0.1)' : 'linear-gradient(135deg, #00d2ff, #0099cc)',
                color: loading ? '#00d2ff' : '#000000',
                fontWeight: 800, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: 'JetBrains Mono, monospace', cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease', whiteSpace: 'nowrap',
                boxShadow: !loading && query.trim() ? '0 0 25px rgba(0,210,255,0.4)' : 'none',
                opacity: !query.trim() ? 0.5 : 1,
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Searching
                </span>
              ) : '⚡ Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', overflow: 'hidden', backdropFilter: 'blur(20px)', animation: 'slideUp 0.4s ease both' }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,210,255,0.03)' }}>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#ffffff', fontFamily: 'Syne, sans-serif' }}>Results</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>"{query}"</span>
              <span style={{ padding: '4px 12px', background: results.length > 0 ? 'rgba(0,210,255,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${results.length > 0 ? 'rgba(0,210,255,0.2)' : 'rgba(248,113,113,0.2)'}`, borderRadius: '99px', fontSize: '10px', color: results.length > 0 ? '#00d2ff' : '#f87171', fontFamily: 'JetBrains Mono, monospace' }}>
                {results.length} result{results.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {results.length === 0 ? (
            <EmptyState icon="🔍" text="No results found" sub={`No ${type} matched "${query}"`} />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.25em', fontFamily: 'JetBrains Mono, monospace' }}>#</th>
                    {(type === 'books' ? bookHeaders : memberHeaders).map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.25em', fontFamily: 'JetBrains Mono, monospace' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((item, i) => (
                    <tr key={item._id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s', animation: `slideUp 0.3s ${i * 0.04}s ease both` }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,210,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 20px', fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>{String(i+1).padStart(2,'0')}</td>
                      {type === 'books' ? <>
                        <td style={{ padding: '14px 20px', fontSize: '12px', color: '#00d2ff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{item.bookId}</td>
                        <td style={{ padding: '14px 20px', fontSize: '13px', color: '#ffffff', fontWeight: 700, fontFamily: 'Syne, sans-serif', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</td>
                        <td style={{ padding: '14px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>{item.author}</td>
                        <td style={{ padding: '14px 20px' }}><span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>{item.category}</span></td>
                        <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 800, color: item.quantity > 0 ? '#34d399' : '#f87171', fontFamily: 'Syne, sans-serif' }}>{item.quantity}</td>
                      </> : <>
                        <td style={{ padding: '14px 20px', fontSize: '12px', color: '#00d2ff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{item.memberId}</td>
                        <td style={{ padding: '14px 20px', fontSize: '13px', color: '#ffffff', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>{item.name}</td>
                        <td style={{ padding: '14px 20px' }}><span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>{item.department}</span></td>
                        <td style={{ padding: '14px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: 'JetBrains Mono, monospace' }}>{item.contact || item.email}</td>
                        <td style={{ padding: '14px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>{item.phone || '—'}</td>
                      </>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Idle state */}
      {!searched && !loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px', animation: 'slideUp 0.5s 0.2s ease both' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px', opacity: 0.3 }}>🔍</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em' }}>
            TYPE SOMETHING TO SEARCH THE CATALOG
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(16px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        input::placeholder   { color: rgba(255,255,255,0.2); }
        select option        { background: #0a0a14; color: #fff; }
      `}</style>
    </div>
  )
}
