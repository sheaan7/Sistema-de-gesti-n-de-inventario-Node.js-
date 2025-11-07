const database = require('../config/database');
const Product = require('../models/Product');

class ProductController {
  // GET /api/products
  getAllProducts(req, res) {
    try {
      const products = database.findAll();
      res.json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener productos',
        message: error.message
      });
    }
  }

  // GET /api/products/:id
  getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = database.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener producto',
        message: error.message
      });
    }
  }

  // POST /api/products
  createProduct(req, res) {
    try {
      const validation = Product.validate(req.body);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          details: validation.errors
        });
      }

      const newProduct = database.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: newProduct
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al crear producto',
        message: error.message
      });
    }
  }

  // PUT /api/products/:id
  updateProduct(req, res) {
    try {
      const { id } = req.params;
      const product = database.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      const validation = Product.validate({ ...product, ...req.body });

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          details: validation.errors
        });
      }

      const updatedProduct = database.update(id, req.body);

      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: updatedProduct
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar producto',
        message: error.message
      });
    }
  }

  // DELETE /api/products/:id
  deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deleted = database.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al eliminar producto',
        message: error.message
      });
    }
  }

  // GET /api/products/category/:category
  getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const products = database.findAll();
      const filtered = products.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );

      res.json({
        success: true,
        count: filtered.length,
        data: filtered
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al filtrar productos',
        message: error.message
      });
    }
  }

  // GET /api/products/search
  searchProducts(req, res) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Parámetro de búsqueda requerido'
        });
      }

      const products = database.findAll();
      const results = products.filter(p =>
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
      );

      res.json({
        success: true,
        count: results.length,
        query: q,
        data: results
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error en búsqueda',
        message: error.message
      });
    }
  }
}

module.exports = new ProductController();