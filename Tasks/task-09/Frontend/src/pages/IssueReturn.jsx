import { useState, useEffect, useCallback } from 'react'
import { issuesAPI, booksAPI, membersAPI } from '../api'
import { useToast } from '../context/ToastContext'
import { Modal } from '../components/UI'

function GlowButton({ onClick, children, color = '#00d2ff', disabled, type = 'button', full }) {
  const [h, setH] = useState(false)
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: full ? '100%' : 'auto', padding: '13px 24px',
        borderRadius: '12px', border: `1px solid ${color}44`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: h ? color : `${color}18`,
        color: h ? '#000' : color,
        fontWeight: 800, fontSize: '12px', letterSpacing: '0.12em',
        textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace',
        transition: 'all 0.25s ease',
        boxShadow: h ? `0 0 28px ${color}66` : 'none',
        opacity: disabled ? 0.45 : 1,
      }}
    >{children}</button>
  )
}

function StyledSelect({ value, onChange, required, children, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <select value={value} onChange={onChange} required={required}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: '100%', boxSizing: 'border-box', padding: '12px 14px',
        background: focused ? 'rgba(0,210,255,0.06)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${focused ? '#00d2ff' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '11px', color: value ? '#ffffff' : 'rgba(255,255,255,0.3)',
        fontSize: '13px', outline: 'none',
        fontFamily: 'JetBrains Mono, monospace', transition: 'all 0.25s',
        boxShadow: focused ? '0 0 0 3px rgba(0,210,255,0.1)' : 'none',
        cursor: 'pointer',
      }}
    >{children}</select>
  )
}

function RecordItem({ item, idx, onDelete }) {
  const isIssued = String(item.status).toLowerCase() === 'active'
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 14px', borderRadius: '13px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.2s', cursor: 'default',
        animation: `fadeSlide 0.35s ${idx * 0.04}s ease both`,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,210,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(0,210,255,0.15)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)' }}
    >
      {/* Icon */}
      <div style={{
        width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px',
        background: isIssued ? 'rgba(0,210,255,0.1)' : 'rgba(52,211,153,0.1)',
        border: `1px solid ${isIssued ? 'rgba(0,210,255,0.2)' : 'rgba(52,211,153,0.2)'}`,
      }}>
        {isIssued ? '📤' : '📥'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.bookTitle || 'N/A'}
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.memberName || 'N/A'}
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
        <span style={{
          padding: '2px 9px', borderRadius: '99px', fontSize: '9px', fontWeight: 800,
          letterSpacing: '0.08em', fontFamily: 'JetBrains Mono, monospace',
          background: isIssued ? 'rgba(0,210,255,0.12)' : 'rgba(52,211,153,0.12)',
          color: isIssued ? '#00d2ff' : '#34d399',
          border: `1px solid ${isIssued ? 'rgba(0,210,255,0.25)' : 'rgba(52,211,153,0.25)'}`,
        }}>
          {isIssued ? '⬆ ISSUED' : '⬇ RETURNED'}
        </span>
        {item.fine > 0 && (
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#f87171', fontFamily: 'JetBrains Mono, monospace' }}>Rs {item.fine}</span>
        )}
      </div>

      {/* Delete */}
      <button onClick={() => onDelete(item._id)}
        style={{
          width: '26px', height: '26px', borderRadius: '7px', border: '1px solid rgba(248,113,113,0.2)',
          background: 'rgba(248,113,113,0.06)', color: '#f87171', cursor: 'pointer',
          fontSize: '11px', transition: 'all 0.2s', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        onMouseEnter={e => { e.target.style.background = 'rgba(248,113,113,0.25)'; e.target.style.boxShadow = '0 0 10px rgba(248,113,113,0.3)' }}
        onMouseLeave={e => { e.target.style.background = 'rgba(248,113,113,0.06)'; e.target.style.boxShadow = 'none' }}
      >🗑</button>
    </div>
  )
}

export default function IssueReturn() {
  const { toast } = useToast()
  const [issues, setIssues]   = useState([])
  const [books, setBooks]     = useState([])
  const [members, setMembers] = useState([])
  const [form, setForm]       = useState({ memberId: '', bookId: '' })
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [justIssued, setJustIssued] = useState(null)

  const load = useCallback(async () => {
    try {
      const [iRes, bRes, mRes] = await Promise.all([issuesAPI.getAll(), booksAPI.getAll(), membersAPI.getAll()])
      setIssues(iRes.data || [])
      setBooks(bRes.data || [])
      setMembers(mRes.data || [])
    } catch { toast('Failed to load data', 'error') }
  }, [toast])

  useEffect(() => { load() }, [load])

  async function handleDelete(id) {
    try {
      await issuesAPI.delete(id)
      setIssues(prev => prev.filter(i => i._id !== id))
      toast('Record deleted!', 'success')
    } catch { toast('Error deleting record', 'error') }
    setDeleteId(null)
  }

  async function handleIssue(e) {
    e.preventDefault()
    if (!form.memberId || !form.bookId) return toast('Please select member and book', 'error')
    setLoading(true)
    try {
      const res = await issuesAPI.issue(form)
      const selBook   = books.find(b => b._id === form.bookId)
      const selMember = members.find(m => m._id === form.memberId)
      const newRecord = {
        _id: res.data._id || Date.now().toString(),
        status: 'Issued',
        bookTitle: selBook?.title || 'Unknown',
        memberName: selMember?.name || 'Unknown',
      }
      setIssues(prev => [newRecord, ...prev])
      setJustIssued(newRecord)
      setTimeout(() => setJustIssued(null), 3000)
      toast('Book issued successfully!', 'success')
      setForm({ memberId: '', bookId: '' })
      await load()
    } catch (err) { toast(err.response?.data?.message || 'Error issuing book', 'error') }
    finally { setLoading(false) }
  }

  const selBook   = books.find(b => b._id === form.bookId)
  const selMember = members.find(m => m._id === form.memberId)
  const issuedCount   = issues.filter(i => String(i.status).toLowerCase() === 'active').length
  const returnedCount = issues.filter(i => String(i.status).toLowerCase() === 'returned').length

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px', animation: 'slideDown 0.5s ease both' }}>
        <div style={{ fontSize: '10px', color: 'rgba(0,210,255,0.6)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '6px' }}>🔄 Transaction Center</div>
        <h1 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1, background: 'linear-gradient(135deg,#fff 0%,#fff 60%,#00d2ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Issue & Return
        </h1>
      </div>

      {/* Split layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '20px', alignItems: 'start' }}>

        {/* ── LEFT: Issue Form ── */}
        <div style={{
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '22px', overflow: 'hidden', backdropFilter: 'blur(20px)',
          position: 'relative', animation: 'slideUp 0.5s 0.1s ease both',
        }}>
          {/* Top glow */}
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px', background: 'linear-gradient(90deg,transparent,#00d2ff,transparent)' }} />

          {/* Form header */}
          <div style={{ padding: '20px 22px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,210,255,0.03)' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif' }}>Issue New Book</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px' }}>Select member & book to proceed</div>
          </div>

          <form onSubmit={handleIssue} style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Member select */}
            <div>
              <label style={{ display: 'block', fontSize: '9px', fontWeight: 700, color: 'rgba(0,210,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '7px', fontFamily: 'JetBrains Mono, monospace' }}>
                👤 Select Member
              </label>
              <StyledSelect required value={form.memberId} onChange={e => setForm(p => ({ ...p, memberId: e.target.value }))}>
                <option value="" style={{ background: '#0a0a14' }}>Choose a member...</option>
                {members.map(m => <option key={m._id} value={m._id} style={{ background: '#0a0a14' }}>{m.name} — {m.memberId}</option>)}
              </StyledSelect>
            </div>

            {/* Book select */}
            <div>
              <label style={{ display: 'block', fontSize: '9px', fontWeight: 700, color: 'rgba(0,210,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '7px', fontFamily: 'JetBrains Mono, monospace' }}>
                📚 Select Book
              </label>
              <StyledSelect required value={form.bookId} onChange={e => setForm(p => ({ ...p, bookId: e.target.value }))}>
                <option value="" style={{ background: '#0a0a14' }}>Choose a book...</option>
                {books.map(b => (
                  <option key={b._id} value={b._id} disabled={b.quantity <= 0} style={{ background: '#0a0a14' }}>
                    {b.title}{b.quantity <= 0 ? ' (Out of stock)' : ` — ${b.quantity} left`}
                  </option>
                ))}
              </StyledSelect>
            </div>

            {/* Live preview */}
            {selMember && selBook ? (
              <div style={{
                background: 'rgba(0,210,255,0.05)', border: '1px solid rgba(0,210,255,0.2)',
                borderRadius: '12px', padding: '14px 16px',
                animation: 'fadeSlide 0.3s ease both',
              }}>
                <div style={{ fontSize: '9px', color: 'rgba(0,210,255,0.5)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em', marginBottom: '10px', textTransform: 'uppercase' }}>Transaction Preview</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em', marginBottom: '3px' }}>MEMBER</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>{selMember.name}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>{selMember.memberId}</div>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(0,210,255,0.15)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em', marginBottom: '3px' }}>BOOK</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif' }}>{selBook.title}</div>
                    <div style={{ fontSize: '10px', color: selBook.quantity > 0 ? '#34d399' : '#f87171', fontFamily: 'JetBrains Mono, monospace' }}>{selBook.quantity} in stock</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.07)', textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>
                Select member & book to preview
              </div>
            )}

            <GlowButton type="submit" disabled={loading} full>
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Processing...</span>
                : '⚡ Issue Book'
              }
            </GlowButton>
          </form>

          {/* Success flash */}
          {justIssued && (
            <div style={{
              margin: '0 22px 22px', padding: '12px 16px', borderRadius: '11px',
              background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)',
              animation: 'fadeSlide 0.3s ease both',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>✓ ISSUED SUCCESSFULLY</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontFamily: 'Syne, sans-serif', marginTop: '3px' }}>{justIssued.bookTitle} → {justIssued.memberName}</div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Live Records ── */}
        <div style={{
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '22px', overflow: 'hidden', backdropFilter: 'blur(20px)',
          animation: 'slideUp 0.5s 0.15s ease both',
        }}>
          {/* Records header */}
          <div style={{ padding: '20px 22px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,210,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif' }}>Live Records</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace', marginTop: '3px' }}>{issues.length} total transactions</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 10px', background: 'rgba(0,210,255,0.1)', border: '1px solid rgba(0,210,255,0.2)', borderRadius: '99px', fontSize: '9px', color: '#00d2ff', fontFamily: 'JetBrains Mono, monospace' }}>⬆ {issuedCount} Issued</span>
              <span style={{ padding: '4px 10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '99px', fontSize: '9px', color: '#34d399', fontFamily: 'JetBrains Mono, monospace' }}>⬇ {returnedCount} Returned</span>
            </div>
          </div>

          {/* Records list */}
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '520px', overflowY: 'auto' }}>
            {issues.length === 0
              ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>📋</div>
                  <div style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.2em' }}>NO RECORDS YET</div>
                  <div style={{ color: 'rgba(255,255,255,0.1)', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', marginTop: '6px' }}>Issue a book to see it here instantly</div>
                </div>
              )
              : issues.map((item, i) => (
                <RecordItem key={item._id} item={item} idx={i} onDelete={setDeleteId} />
              ))
            }
          </div>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteId && (
        <Modal title="⚠ Confirm Delete" onClose={() => setDeleteId(null)}>
          <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', marginBottom: '24px' }}>This transaction record will be permanently removed.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <GlowButton onClick={() => setDeleteId(null)} color="rgba(255,255,255,0.4)">Cancel</GlowButton>
              <GlowButton onClick={() => handleDelete(deleteId)} color="#f87171">Delete</GlowButton>
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(16px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(8px)}   to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        select option        { background:#0a0a14; color:#fff; }
      `}</style>
    </div>
  )
}
