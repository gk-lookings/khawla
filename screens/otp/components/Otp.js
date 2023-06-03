import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  BackHandler,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TITLE_COLOR,
} from "../../../assets/color";
import { FONT_PRIMARY, FONT_SECONDARY } from "../../../assets/fonts";
import AntDesign from "react-native-vector-icons/AntDesign";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CodeInput from "react-native-code-input";
import Api from "../../../common/api";
import { VERIFY_OTP, CHANGE_EMAIL } from "../../../common/endpoints";

class App extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      code: "",
      email: this.props.navigation.getParam("user").email,
      user: this.props.navigation.getParam("user", null),
      isLoading: false,
      errormessage: null,
    };
    this.onVerify = this.onVerify.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentDidUpdate(prevProps) {
    if (prevProps != this.props && this.props.user != null) {
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  onVerify() {
    const codeInput = this.refs.codeInputRef.state.codeArr.join("");
    if (codeInput.length < 4) return;
    this.setState({ isLoading: true });
    let page = this.props.navigation.getParam("page", null);
    console.log("OTP page params", page);
    console.log("User  details", this.props.navigation.getParam("user"));
    let formdata = new FormData();
    formdata.append("email", this.state.email);
    formdata.append("otp", this.state.code);
    formdata.append("appId", 1);
    console.log("Form data code", this.state.code.length);
    if (page === null || page === "password") {
      Api("post", VERIFY_OTP, formdata).then((response) => {
        if (response && response.status && response.statusCode == 200) {
          this.setState({ isLoading: false, errormessage: null });
          // console.log('page...........', page)
          if (page === "password") {
            this.props.navigation.navigate("ResetPassword", {
              email: this.state.email,
              otp: this.state.code,
            });
          } else {
            this.props.dispatch({
              type: "SIGNUP_FETCHING_SUCCESS",
              user: this.state.user,
            });
            this.props.navigation.navigate("Home");
          }
        } else {
          this.setState({
            isLoading: false,
            errormessage: response.errormessage,
          });
        }
      });
    }
    if (page === "changemail") {
      console.log("change email formdata", formdata);
      Api("post", CHANGE_EMAIL, formdata).then((response) => {
        if (response && response.status && response.statusCode == 200) {
          this.setState({ isLoading: false, errormessage: null });
          //dispatch to change email address
          this.props.dispatch({
            type: "SIGNUP_FETCHING_SUCCESS",
            user: response.userinfo,
          });
          Alert.alert(
            "Email Changed Successfully",
            "",
            [
              {
                text: "OK",
                onPress: () => this.props.navigation.navigate("Settings"),
              },
            ],
            { cancelable: false }
          );
        } else
          this.setState({
            isLoading: false,
            errormessage: response.errormessage,
          });
      });
    }
  }

  onCancel() {
    // this.props.navigation.navigate('Login')
    this.props.navigation.navigate("Settings");
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
        >
          <View style={styles.header}>
            <Text style={styles.welcome}>Welcome to</Text>
            <Text style={styles.appName}>Khawla</Text>
            <Text style={styles.subtitle}>
              An one time password has been sent to{" "}
              <Text style={styles.email}>{this.state.email}</Text>.Please enter
              the verification code.
            </Text>
          </View>
          <View style={{ flex: 0.3 }}>
            <CodeInput
              ref="codeInputRef"
              secureTextEntry={false}
              activeColor={PRIMARY_COLOR}
              inactiveColor={SECONDARY_COLOR}
              autoFocus={false}
              codeLength={4}
              inputPosition="center"
              size={50}
              onFulfill={(code) => this.setState({ code })}
              containerStyle={{ marginTop: 30 }}
              codeInputStyle={{ borderWidth: 1.5 }}
            />
          </View>
          {this.state.errormessage && this.state.code.length > 3 && (
            <Text style={styles.validationText}>
              {this.state.errormessage}{" "}
            </Text>
          )}
          <TouchableOpacity
            onPress={this.onVerify}
            style={styles.button}
            disabled={this.state.code < 4 ? true : false}
          >
            <Text style={styles.signin}>
              {this.state.isLoading ? "Please wait..." : "Verify"}{" "}
            </Text>
            <AntDesign name="arrowright" size={26} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onCancel} style={styles.CancelButton}>
            <Text style={styles.signin}>Cancel</Text>
            <AntDesign name="close" size={26} color="white" />
          </TouchableOpacity>
          {/* <Text style={styles.resend}>resend otp if not recived</Text> */}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userLogin.user,
    isLoading: state.userLogin.isLoading,
  };
};

export default connect(mapStateToProps)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
  },
  scroll: {
    padding: 15,
  },
  header: {
    alignItems: "center",
  },
  welcome: {
    fontFamily: FONT_SECONDARY,
    fontSize: 33,
    textAlign: "center",
    color: TITLE_COLOR,
  },
  appName: {
    fontFamily: FONT_PRIMARY,
    fontSize: 35,
    paddingTop: 10,
    paddingBottom: 15,
    textAlign: "left",
    color: PRIMARY_COLOR,
  },
  subtitle: {
    fontFamily: FONT_PRIMARY,
    fontSize: 22,
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: "left",
    color: TITLE_COLOR,
  },
  button: {
    height: 50,
    width: "100%",
    marginVertical: 10,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
  },
  CancelButton: {
    height: 50,
    width: "100%",
    marginVertical: 10,
    backgroundColor: "#f44336",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  signin: {
    fontFamily: FONT_SECONDARY,
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
  },
  validationText: {
    color: "#f44336",
    fontFamily: FONT_SECONDARY,
    fontSize: 15,
    paddingHorizontal: 15,
    marginTop: 5,
    alignSelf: "center",
  },
  resend: {
    fontFamily: FONT_SECONDARY,
    fontSize: 18,
    textDecorationLine: "underline",
    color: TITLE_COLOR,
    textAlign: "center",
    lineHeight: 25,
    paddingTop: 10,
  },
  email: {
    fontFamily: FONT_PRIMARY,
    fontSize: 18,
    color: PRIMARY_COLOR,
  },
});
