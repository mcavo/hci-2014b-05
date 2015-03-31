package catalogo;

import java.util.List;

import producto.DownloadImage;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.klosh.R;

public class ProductoAdapter extends BaseAdapter {

	private List<CatalogoProduct> productList;
	private Context context;

	public ProductoAdapter(Context c, List<CatalogoProduct> pl) {
		this.productList = pl;
		this.context = c;
	}

	@Override
	public int getCount() {
		return productList.size();
	}

	@Override
	public Object getItem(int position) {
		return productList.get(position);
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
			convertView = inflater.inflate(R.layout.catalogo_list_elem, parent,
					false);
			viewHolder = new ViewHolderItem();
			viewHolder.marca = (TextView) convertView.findViewById(R.id.marca);
			viewHolder.nombre = (TextView) convertView
					.findViewById(R.id.nombre);
			viewHolder.precio = (TextView) convertView
					.findViewById(R.id.precio);
			viewHolder.imageUrl = (ImageView) convertView
					.findViewById(R.id.imageUrl);

			convertView.setTag(viewHolder);
		} else {
			viewHolder = (ViewHolderItem) convertView.getTag();
		}

		CatalogoProduct product = productList.get(position);

		if (product != null) {
			viewHolder.marca.setText(product.marca);
			viewHolder.nombre.setText(product.nombre);
			viewHolder.precio.setText("$" + String.valueOf(product.precio));
			new DownloadImage(viewHolder.imageUrl).execute(product.imageUrl);
		}

		return convertView;

	}

	private static class ViewHolderItem {
		ImageView imageUrl;
		TextView marca;
		TextView nombre;
		TextView precio;
	}

}
