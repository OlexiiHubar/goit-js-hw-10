import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  inputValue: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.inputValue.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const inputValueTrimed = refs.inputValue.value.trim();
  if (inputValueTrimed.length === 0) {
    clearMarkup(refs.countryList);
    clearMarkup(refs.countryInfo);
  } else {
    fetchCountries(inputValueTrimed).then(onResponce).catch(onError);
  }
}

function onResponce(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length >= 2 && data.length <= 10) {
    createMarkupLsit(data);
  } else {
    createMarkupElem(data[0]);
  }
}

function onError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  clearMarkup(refs.countryList);
  clearMarkup(refs.countryInfo);
}

function createMarkupLsit(countries) {
  const markup = countries
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.svg}" alt="${name.official}" width = 60 hight = 60><span>${name.official}</span></li>`
    )
    .join('');
  clearMarkup(refs.countryInfo);
  insertMarkup(refs.countryList, markup);
}

function createMarkupElem({ name, flags, languages, population, capital }) {
  const markup = `<div class="card">
    <div class="card-img">
        <img src="${flags.svg}" alt="${name.official}" width = 60 hight = 60>
    </div>
    <div class="card-body">
        <h2 class="card-title">${name.official}</h2>
        <p class="card-text">Capital: ${capital}</p>
        <p class="card-text">Population: ${population}</p>
        <p class="card-text">Languages: ${Object.values(languages)}</p>
    </div>
    </div>`;
  clearMarkup(refs.countryList);
  insertMarkup(refs.countryInfo, markup);
}
function clearMarkup(elem) {
  elem.innerHTML = '';
}
function insertMarkup(elem, markup) {
  elem.innerHTML = markup;
}
