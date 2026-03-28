import React, { useState } from 'react';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { GrSystem } from 'react-icons/gr';
import { FiSettings, FiCopy, FiCheck } from 'react-icons/fi';
import useAppTheme from '../../lib/themeManager';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useAppTheme();
  const [copied, setCopied] = useState(false);
  const isActive = (t) => theme === t ? 'active-theme' : '';

  const copyLink = async (e) => {
    e.preventDefault(); e.stopPropagation();
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (err) { console.error('Copy failed:', err); }
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle custom" type="button" id="themeDropdown" data-bs-toggle="dropdown" aria-expanded="false">
        <FiSettings className="text fs-4" />
      </button>
      <ul className="dropdown-menu" aria-labelledby="themeDropdown">
        <li><button className={`dropdown-item d-flex justify-content-between align-items-center ${isActive('light')}`} onClick={() => setTheme('light')}><small>Light</small> <MdLightMode /></button></li>
        <li><button className={`dropdown-item d-flex justify-content-between align-items-center ${isActive('dark')}`} onClick={() => setTheme('dark')}><small>Dark</small> <MdDarkMode /></button></li>
        <li><button className={`dropdown-item d-flex justify-content-between align-items-center ${isActive('system')}`} onClick={() => setTheme('system')}><small>System</small> <GrSystem /></button></li>
        <hr className="dropdown-divider" />
        <li><button className="dropdown-item d-flex justify-content-between align-items-center" onClick={copyLink}><small>{copied ? 'Copied!' : 'Copy Link'}</small> {copied ? <FiCheck /> : <FiCopy />}</button></li>
      </ul>
    </div>
  );
};

export default ThemeSwitcher;
