import { useState, useEffect, useCallback } from 'react'
import { booksAPI } from '../api'
import { useToast } from '../context/ToastContext'
import { Modal, EmptyState, SearchBar, FormGroup, StyledInput, StyledSelect } from '../components/UI'

const CATEGORIES = ['Fiction','Non-Fiction','Programming','Computer Science','Mathematics','History','Science','Literature','Other']
const EMPTY_FORM = { bookId: '', title: '', author: '', category: '', quantity: 1 }

function PageHeader({ title, icon, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', animation: 'slideDown 0.5s ease both' }}>
      <div>
        <div style={{ fontSize: '10px', color: 'rgba(0,210,255,0.6)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '6px' }}>
          {icon} {subtitle}
        </div>
        <h1 style={{
          margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 900,
          fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 60%, #00d2ff 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>{title}</h1>
      </div>
      {action}
    </div>
  )
}

function GlowButton({ onClick, children, color = '#00d2ff', disabled }) {
  const [h, setH] = useState(false)
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        padding: '11px 24px', borderRadius: '12px', cursor: disabled ? 'not-allowed' : 'pointer',
        background: h ? color : `${color}22`,
        color: h ? '#000' : color,
        fontWeight: 800, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
        fontFamily: 'JetBrains Mono, monospace',
        transition: 'all 0.25s ease',
        boxShadow: h ? `0 0 30px ${color}66` : 'none',
        border: `1px solid ${color}44`,
        opacity: disabled ? 0.5 : 1,
      }}
    >{children}</button>
  )
}

export default function Books() {
  const { toast } = useToast()
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const load = useCallback(() => {
    booksAPI.getAll(search).then(r => setBooks(r.data || [])).catch(() => {})
  }, [search])

  useEffect(() => { load() }, [load])

  function f(key, val) {
    setForm(p => ({ ...p, [key]: key === 'quantity' ? Math.max(0, parseInt(val) || 0) : val }))
  }

  function openAdd() { setForm(EMPTY_FORM); setModal('add') }
  function openEdit(book) { setForm({ bookId: book.bookId, title: book.title, author: book.author, category: book.category, quantity: book.quantity }); setModal({ type: 'edit', id: book._id }) }

  async function handleDelete(id) {
    try {
      await booksAPI.delete(id)
      setBooks(prev => prev.filter(b => b._id !== id))
      toast('Book deleted!', 'success')
    } catch { toast('Error deleting book', 'error') }
    setDeleteId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true)
    try {
      if (modal === 'add') {
        const r = await booksAPI.create(form); setBooks(prev => [...prev, r.data])
        toast('Book added!', 'success')
      } else {
        await booksAPI.update(modal.id, form); load()
        toast('Book updated!', 'success')
      }
      setModal(null); setForm(EMPTY_FORM)
    } catch (err) { toast(err.response?.data?.message || 'Error saving book', 'error') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <PageHeader title="Books" icon="📚" subtitle="Catalog Management"
        action={<GlowButton onClick={openAdd}>+ Add New Book</GlowButton>}
      />

      {/* Table card */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '24px', overflow: 'hidden', backdropFilter: 'blur(20px)',
        animation: 'slideUp 0.5s 0.1s ease both',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by title, author, ID..." />
        </div>

        {books.length === 0 ? <EmptyState icon="📚" text="No books found" sub="Add your first book to get started" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['#', 'Book ID', 'Title', 'Author', 'Category', 'Qty', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.25em', fontFamily: 'JetBrains Mono, monospace' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {books.map((b, i) => (
                  <tr key={b._id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s', cursor: 'default' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,210,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 20px', fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>{String(i+1).padStart(2,'0')}</td>
                    <td style={{ padding: '14px 20px', fontSize: '12px', color: '#00d2ff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{b.bookId}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#ffffff', fontWeight: 700, fontFamily: 'Syne, sans-serif', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</td>
                    <td style={{ padding: '14px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>{b.author}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>{b.category}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: b.quantity > 0 ? '#34d399' : '#f87171', fontFamily: 'Syne, sans-serif' }}>{b.quantity}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEdit(b)} style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(0,210,255,0.3)', background: 'rgba(0,210,255,0.08)', color: '#00d2ff', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.target.style.background='rgba(0,210,255,0.2)'; e.target.style.boxShadow='0 0 12px rgba(0,210,255,0.3)' }}
                          onMouseLeave={e => { e.target.style.background='rgba(0,210,255,0.08)'; e.target.style.boxShadow='none' }}
                        >EDIT</button>
                        <button onClick={() => setDeleteId(b._id)} style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)', color: '#f87171', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.target.style.background='rgba(248,113,113,0.2)'; e.target.style.boxShadow='0 0 12px rgba(248,113,113,0.3)' }}
                          onMouseLeave={e => { e.target.style.background='rgba(248,113,113,0.08)'; e.target.style.boxShadow='none' }}
                        >DEL</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title={modal === 'add' ? '+ Add New Book' : '✏ Edit Book'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormGroup label="Book ID *" full><StyledInput required value={form.bookId} onChange={e => f('bookId', e.target.value)} placeholder="e.g. BK-001" /></FormGroup>
            <FormGroup label="Book Title *" full><StyledInput required value={form.title} onChange={e => f('title', e.target.value)} placeholder="Enter book title" /></FormGroup>
            <FormGroup label="Author *"><StyledInput required value={form.author} onChange={e => f('author', e.target.value)} placeholder="Author name" /></FormGroup>
            <FormGroup label="Category *">
              <StyledSelect required value={form.category} onChange={e => f('category', e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </StyledSelect>
            </FormGroup>
            <FormGroup label="Quantity *" full><StyledInput type="number" min="0" required value={form.quantity} onChange={e => f('quantity', e.target.value)} /></FormGroup>
            <div style={{ gridColumn: 'span 2', marginTop: '4px' }}>
              <GlowButton disabled={loading}>{loading ? 'Saving...' : '✓ Confirm Save'}</GlowButton>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="⚠ Confirm Delete" onClose={() => setDeleteId(null)}>
          <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', marginBottom: '24px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <GlowButton onClick={() => setDeleteId(null)} color="rgba(255,255,255,0.5)">Cancel</GlowButton>
              <GlowButton onClick={() => handleDelete(deleteId)} color="#f87171">Delete</GlowButton>
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(16px)}  to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}
