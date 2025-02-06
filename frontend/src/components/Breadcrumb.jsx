import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Breadcrumb = ({ categoryPath }) => {
  const { t } = useTranslation();
  const categories = useSelector((state) => state.category.category);

  const breadcrumbStyle = {
    backgroundColor: 'rgb(244, 244, 244)', // light gray background
    padding: '10px',
    color: '#000',
  };

  const findCategoryNameBySlug = (slug) => {
    const findCategory = (categories, slug) => {
      for (const category of categories) {
        if (category.slug === slug) {
          return category.name;
        }
        if (category.children.length > 0) {
          const childCategory = findCategory(category.children, slug);
          if (childCategory) {
            return childCategory;
          }
        }
      }
      return null;
    };
    return findCategory(categories, slug);
  };

  if (!categoryPath) {
    return (
      <nav className="text-sm mb-2 futura" style={breadcrumbStyle}>
        <Link to="/catalog">{t('breadcrumb.catalog')}</Link>
      </nav>
    );
  }

  const segments = categoryPath
    .split('/')
    .filter(Boolean)
    .map((segment) => findCategoryNameBySlug(segment) || segment.replace(/-/g, ' ')); // remove empty strings and replace hyphens with spaces

  return (
    <nav className="text-sm mb-2 futura" style={breadcrumbStyle}>
      <Link to="/catalog">{t('breadcrumb.catalog')}</Link>
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
