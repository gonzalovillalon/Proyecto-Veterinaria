const app = Vue.createApp({
  data() {
    return {
      url_petshop: "https://apipetshop.herokuapp.com/api/articulos",
      info: [],
      backupInfo: [],
      Farmacia: [],
      backupFarmacia: [],
      Juguete: [],
      backupJuguete: [],
      textoBuscar: "",
      farmaciaFiltrado: [],
      juguetesFiltrados: [],
      cart: [],
      seleccion: [],
      ventana: false,
      articulosCarrito: [],
      total:''

    }
  },
  created() {    
    this.traerDatos(this.url_petshop)
    document.addEventListener('DOMContentLoaded', () => {
      this.articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
    })     
    
       

  },
  methods: {
    traerDatos(url_petshop) {
      fetch(url_petshop)
        .then(response => response.json())
        .then(data => {
          this.info = data.response
          this.backupInfo = this.info
          this.Farmacia = data.response.filter((element) => element.tipo === "Medicamento")
          this.backupFarmacia = this.Farmacia
          this.Juguete = data.response.filter((element) => element.tipo === "Juguete")
          this.backupJuguete = this.Juguete
        })
        .catch(err => console.error(err.message))





    },    

    eliminarProducto(e){
      const productoId = e.target.getAttribute("data-id")
      this.articulosCarrito = this.articulosCarrito.filter(producto => producto.id !== productoId)
      this.sincronizarStorage()      
    },

    leerDatosProducto(producto) {
      const infoProducto = {
        imagen: producto.querySelector('.img-container img').src,
        titulo: producto.querySelector('.card-body .card-title').textContent,
        precio: producto.querySelector('.card-body .card-subtitle span').textContent,
        id: producto.querySelector(".card-body").getAttribute("id"),
        cantidad: 1
      }      

      const repetido = this.articulosCarrito.some(producto => producto.id === infoProducto.id)
      
      if (repetido) {
        const productos = this.articulosCarrito.map(producto => {
          if (producto.id === infoProducto.id) {
            producto.cantidad++;
            producto.stock--;
            return producto;
          }
          else {
            return producto;
          }
        });
        this.articulosCarrito = [...productos]        
      }
      else {
        this.articulosCarrito = [...this.articulosCarrito, infoProducto]
      }            

      this.sincronizarStorage()         
      
    },

    agregarProducto(e) {
      const productoSeleccionado = e.target.parentElement.parentElement.parentElement      
      this.leerDatosProducto(productoSeleccionado)      
      this.sincronizarStorage()
    },
    

    vaciarCarrito(){
      this.articulosCarrito = []
      this.sincronizarStorage()
    },
    sincronizarStorage(){
      localStorage.setItem('carrito', JSON.stringify(this.articulosCarrito))
    },
   
  },
  mounted() {
    let local = JSON.parse(localStorage.getItem("datos"))
    this.cart = local
    console.log(this.compras)
  },
  computed: {
    filtradoFarmacia() {
      this.Farmacia = this.backupFarmacia.filter((element => (element.nombre.toLowerCase().includes(this.textoBuscar.toLowerCase()))))


    },
    filtradoJuguetes() {
      this.Juguete = this.backupJuguete.filter((element => (element.nombre.toLowerCase().includes(this.textoBuscar.toLowerCase()))))


    },
    sumar () {
      let total = 0;
      this.articulosCarrito.forEach((item, i) => {
        total += item.precio * item.cantidad;
      })      
      return total;
    },
  },
  mounted() {
  },
}).mount('#app')