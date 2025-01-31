import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ categoryPath }) => {
  const breadcrumbStyle = {
    backgroundColor: 'rgb(244, 244, 244)', // light gray background
    padding: '10px',
    color: '#000',
  };

  if (!categoryPath) {
    return (
      <nav className="text-sm mb-2 futura" style={breadcrumbStyle}>
        <Link to="/catalog">Catalog</Link>
      </nav>
    );
  }

  const segments = categoryPath
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, ' ')); // remove empty strings and replace hyphens with spaces

  return (
    <nav className="text-sm mb-2 futura" style={breadcrumbStyle}>
      <Link to="/catalog">Catalog</Link>
      {segments.map((segment, idx) => {
        const pathUrl = `/catalog/${categoryPath
          .split('/')
          .slice(0, idx + 1)
          .join('/')}`; // keep hyphens in the path
        return (
          <span key={idx}>
            {' > '}
            <Link to={pathUrl}>{segment}</Link>
          </span>
        );
      })}
    </nav>
  );
};
export default Breadcrumb;
