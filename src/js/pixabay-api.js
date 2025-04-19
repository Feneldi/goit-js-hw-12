import axios from "axios";

/**
 * Уникальный ключ доступа к API Pixabay.
 * @type {string}
 */
const myApiKey = "49804709-aae3b3a79effefed9454c2d6d";

/**
 * Выполняет запрос к Pixabay API и получает изображения по заданному запросу.
 *
 * @param {string} query - Поисковая строка (например, "cat", "nature" и т.д.).
 * @returns {Promise<Array<Object>>} Промис с массивом объектов изображений (hits).
 */
export function getImagesByQuery(query) {
  return axios("https://pixabay.com/api/", {
    params: {
      key: myApiKey,
      q: query,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
    },
  }).then(response => response.data.hits);
}
