import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Check, LogOut, MapPin, ChevronLeft, Bold, Italic, List, ListOrdered, Save, Type, Heading2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const base = import.meta.env.BASE_URL
const ADMIN_PASSWORD = 'KPRAdmin2025'

const BLANK = {
  title: '',
  description: '',
  discipline: 'Technology',
  type: 'Hybrid',
  location: '',
  salary: '',
  benefits: [''],
  is_active: true,
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/* ── WYSIWYG Rich Text Editor ── */
function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null)
  const suppressSync = useRef(false)

  // Populate editor when value changes externally (e.g. opening a saved job)
  useEffect(() => {
    const el = editorRef.current
    if (!el || suppressSync.current) return
    if (el.innerHTML !== (value || '')) {
      el.innerHTML = value || ''
    }
  }, [value])

  const exec = useCallback((cmd, arg = null) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, arg)
    suppressSync.current = true
    onChange(editorRef.current.innerHTML)
    setTimeout(() => { suppressSync.current = false }, 0)
  }, [onChange])

  const handleInput = () => {
    suppressSync.current = true
    onChange(editorRef.current.innerHTML)
    setTimeout(() => { suppressSync.current = false }, 0)
  }

  const isActive = (cmd) => {
    try { return document.queryCommandState(cmd) } catch { return false }
  }

  return (
    <div className="rte-wrap">
      <div className="rte-toolbar">
        <button type="button" className={`rte-btn${isActive('bold') ? ' rte-btn--on' : ''}`} onMouseDown={e => { e.preventDefault(); exec('bold') }} title="Bold">
          <Bold size={14} />
        </button>
        <button type="button" className={`rte-btn${isActive('italic') ? ' rte-btn--on' : ''}`} onMouseDown={e => { e.preventDefault(); exec('italic') }} title="Italic">
          <Italic size={14} />
        </button>
        <button type="button" className={`rte-btn${isActive('underline') ? ' rte-btn--on' : ''}`} onMouseDown={e => { e.preventDefault(); exec('underline') }} title="Underline">
          <span style={{ fontWeight: 600, fontSize: 13, textDecoration: 'underline', lineHeight: 1 }}>U</span>
        </button>

        <div className="rte-divider" />

        <button type="button" className="rte-btn" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h2') }} title="Heading">
          <Heading2 size={14} />
        </button>
        <button type="button" className="rte-btn" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h3') }} title="Sub-heading">
          <span style={{ fontWeight: 700, fontSize: 11, lineHeight: 1 }}>H3</span>
        </button>
        <button type="button" className="rte-btn" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'p') }} title="Normal text">
          <Type size={14} />
        </button>

        <div className="rte-divider" />

        <button type="button" className="rte-btn" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList') }} title="Bullet list">
          <List size={14} />
        </button>
        <button type="button" className="rte-btn" onMouseDown={e => { e.preventDefault(); exec('insertOrderedList') }} title="Numbered list">
          <ListOrdered size={14} />
        </button>

        <div className="rte-divider" />

        <button type="button" className="rte-btn" onMouseDown={e => { e.preventDefault(); exec('removeFormat') }} title="Clear formatting">
          <span style={{ fontSize: 11, fontWeight: 600, lineHeight: 1 }}>Tx</span>
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={e => {
          // Ctrl/Cmd+B = bold, Ctrl/Cmd+I = italic
          if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); exec('bold') }
          if ((e.ctrlKey || e.metaKey) && e.key === 'i') { e.preventDefault(); exec('italic') }
        }}
        className="rte-body"
        data-placeholder="Write the full job description here…"
      />
    </div>
  )
}

/* ── Full-page document editor ── */
function JobEditor({ form, setForm, editing, saving, saveErr, onSave, onCancel }) {
  const setBenefit = (i, val) => {
    const b = [...form.benefits]; b[i] = val
    setForm(f => ({ ...f, benefits: b }))
  }

  return (
    <div className="admin-editor-wrap">
      {/* ── Sticky doc toolbar ── */}
      <div className="admin-editor-toolbar">
        <button className="admin-editor-back" type="button" onClick={onCancel}>
          <ChevronLeft size={16} /> All Roles
        </button>
        <span className="admin-editor-toolbar__title">
          {editing ? 'Edit Role' : 'New Role'}
        </span>
        <div className="admin-editor-toolbar__right">
          <label className="af-publish-toggle">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
            <span>{form.is_active ? 'Live' : 'Draft'}</span>
          </label>
          <button className="btn btn-green admin-editor-save" onClick={onSave} disabled={saving}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save Role'}
          </button>
        </div>
      </div>

      {saveErr && <div className="admin-editor-error">{saveErr}</div>}

      <div className="admin-editor-body">
        {/* ── Left: Title + Description ── */}
        <div className="admin-editor-main">

          {/* Title */}
          <div className="admin-editor-title-wrap">
            <input
              className="admin-editor-title-input"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Job title..."
              autoFocus
            />
          </div>

          {/* Description — WYSIWYG */}
          <div className="admin-editor-section">
            <div className="admin-editor-section__label">Job Description</div>
            <RichTextEditor
              value={form.description}
              onChange={val => setForm(f => ({ ...f, description: val }))}
            />
          </div>
        </div>

        {/* ── Right: Meta + Benefits ── */}
        <aside className="admin-editor-sidebar">

          <div className="admin-editor-meta-card">
            <div className="admin-editor-meta-title">Role Details</div>

            <div className="af-field">
              <label>Discipline</label>
              <select value={form.discipline} onChange={e => setForm(f => ({ ...f, discipline: e.target.value }))}>
                <option>Technology</option>
                <option>Commercial</option>
                <option>Data & AI</option>
              </select>
            </div>

            <div className="af-field">
              <label>Work Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>Onsite</option>
              </select>
            </div>

            <div className="af-field">
              <label><MapPin size={11} style={{ display:'inline', marginRight:4 }} />Location</label>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Milton Keynes (Hybrid)" />
            </div>

            <div className="af-field">
              <label>Salary</label>
              <input value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} placeholder="e.g. £60,000 – £75,000" />
            </div>
          </div>

          <div className="admin-editor-meta-card">
            <div className="admin-editor-meta-title">Benefits</div>
            <div className="af-benefits">
              {form.benefits.map((b, i) => (
                <div key={i} className="af-benefit-row">
                  <input value={b} onChange={e => setBenefit(i, e.target.value)} placeholder="e.g. 25 days holiday" />
                  {form.benefits.length > 1 && (
                    <button type="button" className="af-benefit-del" onClick={() => setForm(f => ({ ...f, benefits: f.benefits.filter((_, x) => x !== i) }))}>
                      <X size={13} />
                    </button>
                  )}
                </div>
              ))}
              {form.benefits.length < 8 && (
                <button type="button" className="af-add-benefit" onClick={() => setForm(f => ({ ...f, benefits: [...f.benefits, ''] }))}>
                  <Plus size={12} /> Add benefit
                </button>
              )}
            </div>
          </div>

          <button className="btn btn-green" style={{ width: '100%', justifyContent: 'center' }} onClick={onSave} disabled={saving}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save Role'}
          </button>
        </aside>
      </div>
    </div>
  )
}

export function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('kpr-admin') === '1')
  const [pw, setPw] = useState('')
  const [pwErr, setPwErr] = useState(false)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // 'list' | 'editor'
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saveErr, setSaveErr] = useState(null)

  const load = async () => {
    if (!supabase) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    setJobs(data || [])
    setLoading(false)
  }

  useEffect(() => { if (authed) load() }, [authed])

  const login = (e) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('kpr-admin', '1'); setAuthed(true) }
    else setPwErr(true)
  }
  const logout = () => { sessionStorage.removeItem('kpr-admin'); setAuthed(false) }

  const openAdd = () => { setForm(BLANK); setEditing(null); setSaveErr(null); setView('editor') }
  const openEdit = (job) => {
    setForm({
      title: job.title || '',
      description: job.description || '',
      discipline: job.discipline || 'Technology',
      type: job.type || 'Hybrid',
      location: job.location || '',
      salary: job.salary || '',
      benefits: job.benefits?.length ? job.benefits : [''],
      is_active: job.is_active ?? true,
    })
    setEditing(job.id)
    setSaveErr(null)
    setView('editor')
  }
  const closeEditor = () => { setView('list'); setEditing(null); setForm(BLANK) }

  const save = async () => {
    if (!supabase || !form.title.trim()) { setSaveErr('Job title is required.'); return }
    setSaving(true)
    const payload = { ...form, benefits: form.benefits.filter(b => b.trim()) }
    const result = editing
      ? await supabase.from('jobs').update(payload).eq('id', editing)
      : await supabase.from('jobs').insert(payload)
    if (result.error) { setSaveErr(result.error.message); setSaving(false); return }
    closeEditor()
    load()
    setSaving(false)
  }

  const confirmDelete = async () => {
    if (!supabase || !deleteTarget) return
    await supabase.from('jobs').delete().eq('id', deleteTarget)
    setDeleteTarget(null)
    load()
  }

  const toggleActive = async (job) => {
    if (!supabase) return
    await supabase.from('jobs').update({ is_active: !job.is_active }).eq('id', job.id)
    load()
  }

  /* ── LOGIN ── */
  if (!authed) return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <img src={`${base}logo-white.webp`} alt="Key Partnership" />
        </div>
        <h1 className="admin-login__title">Admin Portal</h1>
        <p className="admin-login__sub">Job Management</p>
        <form onSubmit={login}>
          <input
            type="password"
            className={`admin-login__input${pwErr ? ' admin-login__input--err' : ''}`}
            placeholder="Enter password"
            value={pw}
            onChange={e => { setPw(e.target.value); setPwErr(false) }}
            autoFocus
          />
          {pwErr && <p className="admin-login__error">Incorrect password. Try again.</p>}
          <button type="submit" className="btn btn-green admin-login__btn">Sign In</button>
        </form>
      </div>
    </div>
  )

  /* ── FULL-PAGE EDITOR ── */
  if (view === 'editor') return (
    <div className="admin-wrap">
      <JobEditor
        form={form}
        setForm={setForm}
        editing={editing}
        saving={saving}
        saveErr={saveErr}
        onSave={save}
        onCancel={closeEditor}
      />
    </div>
  )

  /* ── DASHBOARD LIST ── */
  const liveCount = jobs.filter(j => j.is_active).length

  return (
    <div className="admin-wrap">
      <header className="admin-header">
        <img src={`${base}logo-white.webp`} alt="Key Partnership" style={{ height: 30, filter: 'brightness(0) invert(1)' }} />
        <span className="admin-header__title">Job Management</span>
        <button className="admin-logout-btn" onClick={logout}><LogOut size={15} /> Sign Out</button>
      </header>

      <div className="admin-body">
        {!supabase && (
          <div className="admin-notice admin-notice--warn">
            <strong>Setup required:</strong> Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your environment to enable job management.
          </div>
        )}

        <div className="admin-controls">
          <div>
            <h2 className="admin-controls__heading">Live Roles</h2>
            <p className="admin-controls__sub">{liveCount} live · {jobs.length - liveCount} draft</p>
          </div>
          <button className="btn btn-green" onClick={openAdd} disabled={!supabase}>
            <Plus size={16} /> Add New Role
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">Loading roles...</div>
        ) : jobs.length === 0 ? (
          <div className="admin-empty">
            <p>No roles yet.</p>
            <button className="btn btn-green" onClick={openAdd} disabled={!supabase}><Plus size={15} /> Add your first role</button>
          </div>
        ) : (
          <div className="admin-jobs-list">
            {jobs.map(job => (
              <div key={job.id} className={`admin-job-card${job.is_active ? '' : ' admin-job-card--draft'}`}>
                <div className="admin-job-card__body" style={{ cursor: 'pointer' }} onClick={() => openEdit(job)}>
                  <div className="admin-job-card__badges">
                    <span className="job-badge" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{job.discipline}</span>
                    <span className="job-listing-type" style={{ fontSize: '0.7rem' }}>{job.type}</span>
                    {!job.is_active && <span className="admin-draft-badge">Draft</span>}
                  </div>
                  <h3 className="admin-job-card__title">{job.title}</h3>
                  <div className="admin-job-card__meta">
                    {job.location && <span><MapPin size={12} />{job.location}</span>}
                    {job.salary && <span>{job.salary}</span>}
                    <span style={{ opacity: 0.45 }}>Published {formatDate(job.created_at)}</span>
                  </div>
                  {job.benefits?.filter(Boolean).length > 0 && (
                    <div className="admin-job-card__benefits">
                      {job.benefits.filter(Boolean).map((b, i) => (
                        <span key={i} className="benefit-pill"><Check size={10} />{b}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="admin-job-card__actions">
                  <button className="admin-action-btn" onClick={() => toggleActive(job)} title={job.is_active ? 'Set to Draft' : 'Publish'}>
                    {job.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button className="admin-action-btn" onClick={() => openEdit(job)} title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button className="admin-action-btn admin-action-btn--danger" onClick={() => setDeleteTarget(job.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── DELETE CONFIRM ── */}
      {deleteTarget && (
        <div className="admin-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 8 }}>Delete this role?</h3>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>This action cannot be undone.</p>
            <div className="af-footer__actions" style={{ marginTop: 28 }}>
              <button className="btn admin-btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn admin-btn-delete" onClick={confirmDelete}>Delete Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
