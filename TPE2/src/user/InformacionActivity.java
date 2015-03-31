package user;

import java.lang.reflect.Method;

import klosh.SuperActivity;
import android.app.ActionBar;
import android.app.ActionBar.Tab;
import android.app.Fragment;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.os.Bundle;
import android.util.Log;

import com.example.klosh.R;

public class InformacionActivity extends SuperActivity implements
		ActionBar.TabListener {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		setContentView(R.layout.activity_informacion);
		super.onCreate(savedInstanceState);

		final ActionBar actionBar = getActionBar();
		try { // Tabs siempre abajo de la ActionBar
			final Method setHasEmbeddedTabsMethod = actionBar.getClass()
					.getDeclaredMethod("setHasEmbeddedTabs", boolean.class);
			setHasEmbeddedTabsMethod.setAccessible(true);
			setHasEmbeddedTabsMethod.invoke(actionBar, false);
		} catch (final Exception e) {
		}
		actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_TABS);
		actionBar.addTab(actionBar.newTab()
				.setText(getResources().getString(R.string.informacion))
				.setTabListener(this));
		actionBar.addTab(actionBar.newTab()
				.setText(getResources().getString(R.string.pedidos))
				.setTabListener(this));
		boolean notif = getIntent().getBooleanExtra("notif", false);
		Log.i("notif", Boolean.toString(notif));
		if (notif) {
			actionBar.setSelectedNavigationItem(1); 
		}
	}

	@Override
	public void onTabReselected(Tab tab, FragmentTransaction ft) {
	}

	@Override
	public void onTabSelected(Tab tab, FragmentTransaction ft) {
		Fragment myf = null;
		if (tab.getPosition() == 0) {
			myf = new InformacionFragment();
		} else {
			myf = new PedidosFragment();
		}
		FragmentManager fragmentManager = getFragmentManager();
		fragmentManager.beginTransaction().replace(R.id.content_frame, myf)
				.commit();
	}

	@Override
	public void onTabUnselected(Tab tab, FragmentTransaction ft) {

	}

}
