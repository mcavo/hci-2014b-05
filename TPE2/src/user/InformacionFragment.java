package user;

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.klosh.R;

public class InformacionFragment extends Fragment {

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		View rootView = inflater.inflate(R.layout.fragment_informacion,
				container, false);
		setUserInformation(rootView);
		return rootView;
	}

	public void setUserInformation(View rv) {
		UserManager data = new UserManager(rv.getContext());
		TextView fn = (TextView) rv.findViewById(R.id.nombreU);
		fn.setText(data.getFirstName());
		fn = (TextView) rv.findViewById(R.id.apellidoU);
		fn.setText(data.getLastName());
		fn = (TextView) rv.findViewById(R.id.usuarioU);
		fn.setText(data.getUser());
		fn = (TextView) rv.findViewById(R.id.emailU);
		fn.setText(data.getEmail());
		fn = (TextView) rv.findViewById(R.id.fechacreacionU);
		String fecEntrega = data.getCreatedDate();
		fecEntrega = fecEntrega.substring(8, 10) + "/"
				+ fecEntrega.substring(5, 7) + "/"
				+ fecEntrega.substring(0, 4) + fecEntrega.substring(10);
		fn.setText(fecEntrega);
		fn = (TextView) rv.findViewById(R.id.ultimoinicioU);
		String fecUltimo = data.getLastDate();
		fecUltimo = fecUltimo.substring(8, 10) + "/"
				+ fecUltimo.substring(5, 7) + "/"
				+ fecUltimo.substring(0, 4) + fecUltimo.substring(10);
		fn.setText(fecUltimo);
	}

}
