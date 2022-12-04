import { refs } from './js/refs';
import fetchPixabay from './js/pixabay';
import scroll from './js/scroll';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

refs.form.addEventListener('submit', onFormSubmit);

let searchData = '';
let page = 1;
let perPage = 0;

async function onFormSubmit(e) {
  e.preventDefault();
  searchData = e.currentTarget.searchQuery.value;
  page = 1;
  if (searchData.trim() === '') {
    Notiflix.Notify.failure('Please enter your search data.', {
      clickToClose: true,
    });
    return;
  }
  const response = await fetchPixabay(searchData, page);
  perPage = response.hits.length;

  if (response.totalHits <= perPage) {
    addIsHidden();
  } else {
    removeIsHidden();
  }

  if (response.totalHits === 0) {
    clearGallery();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again!',
      { clickToClose: true }
    );
  }
  try {
    if (response.totalHits > 0) {
      Notiflix.Notify.info(`Hooray! We found ${response.totalHits} images`, {
        clickToClose: true,
      });
      clearGallery();
      renderCardMarkup(response.hits);
    }
  } catch (error) {
    console.log(error);
  }
}

refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onLoadMore() {
  try {
    refs.loadMoreBtn.disabled = true;
    pageIncrement();
    const response = await fetchPixabay(searchData, page);
    renderCardMarkup(response.hits);
    perPage += response.hits.length;
    scroll();
    if (perPage <= response.totalHits) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results.",
        { clickToClose: true }
      );
      addIsHidden();
    }
    refs.loadMoreBtn.disabled = false;
  } catch (error) {
    console.log(error);
  }
}

function lightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
  lightbox.refresh();
}

function renderCardMarkup(hits) {
  const cardMarkup = hits
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
      }) => {
        return `<div class="photo-card">
  <a class='photo-card__link' href='${largeImageURL}'><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>Views</b>
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <b>${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', cardMarkup);
  lightbox();
}

function addIsHidden() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function removeIsHidden() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function pageIncrement() {
  page += 1;
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
