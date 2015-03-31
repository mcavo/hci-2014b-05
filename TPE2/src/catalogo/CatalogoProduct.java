package catalogo;


public class CatalogoProduct {

	int id;
	double precio;
	String nombre, marca, imageUrl;
	
	public CatalogoProduct(int id, double price, String name, String marca, String imageUrl) {
	 this.id = id;
	 this.precio = price;
	 this.nombre = name;
	 this.marca = marca;	
	 this.imageUrl = imageUrl;
	}
	
}
