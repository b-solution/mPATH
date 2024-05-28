import axios from 'axios'
import humps from 'humps'

const http = axios.create({
  headers: {
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').attributes['content'].value,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'X-Key-Inflection': 'camel'
  },
  transformResponse: [
    ...axios.defaults.transformResponse,
    data => humps.camelizeKeys(data)
  ],
  transformRequest: [
    data => humps.decamelizeKeys(data),
    ...axios.defaults.transformRequest
  ]
})
// Set the AUTH token for any request
http.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers['x-token'] =  token ? `${token}` : '';
  return config;
});
export default http;
