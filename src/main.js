import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getImagesByQuery } from './js/pixabay-api';
import {
  appendToGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  updateDatalist,
  lightbox,
} from './js/render-functions';

const form = document.querySelector('#search-form');
const input = form.elements['query'];
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
const perPage = 15;
let totalImages = 0;

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = input.value.trim();

  if (!query) {
    iziToast.warning({
      message: 'Search query is empty. Please try again.',
      position: 'topRight',
      timeout: 2000,
    });
    return;
  }

  page = 1;
  await fetchImages(query);
});

loadMoreBtn.addEventListener('click', async () => {
  page++;
  await fetchImages(input.value.trim());
  scrollToNewContent();
});

function scrollToNewContent() {
  const firstCard = document.querySelector(".gallery .gallery-item");
  if (firstCard) {
    const cardHeight = firstCard.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  }
}

async function fetchImages(query) {
  showLoader();
  hideLoadMoreButton();

  try {
    const response = await getImagesByQuery(query, page);
    const data = response.hits;

    if (page === 1) clearGallery();

    if (data.length === 0 && page === 1) {
      iziToast.info({
        message: 'No results found.',
        position: 'topRight',
        timeout: 2000,
      });
      return;
    }

    appendToGallery(data);
    lightbox.refresh();

    const tags = data.flatMap(img => img.tags.split(',')).map(t => t.trim().toLowerCase());
    const uniqueTags = [...new Set(tags)].slice(0, 10);
    updateDatalist(uniqueTags);

    totalImages = response.totalHits;
    if (totalImages > perPage * page) {
      showLoadMoreButton();
    } else if (page !== 1) {
      iziToast.info({
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
        timeout: 2000,
      });
    }

    updateURL(query, page);

  } catch (error) {
    iziToast.error({
      message: `Error: ${error.message}`,
      position: 'topRight',
      timeout: 3000,
    });
  } finally {
    hideLoader();
  }
}

function updateURL(query, page) {
  const url = new URL(window.location);
  if (query) url.searchParams.set('q', query);
  if (page > 1) url.searchParams.set('p', page);
  else url.searchParams.delete('p');
  history.pushState({}, '', url);
}

window.addEventListener('DOMContentLoaded', () => {
  input.focus();
  const params = new URLSearchParams(window.location.search);
  const urlQuery = params.get('q');
  page = parseInt(params.get('p')) || 1;

  if (urlQuery) {
    input.value = urlQuery;
    fetchImages(urlQuery);
  }
});
