import fs from 'fs';


export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    getProducts() {
        if (!fs.existsSync(this.path)) return [];
        const data = fs.readFileSync(this.path, 'utf-8');
        return JSON.parse(data);
    }

    getProductById(id) {
        const products = this.getProducts();
        return products.find(p => p.id === id);
    }

    addProduct(product) {
        const products = this.getProducts();

        if (!product.title || !product.description || !product.code || !product.price || product.status === undefined || !product.stock || !product.category || !product.thumbnails) {
            return { error: 'Faltan campos' };
        }

        product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        products.push(product);
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
        return product;
    }

    updateProduct(id, updatedProduct) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return null;

        products[index] = {
            ...products[index],
            ...updatedProduct
        };
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    deleteProduct(id) {
        let products = this.getProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) return null;

        products.splice(index, 1);
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
        return true;
    }
}


