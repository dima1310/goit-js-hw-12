import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.search-form');
let query = '';
let page = 1;
let totalHits = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();
  query = event.target.elements.searchQuery.value.trim();
  page = 1;
  clearGallery();
  hideLoadMoreButton();

  if (!query) return;

  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({ message: 'No images found. Try again!' });
      return;
    }

    createGallery(data.hits);
    if (totalHits > 15) showLoadMoreButton();
  } catch (error) {
    iziToast.error({ message: 'Something went wrong!' });
  } finally {
    hideLoader();
  }
});

document.querySelector('.load-more').addEventListener('click', async () => {
  page += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    const cardHeight = document
      .querySelector('.gallery a')
      .getBoundingClientRect().height;
    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });

    const shownImages = document.querySelectorAll('.gallery a').length;
    if (shownImages >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({ message: 'Something went wrong!' });
  } finally {
    hideLoader();
  }
});
