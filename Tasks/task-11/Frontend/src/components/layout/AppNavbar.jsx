import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HiOutlineUserGroup, HiUserGroup } from 'react-icons/hi2';
import { BiMovie, BiSolidMovie, BiSolidTv, BiTv } from 'react-icons/bi';
import { RiHome5Line, RiHome5Fill } from 'react-icons/ri';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const AppNavbar = () => {
  const { pathname } = useLocation();
  const isActive = (base) => {
    const isDetail = /^\/(movies|tv-shows|people)\/\d+$/.test(pathname);
    return pathname.startsWith(base) && !isDetail;
  };

  const ripple = (e) => {
    const el = e.currentTarget;
    const circle = document.createElement('span');
    const d = Math.max(el.clientWidth, el.clientHeight);
    const r = d / 2;
    circle.style.width = circle.style.height = `${d}px`;
    circle.style.left = `${e.clientX - el.getBoundingClientRect().left - r}px`;
    circle.style.top = `${e.clientY - el.getBoundingClientRect().top - r}px`;
    circle.classList.add('ripple');
    el.querySelector('.ripple')?.remove();
    el.appendChild(circle);
  };

  const tabs = [
    { to: '/', label: 'Home', active: pathname === '/', Fill: RiHome5Fill, Outline: RiHome5Line },
    { to: '/movies', label: 'Movies', active: isActive('/movies'), Fill: BiSolidMovie, Outline: BiMovie },
    { to: '/tv-shows', label: 'TV Shows', active: isActive('/tv-shows'), Fill: BiSolidTv, Outline: BiTv },
    { to: '/watchlist', label: 'Watchlist', active: pathname === '/watchlist', Fill: FaHeart, Outline: FiHeart },
    { to: '/people/popular', label: 'People', active: isActive('/people'), Fill: HiUserGroup, Outline: HiOutlineUserGroup },
  ];

  return (
    <div className="navbar-container">
      <div className="navbar">
        {tabs.map(({ to, label, active, Fill, Outline }) => (
          <div key={to} className="nav-link-wrapper" onClick={ripple}>
            <Link to={to} className={`nav-item ${active ? 'active' : ''}`}>
              <div className="nav-btn">
                <Fill className="fill" /><Outline className="outline" /><p>{label}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppNavbar;
