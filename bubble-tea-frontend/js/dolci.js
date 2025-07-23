document.addEventListener('DOMContentLoaded', function() {
    // Sample desserts data
    const desserts = [
        {
            id: 101,
            name: 'Cheesecake al Matcha',
            description: 'Delicata cheesecake con topping al tè matcha',
            price: 4.50,
            image: 'assets/products/dessert1.jpg'
        },
        {
            id: 102,
            name: 'Mochi al Cioccolato',
            description: 'Morbidi mochi ripieni di cioccolato fondente',
            price: 3.80,
            image: 'assets/products/dessert2.jpg'
        }
        // Add more desserts as needed
    ];

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach((button, index) => {
        button.addEventListener('click', function() {
            const dessert = desserts[index];
            addToCart({
                id: dessert.id,
                name: dessert.name,
                price: dessert.price,
                quantity: 1,
                image: dessert.image,
                type: 'dessert'
            });
            
            // Visual feedback
            this.textContent = 'Aggiunto!';
            this.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                this.textContent = 'Aggiungi';
                this.style.backgroundColor = '';
            }, 1000);
        });
    });
});