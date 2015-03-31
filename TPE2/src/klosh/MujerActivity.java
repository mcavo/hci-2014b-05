package klosh;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import catalogo.CatalogoActivity;

import com.example.klosh.R;

public class MujerActivity extends SuperActivity {


	@Override
	protected void onCreate(Bundle savedInstanceState) {
		setContentView(R.layout.activity_mujer);
		super.onCreate(savedInstanceState);
		
	}

	public void getFootwearW(View view) {
		Intent myIntent = new Intent(this, CatalogoActivity.class);
		myIntent.putExtra("sexo", "Femenino");
		myIntent.putExtra("kid", false);
		myIntent.putExtra("idCategoria", 1);
		myIntent.putExtra("title", R.string.calzado);
		startActivity(myIntent);
	}

	public void getCostumeW(View view) {
		Intent myIntent = new Intent(this, CatalogoActivity.class);
		myIntent.putExtra("sexo", "Femenino");
		myIntent.putExtra("kid", false);
		myIntent.putExtra("idCategoria", 2);
		myIntent.putExtra("title", R.string.indumentaria);
		startActivity(myIntent);
	}

	public void getFittingW(View view) {
		Intent myIntent = new Intent(this, CatalogoActivity.class);
		myIntent.putExtra("sexo", "Femenino");
		myIntent.putExtra("kid", false);
		myIntent.putExtra("idCategoria", 3);
		myIntent.putExtra("title", R.string.accesorios);
		startActivity(myIntent);
	}

}
