package catalogo;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import klosh.SuperActivity;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import producto.ProductoActivity;
import android.app.ActionBar;
import android.app.ActionBar.Tab;
import android.app.FragmentTransaction;
import android.content.Intent;
import android.net.http.AndroidHttpClient;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.ListView;

import com.example.klosh.R;

public class CatalogoActivity extends SuperActivity implements
		ActionBar.TabListener {

	String sexo;
	int idCategoria;
	boolean adult, kid, offerNew;
	List<Subcategoria> sc = new ArrayList<Subcategoria>();
	List<CatalogoProduct> productList = new ArrayList<CatalogoProduct>();
	ActionBar actionBar;
	String url = null, urlN = null, filtersN = null;
	int nroPag = 1, total = 1;
	boolean free = true, search = false;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		Intent myIntent = getIntent();
		String prod = myIntent.getStringExtra("producto");
		search = myIntent.getBooleanExtra("search", false);
		Log.i("search", Boolean.toString(search));
		if (search) {
			setContentView(R.layout.activity_search);
			super.onCreate(savedInstanceState);
			urlN = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByName&name="
					+ prod + "&page=";
			url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByName&name="
					+ prod + "&page=" + nroPag;
			filtersN = "";
			new getProducts().execute(url);
		} else {
			setContentView(R.layout.activity_catalogo);
			super.onCreate(savedInstanceState);
			actionBar = getActionBar();
			actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_TABS);
			try { // Tabs siempre abajo de la ActionBar
				final Method setHasEmbeddedTabsMethod = actionBar.getClass()
						.getDeclaredMethod("setHasEmbeddedTabs", boolean.class);
				setHasEmbeddedTabsMethod.setAccessible(true);
				setHasEmbeddedTabsMethod.invoke(actionBar, false);
			} catch (final Exception e) {
			}
			adult = myIntent.getBooleanExtra("adult", true);
			kid = myIntent.getBooleanExtra("kid", true);
			offerNew = myIntent.getBooleanExtra("offerNew", false);
			sexo = myIntent.getStringExtra("sexo");
			idCategoria = myIntent.getIntExtra("idCategoria", idCategoria);
			if (!offerNew) {
				loadSubcategories();
			} else {
				actionBar.addTab(actionBar.newTab()
						.setText(this.getResources().getString(R.string.todos))
						.setTabListener(CatalogoActivity.this));
				actionBar
						.addTab(actionBar
								.newTab()
								.setText(
										this.getResources().getString(
												R.string.calzado))
								.setTabListener(CatalogoActivity.this));
				actionBar.addTab(actionBar
						.newTab()
						.setText(
								this.getResources().getString(
										R.string.indumentaria))
						.setTabListener(CatalogoActivity.this));
				actionBar.addTab(actionBar
						.newTab()
						.setText(
								this.getResources().getString(
										R.string.accesorios))
						.setTabListener(CatalogoActivity.this));
			}

			actionBar.setTitle(getResources().getString(
					myIntent.getIntExtra("title", 0)));			
		}
	}

	private void loadSubcategories() {
		String url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllSubcategories&id="
				+ idCategoria;
		new getSubcategories().execute(url);
	}

	@Override
	public void onTabReselected(Tab tab, FragmentTransaction ft) {
	}

	@Override
	public void onTabSelected(Tab tab, FragmentTransaction ft) {
		int i;
		boolean salir = false, offerNew;
		Intent myIntent = getIntent();
		nroPag = 1;
		offerNew = myIntent.getBooleanExtra("offerNew", false);
		if (!offerNew) {
			for (i = 0; i < sc.size() && !salir; i++) {
				if (sc.get(i).name.equals(tab.getText())) {
					salir = true;
					urlN = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsBySubcategoryId&id="
							+ sc.get(i).id + "&page=";
					url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsBySubcategoryId&id="
							+ sc.get(i).id + "&page=" + nroPag;
					try {
						if (adult) {
							if (sexo.equals("Masculino")) {
								filtersN = "&filters=["
										+ URLEncoder
												.encode("{\"id\":1,\"value\":\"Masculino\"}",
														"UTF-8") + "]";
								url += filtersN;
							} else {
								filtersN = "&filters=["
										+ URLEncoder
												.encode("{\"id\":1,\"value\":\"Femenino\"}",
														"UTF-8") + "]";
								url += filtersN;
							}
						} else {
							filtersN = "&filters=["
									+ URLEncoder.encode(
											"{\"id\":2,\"value\":\"Bebe\"}",
											"UTF-8") + "]";
							url += filtersN;
						}
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
					}
					new getProducts().execute(url);
				}
			}
		} else {
			boolean offer = myIntent.getBooleanExtra("offer", true);
			try {
				if (tab.getPosition() == 0) {
					urlN = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllProducts&page=";
					url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllProducts&page="
							+ nroPag;
				} else if (tab.getPosition() == 1) {
					urlN = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=1&page=";
					url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=1&page="
							+ nroPag;
				} else if (tab.getPosition() == 2) {
					urlN = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=2&page=";
					url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=2&page="
							+ nroPag;
				} else if (tab.getPosition() == 3) {
					urlN = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=3&page=";
					url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id=3&page="
							+ nroPag;
				}
				if (offer) {
					filtersN = "&filters=["
							+ URLEncoder.encode(
									"{\"id\":5,\"value\":\"Oferta\"}", "UTF-8")
							+ "]";
					url += filtersN;
				} else {
					filtersN = "&filters=["
							+ URLEncoder.encode(
									"{\"id\":6,\"value\":\"Nuevo\"}", "UTF-8")
							+ "]";
					url += filtersN;
				}
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
			new getProducts().execute(url);
		}
	}

	@Override
	public void onTabUnselected(Tab tab, FragmentTransaction ft) {
		ListView listView = (ListView) findViewById(R.id.productos);
		productList = new ArrayList<CatalogoProduct>();
		listView.refreshDrawableState();

	}

	private class getSubcategories extends AsyncTask<String, Void, String> {
		AndroidHttpClient client = AndroidHttpClient.newInstance("");

		@Override
		protected String doInBackground(String... params) {

			HttpGet request = new HttpGet(params[0]);
			ResponseHandler<String> responseHandler = new BasicResponseHandler();

			try {
				return client.execute(request, responseHandler);
			} catch (ClientProtocolException exception) {
				exception.printStackTrace();
			} catch (IOException exception) {
				exception.printStackTrace();
			}

			return null;
		}

		@Override
		protected void onPostExecute(String result) {
			JSONObject res = null, err;
			if (client != null)
				client.close();
			try {
				res = new JSONObject(result);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			err = res.optJSONObject("error");
			if (err == null) {
				JSONArray subcategories = null, attributes = null, gender = null;
				JSONObject subcategory = null, attribute = null;
				int i, j, k;
				boolean salir;
				try {
					subcategories = res.getJSONArray("subcategories");
				} catch (JSONException e) {
					e.printStackTrace();
				}
				for (i = 0; i < subcategories.length(); i++) {
					salir = false;
					try {
						subcategory = subcategories.getJSONObject(i);
						attributes = subcategory.getJSONArray("attributes");
						for (j = 0; j < attributes.length() && !salir; j++) {
							attribute = attributes.getJSONObject(j);
							if (adult) {
								if (attribute.getString("name")
										.equals("Genero")) {
									gender = attribute.getJSONArray("values");
									for (k = 0; k < gender.length() && !salir; k++) {
										if (gender.get(k).equals(sexo)) {
											salir = true;
										}
									}
								}
							} else {
								if (attribute.getString("name").equals("Edad")) {
									gender = attribute.getJSONArray("values");
									for (k = 0; k < gender.length() && !salir; k++) {
										if (gender.get(k).equals("Bebe")
												|| gender.get(k).equals(
														"Infantil")) {
											salir = true;
										}
									}
								}
							}
						}
						if (salir) {
							sc.add(new Subcategoria(subcategory
									.getString("name"), Integer
									.parseInt(subcategory.getString("id"))));
							actionBar.addTab(actionBar.newTab()
									.setText(subcategory.getString("name"))
									.setTabListener(CatalogoActivity.this));
						}
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			}

		}
	}

	private class getProducts extends AsyncTask<String, Void, String> {
		AndroidHttpClient client = AndroidHttpClient.newInstance("");

		@Override
		protected String doInBackground(String... params) {

			HttpGet request = new HttpGet(params[0]);
			ResponseHandler<String> responseHandler = new BasicResponseHandler();

			try {
				return client.execute(request, responseHandler);
			} catch (ClientProtocolException exception) {
				exception.printStackTrace();
			} catch (IOException exception) {
				exception.printStackTrace();
			}

			return null;
		}

		@Override
		protected void onPostExecute(String result) {
			JSONObject res = null, err;
			if (client != null)
				client.close();
			try {
				res = new JSONObject(result);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			err = res.optJSONObject("error");
			if (err == null) {
				JSONArray products = null, attributes = null;
				JSONObject product = null;
				String marca = null;
				int i, j;
				boolean salir;
				try {
					products = res.getJSONArray("products");
					total = res.getInt("total");
				} catch (JSONException e) {
					e.printStackTrace();
				}
				for (i = 0; i < products.length(); i++) {
					salir = false;
					try {
						product = products.getJSONObject(i);
						attributes = product.getJSONArray("attributes");
						for (j = 0; j < attributes.length() && !salir; j++) {
							if (attributes.getJSONObject(j).get("name")
									.equals("Marca")) {
								salir = true;
								marca = attributes.getJSONObject(j)
										.getJSONArray("values").getString(0);
							}
						}
						productList
								.add(new CatalogoProduct(product.getInt("id"),
										product.getDouble("price"), product
												.getString("name"), marca,
										product.getJSONArray("imageUrl")
												.getString(0)));

					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
				ListView listView = (ListView) findViewById(R.id.productos);
				ProductoAdapter adapter = new ProductoAdapter(
						getApplicationContext(), productList);
				listView.setAdapter(adapter);
				listView.setOnItemClickListener(new ListView.OnItemClickListener() {
					@Override
					public void onItemClick(AdapterView<?> a, View v, int i,
							long l) {
						Intent myIntent = new Intent(v.getContext(),
								ProductoActivity.class);
						myIntent.putExtra("id", productList.get(i).id);
						myIntent.putExtra("title", productList.get(i).nombre);
						startActivity(myIntent);
					}
				});
				listView.setOnScrollListener(new ListView.OnScrollListener() {
					@Override
					public void onScroll(AbsListView view,
							int firstVisibleItem, int visibleItemCount,
							int totalItemCount) {
						if (free) {
							if (totalItemCount
									- (firstVisibleItem + visibleItemCount) == 0
									&& totalItemCount < total) {
								free = false;
								nroPag++;
								new getProducts().execute(urlN + nroPag
										+ filtersN);
							}
						}
					}

					@Override
					public void onScrollStateChanged(AbsListView view,
							int scrollState) {
					}
				});
				free = true;
			}

		}
	}
}
