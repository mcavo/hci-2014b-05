package klosh;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import catalogo.CatalogoActivity;

import com.example.klosh.R;

public class MainActivity extends SuperActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		setContentView(R.layout.activity_main);
		startService(new Intent(this, CheckOrders.class));
		super.onCreate(savedInstanceState);
	}

	public void sendMessageHombre(View view) {
		Intent myIntent = new Intent(this, HombreActivity.class);
		startActivity(myIntent);
	}

	public void sendMessageNinio(View view) {
		Intent myIntent = new Intent(this, NinioActivity.class);
		startActivity(myIntent);
	}

	public void sendMessageMujer(View view) {
		Intent myIntent = new Intent(this, MujerActivity.class);
		startActivity(myIntent);
	}

	public void sendMessageNovedades(View view) {
		Intent myIntent = new Intent(this, CatalogoActivity.class);
		myIntent.putExtra("offerNew", true);
		myIntent.putExtra("offer", false);
		myIntent.putExtra("title", R.string.novedades);
		startActivity(myIntent);
	}

	public void sendMessageOfertas(View view) {
		Intent myIntent = new Intent(this, CatalogoActivity.class);
		myIntent.putExtra("offerNew", true);
		myIntent.putExtra("offer", true);
		myIntent.putExtra("title", R.string.ofertas);
		startActivity(myIntent);
	}
}
