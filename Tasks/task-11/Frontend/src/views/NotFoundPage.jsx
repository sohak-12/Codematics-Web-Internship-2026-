import React from 'react';
import { Link } from 'react-router-dom';
import usePageTitle from '../lib/metadata';
import { FaArrowLeft } from 'react-icons/fa6';
import { BiMoviePlay } from 'react-icons/bi';

const NotFoundPage = () => {
  usePageTitle('404 Not Found');
  return (
    <section className="container-md d-flex justify-content-center align-items-center flex-column" style={{ minHeight: '85vh' }}>
      <div className="not-found-container text-center">
        <BiMoviePlay className="text-primary mb-3" style={{ fontSize: '3rem', opacity: 0.5 }} />
        <p className="not-found-code">404</p>
        <p className="text fw-bold fs-4 mb-1">Scene Not Found</p>
        <p className="not-found-text">This page seems to have left the theater. Let's get you back to the show.</p>
        <Link to="/" className="btn btn-primary not-found-btn d-inline-flex align-items-center gap-2">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
      <img src="/404.svg" alt="404 not found" className="not-found-img mt-4" />
    </section>
  );
};

export default NotFoundPage;
