import axios from 'axios';

const API_KEY = '39113555-125c4bf310951cf7ae23320a5';
const BASE_URL = 'https://pixabay.com/api/';

async function getImg(value, page) {
  axios.defaults.params = {
    key: API_KEY,
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 12,
    page: page,
  };
  return await axios.get(BASE_URL);
}

export  { getImg };