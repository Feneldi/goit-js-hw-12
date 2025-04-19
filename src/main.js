import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  updateDatalist,
  showLoader,
  hideLoader,
} from './js/render-functions';


const form = document.querySelector('#search-form');
const input = form.elements['query'];
const gallery = document.querySelector('.gallery');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = input.value.trim();

  updateURL(query);

  if (!query) {
    iziToast.warning({
      message: 'Search query is empty. Please try again.',
      position: 'topRight',
      timeout: 2000,
    });
    return;
  }

  clearGallery();
  showLoader();

  try {
    const data = await getImagesByQuery(query);

    if (data.length === 0) {
      iziToast.info({
        message: 'No results found.',
        position: 'topRight',
        timeout: 2000,
      });
      return;
    }

    createGallery(data);
    lightbox.refresh();

    const tags = data
      .flatMap(img => img.tags.split(','))
      .map(t => t.trim().toLowerCase());
    const uniqueTags = [...new Set(tags)].slice(0, 10);
    updateDatalist(uniqueTags);

  } catch (error) {
    iziToast.error({
      message: `Error: ${error.message}`,
      position: 'topRight',
      timeout: 3000,
    });
  } finally {
    hideLoader();
  }
});

// Сохранение запроса в URL
function updateURL(query) {
  const url = new URL(window.location);
  if (query) {
    url.searchParams.set('q', query);
  } else {
    url.searchParams.delete('q');
  }
  history.pushState({}, '', url);
}

// Загрузка из URL при старте
window.addEventListener('DOMContentLoaded', () => {
  const urlQuery = new URLSearchParams(window.location.search).get('q');
  if (urlQuery) {
    input.value = urlQuery;
    form.dispatchEvent(new Event('submit'));
  }
});
