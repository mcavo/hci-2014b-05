package klosh;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import catalogo.CatalogoActivity;

import com.example.klosh.R;

public class NinioActivity extends SuperActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		setContentView(R.layout.activity_nin);
		super.onCreate(savedInstanceState);
	}

	public void getFootwearK(View view) {
		Intent myIntent = new Intent(this, CatalogoActivity.class);
		myIntent.putExtra("idCategoria", 1);
		myIntent.putExtra("title", R.string.calzado);
		myIntent.putExtra("adult", false);
		startActivity(myIntent);
	}
}
