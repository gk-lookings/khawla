package org.evillage.khawlafoundation;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle; // import this
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this); // here
    super.onCreate(savedInstanceState);
  }
  @Override
  protected String getMainComponentName() {
    return "Khawla";
  }
}
