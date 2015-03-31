package user;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.ProgressDialog;
import android.net.http.AndroidHttpClient;
import android.os.AsyncTask;

import com.example.klosh.R;

public class Pedido {
	private Integer numero;
	private String direccion;
	private String fecCreacion;
	private String fecEntrega;
	private Double precio = 0.0;
	private PedidosFragment act;
	private ProgressDialog pd;
	private int status, latitud, longitud;

	public Pedido(Integer numero, String direccion, String fecCreacion,
			String fecEntrega, String status, PedidosFragment act, int latitud,
			int longitud) {
		this.numero = numero;
		this.latitud = latitud;
		this.longitud = longitud;
		this.direccion = direccion;
		this.fecCreacion = fecCreacion.substring(8, 10) + "/"
				+ fecCreacion.substring(5, 7) + "/"
				+ fecCreacion.substring(0, 4);
		if (fecEntrega == "null") {
			this.fecEntrega = fecEntrega;
		} else {
			this.fecEntrega = fecEntrega.substring(8, 10) + "/"
					+ fecEntrega.substring(5, 7) + "/"
					+ fecEntrega.substring(0, 4);
		}
		this.status = Integer.valueOf(status);
		this.act = act;
		pd = new ProgressDialog(act.getActivity());
		pd.show();
		pd.setContentView(R.layout.cargando);
		pd.setCancelable(true);
		calculatePrice();
	}

	public void calculatePrice() {
		UserManager data;
		data = new UserManager(act.getView().getContext());
		String url = "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username="
				+ data.getUser()
				+ "&authentication_token="
				+ data.getAuthenticationToken() + "&id=" + numero;
		new Price().execute(url);
	}

	private class Price extends AsyncTask<String, Void, String> {
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
				JSONArray items = null;
				JSONObject item = null;
				int i;
				double price;
				int quantity;
				double total = 0;
				try {
					items = res.getJSONObject("order").getJSONArray("items");
				} catch (JSONException e) {
					e.printStackTrace();
				}
				for (i = 0; i < items.length(); i++) {
					try {
						item = items.getJSONObject(i);
						price = item.getDouble("price");
						quantity = item.getInt("quantity");
						total += price * quantity;
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
				precio = total;

				act.showRequests();
				if (Pedido.this.pd != null) {
					Pedido.this.pd.dismiss();
				}
			}

		}
	}

	public String getDireccion() {
		return direccion;
	}

	public String getFecCreacion() {
		return fecCreacion;
	}

	public String getFecEntrega() {
		return fecEntrega;
	}

	public Integer getNumero() {
		return numero;
	}

	public Double getPrecio() {
		return precio;
	}

	public int getStatus() {
		return status;
	}

	public String getCoord() {
		return "( " + String.valueOf(latitud) + ", " + String.valueOf(longitud)
				+ " )";
	}
}
