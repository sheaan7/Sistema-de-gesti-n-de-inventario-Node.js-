const axios = require('axios');
const config = require('../config/env');

class ExternalApiService {
  constructor() {
    this.baseURL = config.EXTERNAL_API_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000
    });
  }

  async getAllProducts() {
    try {
      const response = await this.client.get('/products');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo productos externos:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getProductById(id) {
    try {
      const response = await this.client.get(`/products/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Error obteniendo producto ${id}:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCategories() {
    try {
      const response = await this.client.get('/products/categories');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error obteniendo categorías:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getProductsByCategory(category) {
    try {
      const response = await this.client.get(`/products/category/${category}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Error obteniendo productos de categoría ${category}:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ExternalApiService();