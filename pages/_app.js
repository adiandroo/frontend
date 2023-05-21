// _app.js
import App from 'next/app';
import axios from 'axios';
import { Router } from 'next/router';
import '../styles/globals.css';

let api; // Deklarasikan variabel api di luar kelas MyApp

class MyApp extends App {
  componentDidMount() {
    Router.events.on('routeChangeComplete', this.handleRouteChange);
  }

  componentWillUnmount() {
    Router.events.off('routeChangeComplete', this.handleRouteChange);
  }

  handleRouteChange = (url) => {
    // Middleware logic here
    console.log('Route changed to:', url);
  };

  render() {
    const { Component, pageProps } = this.props;

    // Mendapatkan token JWT dari endpoint /jwt
    async function getToken() {
      try {
        const response = await axios.get('http://localhost:3001/jwt');
        return response.data.token;
      } catch (error) {
        console.error(error);
        return null;
      }
    }

    api = axios.create({ // Assign nilai variabel api di sini
      baseURL: 'http://localhost:3001/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Mendapatkan token JWT dari endpoint /jwt dan mengatur nilai token di header Authorization
    api.interceptors.request.use(async (config) => {
      try {
        const response = await axios.get('http://localhost:3001/jwt');
        const token = response.data.token;
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error(error);
      }
      return config;
    });

    return <Component {...pageProps} api={api} />;
  }
}

export { api };
export default MyApp;
