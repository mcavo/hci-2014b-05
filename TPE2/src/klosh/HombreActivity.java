package klosh;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import catalogo.CatalogoActivity;

import com.example.klosh.R;

public class HombreActivity extends SuperActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		setContentView(R.layout.activity_hombr);
		super.onCreate(savedInstanceState);
	}

	public void getFootwearM(View view) {
		Intent myIntent = new Intent(this, CatalogoActivity.class);
		myIntent.putExtra("sexo", "Masculino");
		myIntent.putExtra("kid", false);
		myIntent.putExtra("idCategoria", 1);
		myIntent.putExtra("title", R.string.calzado);
		startActivity(myIntent);
	}

	public void getCostumeM(View view) {
		Intent myIntent = new Intent(this, CatalogoActivity.class);
		myIntent.putExtra("sexo", "Masculino");
		myIntent.putExtra("kid", false);
		myIntent.putExtra("idCategoria", 2);
		myIntent.putExtra("title", R.string.indumentaria);
		startActivity(myIntent);
	}

	public void getFittingM(View view) {
		Intent myIntent = new Intent(this, CatalogoActivity.class);
		myIntent.putExtra("sexo", "Masculino");
		myIntent.putExtra("kid", false);
		myIntent.putExtra("idCategoria", 3);
		myIntent.putExtra("title", R.string.accesorios);
		startActivity(myIntent);
	}
	
}
