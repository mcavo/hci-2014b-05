package user;

import android.content.Context;
import android.content.SharedPreferences;

public class UserManager {
	private final String SPF = "HMPrefs";

	private Context myContext;

	public UserManager(Context context) {
		myContext = context;
	}

	private SharedPreferences getSettings() {
		return myContext.getSharedPreferences(SPF, 0);
	}

	public String getAuthenticationToken() {
		return getSettings().getString("AT", null);
	}

	public String getUser() {
		return getSettings().getString("U", null);
	}

	public String getFirstName() {
		return getSettings().getString("FN", null);
	}

	public String getLastName() {
		return getSettings().getString("LN", null);
	}
	
	public String getEmail() {
		return getSettings().getString("E", null);
	}
	
	public String getCreatedDate() {
		return getSettings().getString("CD", null);
	}
	
	public String getLastDate() {
		return getSettings().getString("LD", null);
	}
	
	public void setAuthData(String authentication){
		SharedPreferences.Editor editor = getSettings().edit();
		editor.putString("AT", authentication);
		editor.commit();
	}
	
	public void setData(String authentication, String user, String fn,
			String ln, String email, String cd, String ld) {
		SharedPreferences.Editor editor = getSettings().edit();
		editor.putString("AT", authentication);
		editor.putString("U", user);
		editor.putString("FN", fn);
		editor.putString("LN", ln);
		editor.putString("E", email);
		editor.putString("CD", cd);
		editor.putString("LD", ld);
		editor.commit();
	}
}