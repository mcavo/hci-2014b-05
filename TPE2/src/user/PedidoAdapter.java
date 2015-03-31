package user;

import java.util.List;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.example.klosh.R;

public class PedidoAdapter extends BaseAdapter {
	private List<Pedido> orderList;
	private Context context;

	public PedidoAdapter(Context context, List<Pedido> orderList) {
		this.context = context;
		this.orderList = orderList;
	}

	@Override
	public int getCount() {
		return orderList.size();
	}

	@Override
	public Object getItem(int position) {
		return orderList.get(position);
	}

	@Override
	public long getItemId(int position) {
		return position;
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {

		ViewHolderItem viewHolder;

		if (convertView == null) {
			LayoutInflater inflater = (LayoutInflater) context
					.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
			convertView = inflater.inflate(R.layout.pedido_list_item, parent, false);
			viewHolder = new ViewHolderItem();
			viewHolder.numero = (TextView) convertView
					.findViewById(R.id.numeroU);
			viewHolder.direccion = (TextView) convertView
					.findViewById(R.id.direcciondeenvioU);
			viewHolder.fecCreac = (TextView) convertView
					.findViewById(R.id.fechacreacionU);
			viewHolder.fecEntre = (TextView) convertView
					.findViewById(R.id.fechaentregaU);
			viewHolder.precio = (TextView) convertView
					.findViewById(R.id.preciototalU);
			viewHolder.status = (TextView) convertView
					.findViewById(R.id.estadoU);
			viewHolder.coordenadas = (TextView) convertView
					.findViewById(R.id.coordenadasU);

			convertView.setTag(viewHolder);
		} else {
			viewHolder = (ViewHolderItem) convertView.getTag();
		}

		Pedido order = orderList.get(position);

		if (order != null) {
			viewHolder.numero.setText(order.getNumero().toString());
			if (order.getDireccion() != null)
				viewHolder.direccion.setText(order.getDireccion());
			else
				viewHolder.direccion.setText("----");
			viewHolder.fecCreac.setText(order.getFecCreacion());
			viewHolder.fecEntre
					.setText((order.getFecEntrega() == "null" ? convertView.getResources().getString(R.string.noentregado) : order
							.getFecEntrega()));
			viewHolder.precio.setText("$" + order.getPrecio().toString());
			viewHolder.coordenadas.setText(order.getCoord());
			int stat = order.getStatus();
			switch (stat) {
			case 1: {
				/*viewHolder.status.setText(context.getResources().getString(
						R.string.pedidocreado));*/ //Es el carrito, no mostrar.
				break;
			}
			case 2: {
				viewHolder.status.setText(context.getResources().getString(
						R.string.pedidoconfirmado));
				break;
			}
			case 3: {
				viewHolder.status.setText(context.getResources().getString(
						R.string.pedidotransportado));
				break;
			}
			case 4: {
				viewHolder.status.setText(context.getResources().getString(
						R.string.pedidoentregado));
				break;
			}
			}

		}

		return convertView;
	}

	private static class ViewHolderItem {
		TextView numero;
		TextView direccion;
		TextView fecCreac;
		TextView fecEntre;
		TextView precio;
		TextView status;
		TextView coordenadas;
	}

}
