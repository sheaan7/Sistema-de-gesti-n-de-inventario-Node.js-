class Product {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.price = data.price;
    this.description = data.description || '';
    this.category = data.category || 'general';
    this.image = data.image || '';
    this.stock = data.stock || 0;
    this.externalId = data.externalId || null; // ID de la API externa
    this.synced = data.synced || false;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static validate(data) {
    const errors = [];

    if (!data.title || data.title.trim() === '') {
      errors.push('El título es requerido');
    }

    if (data.price === undefined || data.price === null || data.price < 0) {
      errors.push('El precio debe ser un número positivo');
    }

    if (data.stock !== undefined && data.stock < 0) {
      errors.push('El stock no puede ser negativo');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static fromExternal(externalProduct) {
    return {
      title: externalProduct.title,
      price: externalProduct.price,
      description: externalProduct.description,
      category: externalProduct.category,
      image: externalProduct.image,
      stock: Math.floor(Math.random() * 100), // Stock aleatorio
      externalId: externalProduct.id,
      synced: true
    };
  }
}

module.exports = Product;