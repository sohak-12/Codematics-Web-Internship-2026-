import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { IoCloseOutline, IoEye, IoEyeOff } from 'react-icons/io5';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AuthModal = () => {
  const [mode, setMode] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const { login, register: signUp, loginWithGoogle, resendVerification } = useAuth();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm();
  const pw = watch('password', '');

  // Listen for custom event to set mode from outside
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.mode) {
        setMode(e.detail.mode);
        setVerificationSent(false);
        reset();
      }
    };
    window.addEventListener('authModalOpen', handler);
    return () => window.removeEventListener('authModalOpen', handler);
  }, [reset]);

  const pwStrength = (p) => {
    if (!p) return { level: 0, label: '', color: '' };
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    if (s <= 1) return { level: 1, label: 'Weak', color: '#ef4444' };
    if (s <= 3) return { level: 2, label: 'Medium', color: '#f59e0b' };
    return { level: 3, label: 'Strong', color: '#22c55e' };
  };

  const strength = pwStrength(pw);

  const closeModal = () => {
    const el = document.getElementById('authModal');
    window.bootstrap.Modal.getInstance(el)?.hide();
  };

  const onSubmit = async (data) => {
    try {
      if (mode === 'login') {
        await login(data.email, data.password);
        closeModal();
      } else {
        await signUp(data.email, data.password, data.name);
        setVerificationSent(true);
      }
      reset();
    } catch (err) {
      const map = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'This email is already registered',
        'auth/weak-password': 'Password must be at least 6 characters',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/too-many-requests': 'Too many attempts. Try again later',
      };
      toast.error(map[err.code] || 'Authentication failed. Please try again.');
    }
  };

  const handleGoogle = async () => {
    try { await loginWithGoogle(); closeModal(); }
    catch { toast.error('Google sign-in failed'); }
  };

  const handleResend = async () => {
    try { await resendVerification(); }
    catch { toast.error('Failed to resend. Try again later.'); }
  };

  const switchMode = (m) => { setMode(m); setVerificationSent(false); reset(); };

  const inputStyle = { background: 'var(--bg-primary)', border: '1.5px solid var(--divider)', color: 'var(--text-primary)', fontSize: '0.9rem', transition: 'all 0.2s ease' };
  const iconBoxStyle = { background: 'var(--bg-primary)', border: '1.5px solid var(--divider)', borderRight: 'none', color: 'var(--text-muted)' };

  return (
    <div className="modal fade" id="authModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
        <div className="modal-content border-0" style={{ borderRadius: 20, overflow: 'hidden' }}>

          {/* Header with gradient accent */}
          <div style={{ background: 'linear-gradient(135deg, #7c3aed, #38bdf8)', padding: '24px 24px 20px' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: '#fff', fontSize: '1.2rem' }}>
                  {verificationSent ? 'Verify Your Email' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h5>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', margin: 0 }}>
                  {verificationSent ? 'One more step to get started' : mode === 'login' ? 'Sign in to your PrimeFlix account' : 'Join PrimeFlix for free'}
                </p>
              </div>
              <button type="button" className="border-0 p-1 d-flex" style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8 }} data-bs-dismiss="modal">
                <IoCloseOutline style={{ color: '#fff', fontSize: '1.3rem' }} />
              </button>
            </div>
          </div>

          <div style={{ padding: '20px 24px 24px' }}>

            {/* Email Verification Sent State */}
            {verificationSent ? (
              <div className="text-center">
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <HiOutlineShieldCheck style={{ fontSize: '2rem', color: 'var(--accent)' }} />
                </div>
                <p className="text fw-bold mb-1">Check Your Inbox</p>
                <p className="text-secondary" style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                  We've sent a verification link to your email. Click the link to activate your account.
                </p>
                <button onClick={handleResend} className="btn btn-link p-0 fw-bold" style={{ fontSize: '0.85rem' }}>Resend verification email</button>
                <div className="hr my-3"></div>
                <button onClick={() => switchMode('login')} className="btn btn-primary w-100 py-2 fw-bold" style={{ borderRadius: 10 }}>
                  Continue to Sign In
                </button>
              </div>
            ) : (
              <>
                {/* Google OAuth */}
                <button onClick={handleGoogle} type="button" className="btn w-100 d-flex align-items-center justify-content-center gap-2 fw-bold" style={{ ...inputStyle, padding: '10px', borderRadius: 10, fontSize: '0.88rem' }}>
                  <FcGoogle style={{ fontSize: '1.2rem' }} /> Continue with Google
                </button>

                <div className="d-flex align-items-center gap-3 my-3">
                  <div style={{ flex: 1, height: 1, background: 'var(--divider)' }}></div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 500 }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--divider)' }}></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  {mode === 'signup' && (
                    <div className="mb-3">
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ ...iconBoxStyle, borderRadius: '10px 0 0 10px' }}><HiOutlineUser /></span>
                        <input {...register('name', { required: mode === 'signup' && 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} className="form-control" placeholder="John Doe" style={{ ...inputStyle, borderLeft: 'none', borderRadius: '0 10px 10px 0', padding: '10px 12px' }} />
                      </div>
                      {errors.name && <small style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>{errors.name.message}</small>}
                    </div>
                  )}

                  <div className="mb-3">
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ ...iconBoxStyle, borderRadius: '10px 0 0 10px' }}><HiOutlineMail /></span>
                      <input {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })} type="email" className="form-control" placeholder="you@example.com" style={{ ...inputStyle, borderLeft: 'none', borderRadius: '0 10px 10px 0', padding: '10px 12px' }} />
                    </div>
                    {errors.email && <small style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>{errors.email.message}</small>}
                  </div>

                  <div className="mb-3">
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Password</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ ...iconBoxStyle, borderRadius: '10px 0 0 10px' }}><HiOutlineLockClosed /></span>
                      <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} type={showPw ? 'text' : 'password'} className="form-control" placeholder="••••••••" style={{ ...inputStyle, borderLeft: 'none', borderRight: 'none', padding: '10px 12px' }} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="input-group-text" style={{ ...iconBoxStyle, borderLeft: 'none', borderRight: '1.5px solid var(--divider)', borderRadius: '0 10px 10px 0', cursor: 'pointer' }}>
                        {showPw ? <IoEyeOff /> : <IoEye />}
                      </button>
                    </div>
                    {errors.password && <small style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block' }}>{errors.password.message}</small>}

                    {/* Password Strength Bar */}
                    {mode === 'signup' && pw && (
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <div style={{ flex: 1, height: 3, borderRadius: 3, background: 'var(--divider)', overflow: 'hidden' }}>
                          <div style={{ width: `${(strength.level / 3) * 100}%`, height: '100%', background: strength.color, borderRadius: 3, transition: 'all 0.3s ease' }}></div>
                        </div>
                        <small style={{ color: strength.color, fontSize: '0.72rem', fontWeight: 600, minWidth: 45 }}>{strength.label}</small>
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100 fw-bold" style={{ padding: '11px', borderRadius: 10, fontSize: '0.9rem' }}>
                    {isSubmitting ? (
                      <span className="d-flex align-items-center justify-content-center gap-2">
                        <span className="spinner-border spinner-border-sm"></span> Processing...
                      </span>
                    ) : mode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <p className="text-center mb-0" style={{ marginTop: 16 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')} className="btn p-0 fw-bold" style={{ color: 'var(--accent)', fontSize: '0.82rem', border: 'none', background: 'none' }}>
                      {mode === 'login' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
