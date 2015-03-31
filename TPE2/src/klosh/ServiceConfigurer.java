package klosh;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class ServiceConfigurer extends BroadcastReceiver {

	@Override
	public void onReceive(Context arg0, Intent arg1) {
		Intent service = new Intent();
        service.setAction("CheckOrders");
        arg0.startService(service);
	}

}
