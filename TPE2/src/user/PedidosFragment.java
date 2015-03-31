package user;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Fragment;
import android.app.ProgressDialog;
import android.net.http.AndroidHttpClient;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import com.example.klosh.R;

public class PedidosFragment extends Fragment {

	UserManager um = null;
	private List<Pedido> orderList = new ArrayList<Pedido>();
	private ProgressDialog pd = null;

	public ProgressDialog getPd() {
		return pd;
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		View rv = inflater.inflate(R.layout.fragment_pedidos, container, false);

		um = new UserManager(rv.getContext());
		String url = "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetAllOrders&username="
				+ um.getUser()
				+ "&authentication_token="
				+ um.getAuthenticationToken();
		pd = new ProgressDialog(rv.getContext());
		pd.show();
		pd.setContentView(R.layout.cargando);
		pd.setCancelable(true);
		new GetOrders().execute(url);
		return rv;
	}

	public void showRequests() {
		ListView listView = (ListView) getActivity().findViewById(R.id.pedidos);
		PedidoAdapter adapter = new PedidoAdapter(getView().getContext(),
				orderList);
		listView.setAdapter(adapter);
	}

	private class GetOrders extends AsyncTask<String, Void, String> {

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

				JSONArray pedidos = null;
				JSONObject pedido = null;
				int i;
				Integer numero;
				String direccion;
				String fecCreacion;
				String fecEntrega;
				String status;
				try {
					pedidos = res.getJSONArray("orders");
				} catch (JSONException e) {
					e.printStackTrace();
				}
				for (i = 0; i < pedidos.length(); i++) {
					try {
						pedido = pedidos.getJSONObject(i);
						numero = pedido.getInt("id");
						status = pedido.getString("status");
						fecCreacion = pedido.getString("receivedDate");
						fecEntrega = pedido.getString("deliveredDate");
						direccion = pedido.optJSONObject("address") == null ? null
								: pedido.optJSONObject("address").getString(
										"name");
						Pedido aux = new Pedido(numero, direccion, fecCreacion,
								fecEntrega, status, PedidosFragment.this,
								pedido.getInt("latitude"),
								pedido.getInt("longitude"));
						orderList.add(aux);
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
				if (PedidosFragment.this.pd != null) {
					PedidosFragment.this.pd.dismiss();
				}
			}

		}
	}

}
