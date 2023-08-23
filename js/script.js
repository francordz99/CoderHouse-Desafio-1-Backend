const mainElement = document.querySelector("main");

class ProductManager {
    constructor() {
        this.products = [];
        this.nextProductId = 1;
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        product.id = this.nextProductId++;
        product.code = product.id.toString();

        if (this.products.some(p => p.code === product.code)) {
            console.error("El código ya está en uso");
            return;
        }

        this.products.push(product);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            console.error("Not found");
        }
        return product;
    }
}

const productManager = new ProductManager();

function createProductCard(product) {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
    <img src="${product.thumbnail}" alt="${product.title}">
    <h2>${product.title}</h2>
    <p>${product.description}</p>
    <p>Precio: $${product.price}</p>
    <p>Stock disponible: ${product.stock}</p>
  `;

    return card;
}

const addButton = document.createElement("button");
addButton.textContent = "Agregar Producto";
addButton.classList.add("add-button");

addButton.addEventListener("click", () => {
    const formContainer = document.createElement("div");
    formContainer.classList.add("form-container");

    const form = document.createElement("form");
    form.classList.add("add-product-form");

    form.innerHTML = `
        <label for="title">Título del producto:</label>
        <input type="text" id="title" name="title" required><br>
        
        <label for="description">Descripción del producto:</label>
        <input type="text" id="description" name="description" required><br>
        
        <label for="price">Precio:</label>
        <input type="number" step="0.01" id="price" name="price" required><br>
        
        <label for="thumbnail">URL de la imagen:</label>
        <input type="url" id="thumbnail" name="thumbnail" required><br>
        
        <label for="stock">Stock:</label>
        <input type="number" id="stock" name="stock" required><br>
        
        <button type="submit">Agregar</button>
    `;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const product = {
            title: formData.get("title"),
            description: formData.get("description"),
            price: parseFloat(formData.get("price")),
            thumbnail: formData.get("thumbnail"),
            stock: parseInt(formData.get("stock"))
        };

        if (productManager.products.some(p => isEqualProduct(p, product))) {
            alert("Ya existe un producto con estas características.");
        } else {
            productManager.addProduct(product);
            displayProducts(productManager.getProducts());
        }

        formContainer.remove();
    });

    formContainer.appendChild(form);
    addButton.insertAdjacentElement("afterend", formContainer);
});

function isEqualProduct(product1, product2) {
    return (
        product1.title === product2.title &&
        product1.description === product2.description &&
        product1.price === product2.price &&
        product1.thumbnail === product2.thumbnail &&
        product1.stock === product2.stock
    );
}

document.body.insertBefore(addButton, mainElement);

function displayProducts(products) {
    mainElement.innerHTML = "";

    for (const product of products) {
        const card = createProductCard(product);
        mainElement.appendChild(card);
    }
}

loadAndDisplayProducts();

async function loadAndDisplayProducts() {
    try {
        const response = await fetch("../sources/products.json");
        const data = await response.json();

        productManager.products = data;
        const lastProductId = data[data.length - 1].id;
        productManager.nextProductId = lastProductId + 1;

        displayProducts(productManager.getProducts());
    } catch (error) {
        console.error("Error loading products data:", error);
    }
}
