import React from 'react';
import PageTitle from './PageTitle';
import ThemeSwitcher from './ThemeSwitcher';
import UserMenu from '../auth/UserMenu';
import { IoSearch } from 'react-icons/io5';

const AppHeader = ({ onSearchClick }) => (
  <header className="container-fluid">
    <div className="header-container">
      <div className="header-box container-fluid d-flex justify-content-between align-items-center">
        <PageTitle />
        <div className="d-flex gap-2 align-items-center">
          <button type="button" className="bg-transparent border-0 search-trigger" onClick={onSearchClick} aria-label="Search">
            <IoSearch className="icon text fs-3" />
          </button>
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </div>
    </div>
  </header>
);

export default AppHeader;
