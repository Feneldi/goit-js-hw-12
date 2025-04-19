import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Селекторы
const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

// Инициализация lightbox
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

/**
 * Рендерит галерею изображений.
 *
 * @param {Array<Object>} images - Массив объектов изображений от Pixabay API.
 * Каждый объект должен содержать свойства:
 * webformatURL, largeImageURL, tags, likes, views, comments, downloads.
 */
export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="gallery-item">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p><b>Likes:</b> ${likes}</p>
          <p><b>Views:</b> ${views}</p>
          <p><b>Comments:</b> ${comments}</p>
          <p><b>Downloads:</b> ${downloads}</p>
        </div>
      </li>
    `
    )
    .join('');

  galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

/**
 * Очищает контейнер галереи от изображений.
 */
export function clearGallery() {
  galleryContainer.innerHTML = '';
}

/**
 * Показывает индикатор загрузки (лоадер).
 */
export function showLoader() {
  loader.classList.add('visible');
}

/**
 * Скрывает индикатор загрузки (лоадер).
 */
export function hideLoader() {
  loader.classList.remove('visible');
}

/**
 * Обновляет список автодополнения в <datalist>.
 * @param {string[]} tags - Массив уникальных тегов.
 */
export function updateDatalist(tags) {
  const datalist = document.querySelector('#breeds-list');
  if (!datalist) return;

  datalist.innerHTML = tags
    .map(tag => `<option value="${tag}"></option>`)
    .join('');
}
