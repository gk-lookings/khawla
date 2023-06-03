import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  Linking,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { connect } from "react-redux";
import Images from "../../../assets/images";
import AntDesign from "react-native-vector-icons/AntDesign";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SECONDARY_COLOR, PRIMARY_COLOR } from "../../../assets/color";
import {
  FONT_PRIMARY,
  FONT_MULI_EXTRABOLD,
  FONT_MULI_REGULAR,
} from "../../../assets/fonts";
import { TextField } from "react-native-material-textfield";
import MapView from "react-native-maps";
import ConfirmGoogleCaptcha from "react-native-google-recaptcha-v2";
import Api from "../../../common/api";
import { CONTACT } from "../../../common/endpoints";
import i18n from "../../../i18n";

const siteKey = "6Lf41K0UAAAAAHd3FeZbJsMbL00-Beqyk33NHqtp";
const baseUrl = "https://google.com";
const { height, width } = Dimensions.get("screen");

class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam(
        "title",
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 15,
            marginBottom: 10,
            width: width / 2,
          }}
        >
          <Image
            resizeMode="contain"
            source={Images.logoLetterNew}
            style={{ height: 45, width: width / 2 }}
          />
          <View>
            {/* <Image source={Images.logo} style={{ height: 39.2, width: 9.28, marginLeft: 5 }} /> */}
          </View>
        </View>
      ),
      headerTitleStyle: {
        flex: 1,
        alignSelf: "center",
        textAlign: "center",
        color: "black",
        fontSize: 23,
        fontWeight: "bold",
        fontFamily: FONT_PRIMARY,
      },

      headerRight: (
        <TouchableOpacity
          onPress={navigation.getParam("onPress")}
          style={{ paddingRight: 15, paddingLeft: 15 }}
        >
          <AntDesign name="closecircleo" size={26} color={"#000"} style={{}} />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={{ paddingRight: 15, paddingLeft: 15 }}
        >
          <IconMaterial name="sort" size={26} color="black" />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      name: null,
      email: null,
      phone: null,
      designation: null,
      message: null,
      validate: null,
      emailValidate: true,
      isSend: false,
    };
    this.onPress = this.onPress.bind(this);
    this.onSend = this.onSend.bind(this);
    this.validate = this.validate.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ onPress: this.onPress });
  }

  onPress() {
    this.props.navigation.navigate("Home");
  }

  onSend() {
    if (this.state.name == null || this.state.name == "") {
      this.setState({ validate: "Name cannot be empty" });
      return 0;
    }
    if (this.state.phone == null || this.state.phone == "") {
      this.setState({ validate: "Phone number cannot be empty" });
      return 0;
    }
    if (this.state.email == null || this.state.email == "") {
      this.setState({ validate: "Email cannot be empty" });
      return 0;
    }
    if (this.state.designation == null || this.state.designation == "") {
      this.setState({ validate: "Designation cannot be empty" });
      return 0;
    }
    if (!this.state.emailValidate) {
      this.setState({ validate: "Enter valid Email" });
      return 0;
    }
    if (this.state.message == null || this.state.message == "") {
      this.setState({ validate: "Message cannot be empty" });
      return 0;
    } else {
      Keyboard.dismiss();
      this.captchaForm.show();
    }
  }

  onMessage = (event) => {
    if (event && event.nativeEvent.data) {
      if (["cancel", "error", "expired"].includes(event.nativeEvent.data)) {
        this.captchaForm.hide();
        this.setState({ isSend: false });
        return;
      } else {
        console.log("Verified code from Google", event.nativeEvent.data);
        setTimeout(() => {
          this.captchaForm.hide();
          let formData = new FormData();
          formData.append("action", "contact");
          formData.append("name", this.state.name);
          formData.append("email", this.state.email);
          formData.append("phone", this.state.phone);
          formData.append("designation", this.state.designation);
          formData.append("additionalinfo", this.state.message);
          console.log("dataaaas formdata", formData);
          Api("post", CONTACT, formData).then((response) => {
            console.log("dataaaas", response);
            if (response.status == "success") {
              Alert.alert(
                "Alert",
                "Success!",
                [{ text: "OK", onPress: () => this.clearFields() }],
                { cancelable: false }
              );
              this.setState({ isSend: false });
            } else {
              Alert.alert("Alert", "Something went wrong!", [{ text: "OK" }], {
                cancelable: false,
              });
              this.setState({ isSend: false });
            }
          });
        }, 1500);
      }
    }
  };

  clearFields() {
    this.nameInput.clear();
    this.emailInput.clear();
    this.phoneInput.clear();
    this.messageInput.clear(),
      this.designationInput.clear(),
      this.setState({ emailValidate: true });
  }

  validate(text, type) {
    let alph = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (type == "email") {
      if (alph.test(text)) {
        this.setState({
          emailValidate: true,
          email: text,
        });
      } else {
        this.setState({
          emailValidate: false,
          email: text,
        });
      }
    }
  }

  dialCall = () => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = "tel:${+971 2 66 66 004}";
    } else {
      phoneNumber = "telprompt:${+971 2 66 66 004}";
    }

    Linking.openURL(phoneNumber);
  };

  render() {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${24.471758},${54.38534}`;
    const label = "Khawla Art & Cultural Foundation";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.mainContainer}
      >
        <View style={styles.contactConatainer}>
          <Text style={styles.mainHeading}>{i18n.t("register_visitor")}</Text>
          {/* <Text style={styles.subHeading}>Have some questions, we are happy to help you !</Text> */}
          <View>
            <TextField
              label={i18n.t("Name")}
              keyboardType="default"
              formatText={this.formatText}
              onSubmitEditing={this.onSubmit}
              tintColor={PRIMARY_COLOR}
              containerStyle={styles.textInput}
              onChangeText={(text) => this.setState({ name: text })}
              labelTextStyle={
                this.props.lang == "ar"
                  ? { textAlign: "right" }
                  : { textAlign: "left" }
              }
              style={
                this.props.lang == "ar"
                  ? { textAlign: "right" }
                  : { textAlign: "left" }
              }
              ref={(input) => {
                this.nameInput = input;
              }}
            />
            <TextField
              label={i18n.t("Phone")}
              keyboardType="phone-pad"
              formatText={this.formatText}
              onSubmitEditing={this.onSubmit}
              tintColor={PRIMARY_COLOR}
              containerStyle={styles.textInput}
              onChangeText={(text) => this.setState({ phone: text })}
              labelTextStyle={
                this.props.lang == "ar"
                  ? { textAlign: "right" }
                  : { textAlign: "left" }
              }
              style={
                this.props.lang == "ar"
                  ? { textAlign: "right" }
                  : { textAlign: "left" }
              }
              ref={(input) => {
                this.phoneInput = input;
              }}
            />
            <TextField
              label={i18n.t("Email")}
              keyboardType="default"
              formatText={this.formatText}
              onSubmitEditing={this.onSubmit}
              tintColor={PRIMARY_COLOR}
              containerStyle={styles.textInput}
              multiline
              onChangeText={(text) =>
                this.validate(
                  text,
                  "email",
                  this.setState({ validate: null, isSend: false })
                )
              }
              labelTextStyle={
                this.props.lang == "ar"
                  ? { textAlign: "right" }
                  : { textAlign: "left" }
              }
              style={
                this.props.lang == "ar"
                  ? { textAlign: "right" }
                  : { textAlign: "left" }
              }
              ref={(input) => {
                this.emailInput = input;
              }}
            />
            {!this.state.emailValidate && (
              <Text style={styles.emailValidate}>Enter valid Email</Text>
            )}
            <TextField
              label="Designation"
              keyboardType="default"
              formatText={this.formatText}
              onSubmitEditing={this.onSubmit}
              tintColor={PRIMARY_COLOR}
              containerStyle={styles.textInput}
              multiline
              onChangeText={(text) => this.setState({ designation: text })}
              labelTextStyle={
                this.props.lang == "ar"
                  ? { textAlign: "right" }
                  : { textAlign: "left" }
              }
              style={
                this.props.lang == "ar"
                  ? { textAlign: "right" }
                  : { textAlign: "left" }
              }
              ref={(input) => {
                this.designationInput = input;
              }}
            />
            <TextInput
              style={[
                {
                  height: height * 0.15,
                  borderWidth: 0.8,
                  margin: 8,
                  padding: 10,
                  borderColor: "grey",
                  textAlign: "right",
                },
                this.props.lang == "ar"
                  ? { textAlign: "right" }
                  : { textAlign: "left" },
              ]}
              placeholder="Additional Info"
              multiline={true}
              onChangeText={(text) => this.setState({ message: text })}
              textAlignVertical="top"
              ref={(input) => {
                this.messageInput = input;
              }}
            />
          </View>
          {this.state.validate ? (
            <Text style={styles.validateText}>{this.state.validate}</Text>
          ) : (
            <Text />
          )}
          <ConfirmGoogleCaptcha
            ref={(_ref) => (this.captchaForm = _ref)}
            siteKey={siteKey}
            baseUrl={baseUrl}
            languageCode="en"
            onMessage={this.onMessage}
          />
          <TouchableOpacity
            onPress={() => this.setState({ isSend: true }, () => this.onSend())}
            style={styles.send}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {i18n.t("Send")}
            </Text>
            {this.state.isSend && this.state.validate == null && (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginLeft: 5 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
const mapStateToProps = (state) => ({
  lang: state.programmes.lang,
});
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contactConatainer: {
    backgroundColor: "#fff",
    margin: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
    borderRadius: 10,
  },
  mainHeading: {
    fontSize: 20,
    alignSelf: "center",
    marginTop: 20,
    fontFamily: FONT_MULI_EXTRABOLD,
  },
  textInput: {
    marginLeft: 10,
    marginRight: 10,
  },
  send: {
    height: height * 0.05,
    width: "28%",
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 30,
    flexDirection: "row",
  },
  mainContainer2: {
    backgroundColor: "#fff",
    margin: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
    borderRadius: 7,
    paddingBottom: 20,
    paddingTop: 20,
  },
  contact: {
    fontSize: 13,
    fontFamily: FONT_MULI_REGULAR,
  },
  map: {
    height: "80%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  validateText: {
    color: PRIMARY_COLOR,
    marginLeft: 10,
  },
  mainContainer3: {
    height: height * 0.3,
    backgroundColor: "#fff",
    margin: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
    borderRadius: 7,
  },
  emailValidate: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    marginLeft: 10,
  },
  contactBox: {
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    alignSelf: "center",
  },
  shadow: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
  },
});
export default connect(mapStateToProps)(App);
