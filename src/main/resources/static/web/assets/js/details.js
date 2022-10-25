let urlParams = new URLSearchParams(window.location.search);
let urlName = urlParams.get("id");

const app = Vue.

createApp({
    data() {
        return {
            products: [],
            productId:[],
            productsFilter: [],
            selectProducts: [],
            trolleyInStorage: [],
            trolley: [],
            verifired: false,
        }
    },

    created(){
        axios.get("/api/products")
            .then(response => {
                this.products = response.data;
                this.productId = this.products.find(product => product.id == urlName)
                this.selectProducts = this.productsFilter;
                this.trolley = JSON.parse(localStorage.getItem('products'))
                let trolleyInStorage = JSON.parse(localStorage.getItem("products"));
                if (trolleyInStorage) {
                    this.trolley = trolleyInStorage;
                }
            })
            .catch((error) =>{
                console.log(error);
            });
            axios.get("/api/clients/current")
                .then(response => {
                    this.client = response.data;
                    this.verifired = this.client.validation
                })

    },
    methods: {
        formattedNumber(balance){
            return balance = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(balance)
        },
        trolleyPurchase(product) {
            let products = this.trolley.filter(item => item.id == product.id)[0]
            if (products != undefined) {
                products.quantity++;
                localStorage.setItem("products", JSON.stringify(this.trolley));
            } else {
                let products = {
                    id: product.id,
                    name: product.name,
                    author: product.author,
                    releaseDate: product.releaseDate,
                    brand: product.brand,
                    description: product.description,
                    image: [product.image],
                    genres: [product.genres],
                    stock: product.stock,
                    totalStock: product.stock,
                    price: product.price,
                    firstHand: product.firstHand,
                    productType: product.productType,
                    quantity: 1,
                };
                this.trolley.push(products);
                localStorage.setItem("products", JSON.stringify(this.trolley));
            }
            product.stock--;

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Producto agregado",
                showConfirmButton: false,
                timer: 1900,
            })
        },
        logOut() {
            Swal.fire({
                title: 'Estas seguro?',
                text: "Quieres salir de la app?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: "salir",
                showCloseButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.post('/api/logout')
                        .then(response => location.href = '/web/index.html')
                        .then(response => location.href = '/web/index.html')
                        .catch(function (error) {
                            alert(error);
                        })
                }
            })
        },

        
    },
    computed: {
        cantidadDeProductos() {
            return this.trolley.reduce((acc, item) => acc + item.quantity, 0)
        },
        totalAPagar() {
            return this.trolley.reduce((acc, item) => acc + item.quantity * item.price, 0);
        },

    }
}).mount('#app');



