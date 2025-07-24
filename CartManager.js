import fs from 'fs';


export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  getCarts() {
    if (!fs.existsSync(this.path)) return [];
    const data = fs.readFileSync(this.path, 'utf-8');
    return JSON.parse(data);
  }

  saveCarts(carts) {
    fs.writeFileSync(this.path, JSON.stringify(carts, null, 2));
  }

  generateId(carts) {
    return carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
  }

  createCart() {
    const carts = this.getCarts();
    const newCart = {
      id: this.generateId(carts),
      products: []
    };
    carts.push(newCart);
    this.saveCarts(carts);
    return newCart;
  }

  getCartById(cid) {
    const carts = this.getCarts();
    return carts.find(c => c.id === cid);
  }

  addProductToCart(cid, pid) {
    const carts = this.getCarts();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product === pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    this.saveCarts(carts);
    return cart;
  }
}


