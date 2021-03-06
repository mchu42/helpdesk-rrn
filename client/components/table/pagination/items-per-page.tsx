import React, { StatelessComponent, ChangeEvent } from 'react';
import i18next from 'i18next';
import { ITEMS_PER_PAGE_OPTIONS } from 'client-constants';

interface IProps {
  itemsPerPage: number;
  itemsCount: number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}
const ItemsPerPage: StatelessComponent<IProps> = ({ itemsPerPage, itemsCount, onChange }) => {
  const itemsPerPageOptions = ITEMS_PER_PAGE_OPTIONS.filter(value => (value < itemsCount));

  return (
    <div className="table__pagination-per-page">
      <span>{i18next.t('rows_per_page')}:</span>
      <select
        className="select select_pagination"
        onChange={onChange}
        value={itemsPerPage}
      >
        {itemsPerPageOptions.map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
        <option value={itemsCount}>
          {i18next.t('all')}
        </option>
      </select>
    </div>
  );
};

export default ItemsPerPage;
