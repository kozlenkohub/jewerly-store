import FilterItem from './FilterItem';

const Filters = () => {
  const filters = {
    categories: {
      label: 'Categories',
      options: ['Rings', 'Earrings', 'Pendants'],
    },
    metals: {
      label: 'Metals',
      options: ['Gold', 'Silver', 'Platinum'],
    },
    cutForms: {
      label: 'Cut Forms',
      options: ['Round', 'Princess', 'Emerald', 'Oval'],
    },
    carats: {
      label: 'Carats',
      options: ['0.3 - 0.5', '0.51 - 0.6', '0.61 - 0.7', '0.71 - 3'],
    },
  };

  return (
    <>
      <FilterItem label={filters.categories.label} options={filters.categories.options} />
      <FilterItem label={filters.metals.label} options={filters.metals.options} />
      <FilterItem label={filters.cutForms.label} options={filters.cutForms.options} />
      <FilterItem label={filters.carats.label} options={filters.carats.options} />
    </>
  );
};

export default Filters;
