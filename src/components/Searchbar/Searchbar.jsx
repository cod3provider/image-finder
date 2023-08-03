import { useState } from 'react';
import PropTypes from 'prop-types';
import s from './Searchbar.module.css';
import findIcon from '../../assets/img/search.svg';

const Searchbar = ({ onSubmit }) => {
  const [search, setSearch] = useState('');

  const handleChange = e => {
    setSearch(e.target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(search);
    reset();
  };

  const reset = () => {
    setSearch('');
  };

  return (
    <header className={s.searchbar}>
      <form className={s.form} onSubmit={handleSubmit}>
        <button type="submit" className={s.button}>
          <span className={s.buttonLabel}>Search</span>
          <img src={findIcon} alt="find icon" width="24" height="24"/>
        </button>

        <input
          className={s.input}
          type="text"
          name="search"
          value={search}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleChange}
          required
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
