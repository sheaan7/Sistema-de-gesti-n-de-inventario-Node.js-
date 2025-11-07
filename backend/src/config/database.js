const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, '../../data/products.json');
    this.ensureDataDir();
  }

  ensureDataDir() {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.dbPath)) {
      this.write([]);
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo base de datos:', error);
      return [];
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error escribiendo en base de datos:', error);
      return false;
    }
  }

  findById(id) {
    const products = this.read();
    return products.find(p => p.id === id);
  }

  findAll() {
    return this.read();
  }

  create(product) {
    const products = this.read();
    const newProduct = {
      id: this.generateId(),
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    this.write(products);
    return newProduct;
  }

  update(id, updates) {
    const products = this.read();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      id: products[index].id,
      updatedAt: new Date().toISOString()
    };
    this.write(products);
    return products[index];
  }

  delete(id) {
    const products = this.read();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;
    this.write(filtered);
    return true;
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

module.exports = new Database();