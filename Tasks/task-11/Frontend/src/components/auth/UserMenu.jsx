import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiHeart, FiUser } from 'react-icons/fi';

const UserMenu = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <button className="btn btn-sm btn-primary rounded-5 px-3 py-1 d-flex align-items-center gap-1" data-bs-toggle="modal" data-bs-target="#authModal">
        <FiUser /> Sign In
      </button>
    );
  }

  const initial = (user.displayName || user.email || 'U')[0].toUpperCase();

  return (
    <div className="dropdown">
      <button className="dropdown-toggle custom" type="button" data-bs-toggle="dropdown" aria-expanded="false"
        style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7c3aed, #38bdf8)', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
        {user.photoURL ? <img src={user.photoURL} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} /> : initial}
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li className="px-3 py-2">
          <small className="text fw-bold d-block" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.displayName || 'User'}</small>
          <small className="text-secondary" style={{ fontSize: '0.75rem', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{user.email}</small>
        </li>
        <hr className="dropdown-divider" />
        <li><Link to="/watchlist" className="dropdown-item d-flex align-items-center gap-2"><FiHeart /> <small>My Watchlist</small></Link></li>
        <li><button onClick={logout} className="dropdown-item d-flex align-items-center gap-2"><FiLogOut /> <small>Sign Out</small></button></li>
      </ul>
    </div>
  );
};

export default UserMenu;
