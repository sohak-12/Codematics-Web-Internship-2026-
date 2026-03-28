import React from 'react';
import Section from './Section';
import { FaGithub } from 'react-icons/fa';
import { BiMoviePlay } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi2';

const AppFooter = () => (
  <footer className="app-footer">
    <Section>
      <div className="d-flex gap-2 justify-content-center align-items-center flex-column mb-5 py-sm-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <BiMoviePlay className="header-logo fs-3" />
          <span className="header-logo fw-bold fs-5">PrimeFlix</span>
          <HiSparkles className="text-primary" style={{ fontSize: '0.8rem' }} />
        </div>
        <p className="text-secondary text-center mb-2" style={{ fontSize: '0.82rem', maxWidth: 320, lineHeight: 1.6 }}>
          Your ultimate destination for discovering movies, TV shows & artists.
        </p>
        <a href="https://github.com" className="text-secondary fs-3 footer-github" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        <small className="text-secondary text-center">&copy;{new Date().getFullYear()} PrimeFlix. All rights reserved.</small>
        <small className="text-secondary text-center">Data provided by <a href="https://www.themoviedb.org/" className="text-secondary fw-normal" target="_blank" rel="noopener noreferrer">TMDb</a></small>
        <small className="text-center mt-2" style={{ color: 'var(--text-muted)', opacity: 0.7, fontSize: '0.72rem', letterSpacing: '0.03em' }}>Developed by <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>Soha Muzammil</span></small>
      </div>
    </Section>
  </footer>
);

export default AppFooter;
