package drawer;

import java.util.ArrayList;
import java.util.List;

import klosh.HombreActivity;
import klosh.MainActivity;
import klosh.MujerActivity;
import klosh.NinioActivity;
import user.InformacionActivity;
import user.IngresarActivity;
import user.Salir;
import user.UserManager;
import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.support.v4.app.ActionBarDrawerToggle;
import android.support.v4.widget.DrawerLayout;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import catalogo.CatalogoActivity;

import com.example.klosh.R;

@SuppressWarnings("deprecation")
public class Drawer {
	private DrawerLayout mDrawerLayout;
	private ListView mDrawerList;
	private ActionBarDrawerToggle mDrawerToggle;
	private Activity act;
	private boolean logged;

	public Drawer(Activity act) {
		this.act = act;
		initializeDrawer();
	}

	public void initializeDrawer() {
		mDrawerLayout = (DrawerLayout) act.findViewById(R.id.drawer_layout);
		mDrawerList = (ListView) act.findViewById(R.id.left_drawer);
		refreshDrawer();
		mDrawerToggle = new ActionBarDrawerToggle(act, mDrawerLayout,
				R.drawable.ic_drawer, R.string.drawer_open,
				R.string.drawer_close);
		mDrawerLayout.setDrawerListener(mDrawerToggle);
	}

	public void setListener(ListView.OnItemClickListener listen) {
		mDrawerList.setOnItemClickListener(listen);
	}

	public void closeDrawer() {
		mDrawerLayout.closeDrawer(mDrawerList);
	}

	public void setItemChecked(int position) {
		mDrawerList.setItemChecked(position, true);
	}

	public void sync() {
		mDrawerToggle.syncState();
	}

	public void refreshDrawer() {
		UserManager data = new UserManager(act.getApplicationContext());
		List<String> drawerVar = new ArrayList<String>();
		drawerVar.add(act.getString(R.string.inicio));
		drawerVar.add(act.getString(R.string.mujer));
		drawerVar.add(act.getString(R.string.hombre));
		drawerVar.add(act.getString(R.string.ninio));
		drawerVar.add(act.getString(R.string.novedades));
		drawerVar.add(act.getString(R.string.ofertas));
		drawerVar.add(act.getString(R.string.micuenta));
		if (data.getAuthenticationToken() == null) {
			logged = false;
			drawerVar.add(act.getString(R.string.ingresar));
		} else {
			logged = true;
			drawerVar.add(act.getString(R.string.cerrar));
		}
		mDrawerList.setAdapter(new ArrayAdapter<String>(act,
				R.layout.drawer_list_item, drawerVar));
	}

	public void onConfigurationChanged(Configuration newConfig) {
		mDrawerToggle.onConfigurationChanged(newConfig);
	}

	public boolean onOptionsItemSelected(MenuItem item) {
		return mDrawerToggle.onOptionsItemSelected(item);
	}

	public void selectItem(int position) {
		Intent myIntent = null;
		switch (position) {
		case 0: {
			myIntent = new Intent(act, MainActivity.class);
			act.startActivity(myIntent);
			break;
		}
		case 1: {
			myIntent = new Intent(act, MujerActivity.class);
			act.startActivity(myIntent);
			break;
		}
		case 2: {
			myIntent = new Intent(act, HombreActivity.class);
			act.startActivity(myIntent);
			break;
		}
		case 3: {
			myIntent = new Intent(act, NinioActivity.class);
			act.startActivity(myIntent);
			break;
		}
		case 4: {
			myIntent = new Intent(act, CatalogoActivity.class);
			myIntent.putExtra("offerNew", true);
			myIntent.putExtra("offer", true);
			myIntent.putExtra("title", R.string.ofertas);
			act.startActivity(myIntent);
			break;
		}
		case 5: {
			myIntent = new Intent(act, CatalogoActivity.class);
			myIntent.putExtra("offerNew", true);
			myIntent.putExtra("offer", false);
			myIntent.putExtra("title", R.string.novedades);
			act.startActivity(myIntent);
			break;
		}
		case 6: {
			if (!logged) {
				myIntent = new Intent(act, IngresarActivity.class);
				act.startActivity(myIntent);
			} else {
				myIntent = new Intent(act, InformacionActivity.class);
				act.startActivity(myIntent);
			}
			break;
		}
		case 7: {
			if (logged) {
				logged = false;
				cerrarSesion();
				UserManager data = new UserManager(act.getApplicationContext());
				data.setAuthData(null);
				refreshDrawer();
				if(act.getClass().equals(InformacionActivity.class)){
					act.finish();
				}
			} else {
				myIntent = new Intent(act, IngresarActivity.class);
				act.startActivity(myIntent);
			}
			break;
		}
		}
		setItemChecked(position);
		closeDrawer();
	}

	private void cerrarSesion() {
		Salir sesion = new Salir();
		sesion.cerrar(act);
	}

}