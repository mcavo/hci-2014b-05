package klosh;

import user.InformacionActivity;
import user.IngresarActivity;
import user.UserManager;
import android.app.Activity;
import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.SearchView;
import android.widget.SearchView.OnQueryTextListener;
import catalogo.CatalogoActivity;

import com.example.klosh.R;

import drawer.Drawer;

public class SuperActivity extends Activity {
	private Drawer mDrawer;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		mDrawer = new Drawer(this);
		mDrawer.setListener(new DrawerItemClickListener());
		getActionBar().setDisplayHomeAsUpEnabled(true);
		getActionBar().setHomeButtonEnabled(true);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.main, menu);

		SearchManager manager = (SearchManager) getSystemService(Context.SEARCH_SERVICE);

		SearchView search = (SearchView) menu.findItem(R.id.search)
				.getActionView();

		search.setSearchableInfo(manager.getSearchableInfo(getComponentName()));

		search.setOnQueryTextListener(new OnQueryTextListener() {

			@Override
			public boolean onQueryTextChange(String query) {
				return true;

			}

			@Override
			public boolean onQueryTextSubmit(String query) {
				Intent myIntent = new Intent(getApplicationContext(), CatalogoActivity.class);
				myIntent.putExtra("search", true);
				myIntent.putExtra("producto", query);
				myIntent.putExtra("title", R.string.busqueda);
				startActivity(myIntent);
				return false;
			}
		});

		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		int id = item.getItemId();
		if (id == R.id.search) {
			return true;
		}
		if (id == R.id.contact) {
			UserManager data = new UserManager(getApplicationContext());
			if (data.getAuthenticationToken() == null) {
				Intent myIntent = new Intent(this, IngresarActivity.class);
				startActivity(myIntent);
			} else {
				Intent myIntent = new Intent(this, InformacionActivity.class);
				startActivity(myIntent);
			}
			return true;
		}
		if (mDrawer.onOptionsItemSelected(item)) {
			return true;
		}
		return super.onOptionsItemSelected(item);
	}

	@Override
	protected void onRestart() {
		super.onRestart();
		mDrawer.refreshDrawer();
	}

	private class DrawerItemClickListener implements
			ListView.OnItemClickListener {

		@Override
		public void onItemClick(AdapterView<?> parent, View view, int position,
				long id) {
			mDrawer.selectItem(position);
		}

	}

	@Override
	protected void onPostCreate(Bundle savedInstanceState) {
		super.onPostCreate(savedInstanceState);
		mDrawer.sync();
	}

	@Override
	public void onConfigurationChanged(Configuration newConfig) {
		super.onConfigurationChanged(newConfig);
		mDrawer.onConfigurationChanged(newConfig);
	}
}
