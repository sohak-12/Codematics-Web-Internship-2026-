import { useState, useEffect, useCallback } from 'react'
import { membersAPI } from '../api'
import { useToast } from '../context/ToastContext'
import { Modal, EmptyState, SearchBar, FormGroup, StyledInput, StyledSelect } from '../components/UI'

const DEPARTMENTS = ['Computer Science','Software Engineering','Mathematics','Physics','Chemistry','Business Administration','Electrical Engineering','Mechanical Engineering','Other']
const EMPTY_FORM = { memberId: '', name: '', department: '', contact: '', phone: '' }

function GlowButton({ onClick, children, color = '#00d2ff', disabled, type = 'button' }) {
  const [h, setH] = useState(false)
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        padding: '11px 24px', borderRadius: '12px', border: `1px solid ${color}44`, cursor: disabled ? 'not-allowed' : 'pointer',
        background: h ? color : `${color}22`, color: h ? '#000' : color,
        fontWeight: 800, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase',
        fontFamily: 'JetBrains Mono, monospace', transition: 'all 0.25s ease',
        boxShadow: h ? `0 0 30px ${color}66` : 'none', opacity: disabled ? 0.5 : 1,
      }}
    >{children}</button>
  )
}

export default function Members() {
  const { toast } = useToast()
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const load = useCallback(() => {
    membersAPI.getAll(search).then(r => setMembers(r.data || [])).catch(() => {})
  }, [search])

  useEffect(() => { load() }, [load])

  function f(key, val) { setForm(p => ({ ...p, [key]: val })) }
  function openAdd() { setForm(EMPTY_FORM); setModal('add') }
  function openEdit(m) { setForm(m); setModal({ type: 'edit', id: m._id }) }

  async function handleDelete(id) {
    try {
      await membersAPI.delete(id)
      setMembers(prev => prev.filter(m => m._id !== id))
      toast('Member deleted!', 'success')
    } catch { toast('Error deleting member', 'error') }
    setDeleteId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true)
    try {
      if (modal === 'add') {
        const r = await membersAPI.create(form); setMembers(prev => [...prev, r.data])
        toast('Member added!', 'success')
      } else {
        await membersAPI.update(modal.id, form); load()
        toast('Member updated!', 'success')
      }
      setModal(null); setForm(EMPTY_FORM)
    } catch (err) { toast(err.response?.data?.message || 'Error saving member', 'error') }
    finally { setLoading(false) }
  }

  const avatarColors = ['#00d2ff','#34d399','#a78bfa','#fbbf24','#f87171','#60a5fa']

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', animation: 'slideDown 0.5s ease both' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'rgba(0,210,255,0.6)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '6px' }}>👥 Member Registry</div>
          <h1 style={{ margin: 0, fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', lineHeight: 1, background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 60%, #00d2ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Members</h1>
        </div>
        <GlowButton onClick={openAdd}>+ Register Member</GlowButton>
      </div>

      {/* Table card */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', overflow: 'hidden', backdropFilter: 'blur(20px)', animation: 'slideUp 0.5s 0.1s ease both' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, department..." />
        </div>

        {members.length === 0 ? <EmptyState icon="👥" text="No members found" sub="Register your first member" /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['#', 'Member', 'ID', 'Department', 'Email', 'Phone', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.25em', fontFamily: 'JetBrains Mono, monospace' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => {
                  const color = avatarColors[i % avatarColors.length]
                  const initials = m.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '??'
                  return (
                    <tr key={m._id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,210,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 20px', fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>{String(i+1).padStart(2,'0')}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color, fontFamily: 'Syne, sans-serif', flexShrink: 0 }}>{initials}</div>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', fontFamily: 'Syne, sans-serif' }}>{m.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '12px', color: '#00d2ff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{m.memberId}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>{m.department}</span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: 'JetBrains Mono, monospace' }}>{m.contact}</td>
                      <td style={{ padding: '14px 20px', fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>{m.phone || '—'}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => openEdit(m)} style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(0,210,255,0.3)', background: 'rgba(0,210,255,0.08)', color: '#00d2ff', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.target.style.background='rgba(0,210,255,0.2)'; e.target.style.boxShadow='0 0 12px rgba(0,210,255,0.3)' }}
                            onMouseLeave={e => { e.target.style.background='rgba(0,210,255,0.08)'; e.target.style.boxShadow='none' }}
                          >EDIT</button>
                          <button onClick={() => setDeleteId(m._id)} style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)', color: '#f87171', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.target.style.background='rgba(248,113,113,0.2)'; e.target.style.boxShadow='0 0 12px rgba(248,113,113,0.3)' }}
                            onMouseLeave={e => { e.target.style.background='rgba(248,113,113,0.08)'; e.target.style.boxShadow='none' }}
                          >DEL</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? '+ Register Member' : '✏ Edit Member'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormGroup label="Member ID *" full><StyledInput required value={form.memberId} onChange={e => f('memberId', e.target.value)} placeholder="e.g. MEM-001" /></FormGroup>
            <FormGroup label="Full Name *" full><StyledInput required value={form.name} onChange={e => f('name', e.target.value)} placeholder="Full name" /></FormGroup>
            <FormGroup label="Department *">
              <StyledSelect required value={form.department} onChange={e => f('department', e.target.value)}>
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </StyledSelect>
            </FormGroup>
            <FormGroup label="Email *"><StyledInput type="email" required value={form.contact} onChange={e => f('contact', e.target.value)} placeholder="email@example.com" /></FormGroup>
            <FormGroup label="Phone" full><StyledInput value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="+92 300 0000000" /></FormGroup>
            <div style={{ gridColumn: 'span 2', marginTop: '4px' }}>
              <GlowButton type="submit" disabled={loading}>{loading ? 'Saving...' : '✓ Confirm Save'}</GlowButton>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <Modal title="⚠ Confirm Delete" onClose={() => setDeleteId(null)}>
          <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>👤</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', marginBottom: '24px' }}>This member will be permanently removed.</p>
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
