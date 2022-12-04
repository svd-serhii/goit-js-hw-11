import axios from 'axios';

export default async function fetchPixabay(data, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '31646897-e0e737d73d0d9524e45efe21c';
  const SETTINGS = `?key=${KEY}&q=${data}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  return await axios.get(`${BASE_URL}${SETTINGS}`).then(res => res.data);
}
