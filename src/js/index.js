import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const API_KEY = 38129363 - ebf30580ea635c0303c0013d8;
const BASE_URL = 'https://pixabay.com/api/';

let page = 1;
let currentSearchQuery = '';

const lightbox = new SimpleLightbox('.photo-card a');

form.addEventListener('submit', handleFormSubmit);
loadMoreButton.addEventListener('click', loadMoreImages);

hideLoadMoreButton();

async function fetchImages(searchQuery) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    const images = response.data.hits;
    const totalHits = response.data.totalHits;
    if (images.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      hideLoadMoreButton();
    } else {
      gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(images));
      lightbox.refresh();
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
      if (totalHits - page * 40 <= 0) {
        hideLoadMoreButton();
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        showLoadMoreButton();
      }
      page += 1;
    }
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Oops! Something went wrong. Please try again later.'
    );
  }
}
