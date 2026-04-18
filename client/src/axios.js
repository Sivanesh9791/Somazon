import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://somazon-backend-767v.onrender.com/api'
})

export default instance
