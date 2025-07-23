// Menu page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.menu-tabs button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const tabName = this.getAttribute('data-tab');
            document.getElementById(tabName).classList.add('active');
        });
    });
    
    // Load preconfigured products
    loadPreconfiguredProducts();
});

function loadPreconfiguredProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // Sample products data - in a real app this would come from an API
    const products = [
        {
            id: 1,
            name: 'Classic Milk Tea',
            description: 'Tè nero con latte e perle di tapioca',
            priceM: 4.50,
            priceL: 5.50,
            image: 'assets/products/drink1.jpg',
            base: 'Tè nero con latte',
            bubble: 'Tapioca classica',
            aroma: 'Vaniglia',
            sweetness: 50,
            ice: false,
            size: 'L'
        },
        // Add more products...
    ];
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">€${product.priceL.toFixed(2)} (L)</div>
                <button class="btn add-to-cart" data-id="${product.id}">Aggiungi al Carrello</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.priceL, // Default to L size
                    quantity: 1,
                    options: {
                        base: product.base,
                        bubble: product.bubble,
                        aroma: product.aroma,
                        sweetness: product.sweetness,
                        ice: product.ice,
                        size: product.size
                    },
                    image: product.image
                });
                
                alert(`${product.name} aggiunto al carrello!`);
            }
        });
    });
}