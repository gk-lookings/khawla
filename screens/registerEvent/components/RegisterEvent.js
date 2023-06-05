import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
  Image,
  ActivityIndicatorBase,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import {
  SECONDARY_COLOR,
  PRIMARY_COLOR,
  COLOR_SECONDARY,
} from "../../../assets/color";
import {
  FONT_PRIMARY,
  FONT_MULI_BOLD,
  FONT_LIGHT,
  FONT_MULI_REGULAR,
} from "../../../assets/fonts";
import { TextField } from "react-native-material-textfield";
import DocumentPicker from "react-native-document-picker";
import Api from "../../../common/api";
import { REGISTRATION, ADD_ORDER } from "../../../common/endpoints";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import i18n from "../../../i18n";
import AntDesign from "react-native-vector-icons/AntDesign";
import CheckBox from "react-native-check-box";
import { ScrollView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
const { height, width } = Dimensions.get("screen");

class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.getParam(
        "title",
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: width * 0.6,
          }}
        >
          <Text style={styles.mainTitleText}>{i18n.t("Register")}</Text>
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

      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingRight: 15, paddingLeft: 15 }}
        >
          <IconMaterial name="keyboard-arrow-left" size={32} color={"#000"} />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      singleFile: "",
      singleFile2: "",
      eventDetail: this.props.navigation.getParam("item", null),
      name: null,
      email: null,
      phone: null,
      validate: null,
      emailValidate: true,
      isChecked: false,
      designation: null,
      buyModel: false,
      isLoaderSubmit : false,
      username:'',
      user:null
    };
    this.onSend = this.onSend.bind(this);
    this.validate = this.validate.bind(this);
    this.onPress = this.onPress.bind(this);
    this.buyNow = this.buyNow.bind(this);
  }



  componentDidMount() {
    this.props.navigation.setParams({ onPress: this.onPress });
    this.setState({ language: this.props.lang, user: this.props.user })
  }
  componentDidUpdate() {
    if (this.state.user != this.props.user) {
        this.setState({ user: this.props.user })
        console.log('userr....', this.props.user)

    }
}
  onPress() {
    this.props.navigation.navigate("EventDetail");
  }

  async selectOneFile() {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        type: [DocumentPicker.types.pdf],
      });
      console.log("res : " + JSON.stringify(res));
      console.log("URI : " + res.uri);
      console.log("Type : " + res.type);
      console.log("File Name : " + res.name);
      console.log("File Size : " + res.size);
      this.setState({ singleFile: res });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert("Upload cancelled");
      } else {
        //For Unknown Error
        alert("Error: " + JSON.stringify(err));
        throw err;
      }
    }
  }
  async selectOneFileBack() {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        type: [DocumentPicker.types.pdf],
      });
      console.log("res : " + JSON.stringify(res));
      console.log("URI : " + res.uri);
      console.log("Type : " + res.type);
      console.log("File Name : " + res.name);
      console.log("File Size : " + res.size);
      this.setState({ singleFile2: res });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert("Upload cancelled");
      } else {
        //For Unknown Error
        alert("Error: " + JSON.stringify(err));
        throw err;
      }
    }
  }

  onSend() {
    // if (this.state.name == null || this.state.name == "") {
    //   this.setState({ validate: "Name cannot be empty" });
    //   return 0;
    // }
    if (this.state.designation == null || this.state.designation == "") {
      this.setState({ validate: "Designation cannot be empty" });
      return 0;
    }
    if (this.state.phone == null || this.state.phone == "") {
      this.setState({ validate: "Phone number cannot be empty" });
      return 0;
    }
    // if (this.state.email == null || this.state.email == "") {
    //   this.setState({ validate: "Email cannot be empty" });
    //   return 0;
    // }
    // if (this.state.singleFile == "" && this.state.singleFile2 == "") {
    //   this.setState({ validate: "file cannot be empty" });
    //   return 0;
    // }
    if (
      this.state.singleFile.size > 2097152 ||
      this.state.singleFile.size == 0
    ) {
      this.setState({
        validate: "file only in PDF and Jpg format, up to a maximum of 2mb",
      });
      return 0;
    }
    if (this.state.isChecked == false) {
      this.setState({ validate: "please agree with terms and conditions" });
      return 0;
    } else {
      let formData = new FormData();
      formData.append("action", "contact");
      formData.append("eventName", this.state.eventDetail.title);
      formData.append("eventId", this.state.eventDetail.eventId);
      formData.append("name", this.state.user.username);
      formData.append("designation", this.state.designation);
      formData.append("email", this.state.user.email);
      formData.append("phone", this.state.phone);
      formData.append("document", this.state.singleFile);
      formData.append("document2", this.state.singleFile2);
      console.log("dataaaas", formData);
      this.setState({isLoaderSubmit : true})
      Api("post", REGISTRATION, formData).then((response) => {
        if (response.status == "success") {
          console.log(response),
            
            this.setState({ isSend: false ,isLoaderSubmit:false});
            if(this.state.eventDetail.isPaid==1){
                this.buyNow()
            }
            else{

                Alert.alert(
                    "Registered Successfully!!!",
                    "",
                    [
                        {
                            text: "Ok", onPress: () => this.props.navigation.navigate("EventDetail")

                        }
                    ]
                  );  
            }
            
          
        } else {
          this.setState({ isLoaderSubmit:false})
          Alert.alert(
            "try again !",
            "There was an error with your information",
            
          );
          
        }
      });
    }
  }
  buyNow() {
    let productId = this.state.eventDetail.eventId;
    let formData = new FormData();
    // let shippingId = this.state.itemAddress.shippingId
    formData.append("productId", productId);
    formData.append("productType", 4);
    formData.append("quantity", 1);
    formData.append("action", "buyNow");
    formData.append("language", 2);
    // formData.append('shippingId', shippingId);

    Api("post", ADD_ORDER, formData).then((response) => {
      if (response.statusCode === 200) {
        this.setState({
          buyModel: true,
        });
        this.props.navigation.navigate('EventDetail',{buyModel:true})
      } else {
        this.setState({ buyLoading: false });
      }
    });
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
  
  render() {
    const event = this.state.eventDetail;
    console.log("user....123",this.state.user)
    const userDetails = this.state.user
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView style={styles.mainContainer}>
          <View>
            {/* <View style={styles.imageContainer}>
                                <Image source={{uri: event.eventCover}} style={styles.image} resizeMode="contain"/>
                            </View> */}
            <View>
              <Text
                style={[
                  styles.header,
                  this.props.lang == "ar" && { textAlign: "right" },
                ]}
              >
                {event.title}
              </Text>
              <Text style={styles.headerprice}>Price : {event.priceAED} AED</Text>
              <Text style={[styles.headerprice,{marginLeft:50}]}>:{event.priceUSD} USD</Text>
            </View>
            {/* <Text>{userDetails?.username}</Text> */}
            <View style={styles.registerContainer}>
              <Text style={
                  [,{color:SECONDARY_COLOR,fontSize:16,marginLeft:10,marginTop:40}]
                }>{userDetails?.username}</Text>
                <View style={{height:1,marginTop:10,backgroundColor:"#DCDBDB",marginHorizontal:10}}></View>
              {/* <TextField
                // label={i18n.t("Name")}
                label={userDetails?.username}
                keyboardType="default"
                onSubmitEditing={this.onSubmit}
                tintColor={PRIMARY_COLOR}
                containerStyle={styles.textInput}
                onChangeText={(text) => this.setState({ name: userDetails?.username })}
                style={
                  this.props.lang == "ar"
                    ? { textAlign: "right" }
                    : { textAlign: "left" }
                }
              /> */}
              <TextField
                label={i18n.t("Designation")}
                keyboardType="default"
                onSubmitEditing={this.onSubmit}
                tintColor={PRIMARY_COLOR}
                containerStyle={styles.textInput}
                onChangeText={(text) => this.setState({ designation: text })}
                style={
                  this.props.lang == "ar"
                    ? { textAlign: "right" }
                    : { textAlign: "left" }
                }
              />
              <TextField
                label={i18n.t("Phone")}
                keyboardType="phone-pad"
                onSubmitEditing={this.onSubmit}
                tintColor={PRIMARY_COLOR}
                containerStyle={styles.textInput}
                onChangeText={(text) => this.setState({ phone: text })}
                style={
                  this.props.lang == "ar"
                    ? { textAlign: "right" }
                    : { textAlign: "left" }
                }
              />
              <Text style={
                  [,{color:SECONDARY_COLOR,fontSize:16,marginLeft:10,marginTop:30}]
                }>{userDetails?.email}</Text>
                <View style={{height:1,marginTop:10,backgroundColor:"#DCDBDB",marginHorizontal:10}}></View>
              {/* <TextField
                // label={i18n.t("Email")}
                label={userDetails?.email}
                keyboardType="email-address"
                onSubmitEditing={this.onSubmit}
                tintColor={PRIMARY_COLOR}
                containerStyle={styles.textInput}
                onChangeText={(text) => this.validate(text, "email")}
                style={
                  this.props.lang == "ar"
                    ? { textAlign: "right" }
                    : { textAlign: "left" }
                }
              />
              {!this.state.emailValidate && (
                <Text style={styles.emailValidate}>Enter valid Email</Text>
              )} */}
              <Text
                style={[
                  styles.uploadId,
                  this.props.lang == "en" && { textAlign: "left" },
                ]}
              >
                {i18n.t("Upload_your_id_proof")}
              </Text>
              <View
                style={[
                  styles.uploadContainer,
                  this.props.lang == "ar" && { flexDirection: "row-reverse" },
                ]}
              >
                <View style={styles.uploadBoxContainer}>
                  <TouchableOpacity
                    onPress={this.selectOneFile.bind(this)}
                    style={styles.uploadBox}
                  >
                    <AntDesign name="upload" size={15} />
                    <Text style={styles.uploadText}>{i18n.t("Upload")}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.side}>
                  <Text style={styles.sideText}>{i18n.t("front_image")}</Text>
                </View>
                <View style={styles.fileNameContainer}>
                  <Text numberOfLines={1} style={styles.fileName}>
                    {this.state.singleFile.name}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.uploadContainer,
                  this.props.lang == "ar" && { flexDirection: "row-reverse" },
                ]}
              >
                <View style={styles.uploadBoxContainer}>
                  <TouchableOpacity
                    onPress={this.selectOneFileBack.bind(this)}
                    style={styles.uploadBox}
                  >
                    <AntDesign name="upload" size={15} />
                    <Text style={styles.uploadText}>{i18n.t("Upload")}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.side}>
                  <Text style={styles.sideText}>{i18n.t("back_image")}</Text>
                </View>
                <View style={styles.fileNameContainer}>
                  <Text numberOfLines={1} style={styles.fileName}>
                    {this.state.singleFile2.name}
                  </Text>
                </View>
              </View>
              <Text style={styles.warningtext}>
                (
                {i18n.t(
                  "Please_upload_document_only_in_PDF_and_JPG_format_up_to_a_maximum_of_2MB"
                )}
                )
              </Text>
              <View
                style={[
                  styles.checkBox,
                  this.props.lang == "en" && {
                    flexDirection: "row-reverse",
                    alignSelf: "flex-start",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("TermsCondition")
                  }
                >
                  <Text style={styles.checkBoxTextT}>
                    {i18n.t("i_agree_to_the_terms_and_conditions")}
                  </Text>
                </TouchableOpacity>
                <CheckBox
                  style={{}}
                  onClick={() => {
                    this.setState({
                      isChecked: !this.state.isChecked,
                    });
                  }}
                  isChecked={this.state.isChecked}
                />
              </View>
              {this.state.validate ? (
                <Text style={styles.validateText}>{this.state.validate}</Text>
              ) : (
                <Text />
              )}
              <TouchableOpacity onPress={this.onSend} style={styles.submitBox} >
                <Text style={styles.submitText}>{i18n.t("Submit")}</Text>
                {this.state.isLoaderSubmit && <ActivityIndicator size={"small"}></ActivityIndicator>}
              </TouchableOpacity>
            </View>
           
          </View>
         
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  lang: state.programmes.lang,
  user: state.userLogin.user
});
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textInput: {
    marginLeft: 10,
    marginRight: 10,
  },
  emailValidate: {
    fontSize: 15,
    color: "#f44336",
    marginLeft: 10,
  },
  validateText: {
    color: "#f44336",
    alignSelf: "center",
    marginTop: 5,
  },
  header: {
    fontSize: 20,
    textAlign: "left",
    fontFamily: FONT_MULI_BOLD,
    padding: 10,
    color:PRIMARY_COLOR
  },
  headerprice:{
    fontSize: 16,
    fontFamily:FONT_MULI_REGULAR,
    marginLeft:12,
    marginTop:-10
  },
  registerContainer: {
    backgroundColor: "#fff",
    marginLeft: 20,
    marginRight: 20,
  },
  uploadContainer: {
    flexDirection: "row",
    marginTop: 10,
    height: 30,
  },
  uploadBox: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9999",
    padding: 2,
    borderRadius: 3,
  },
  uploadText: {
    color: "#000",
    fontSize: 10,
    fontFamily: FONT_LIGHT,
  },
  warningtext: {
    padding: 10,
    fontSize: 12,
    fontWeight: "400",
    fontStyle: "italic",
    textAlign: "center",
  },
  submitBox: {
    height: 40,
    width: 170,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 25,
    margin: 20,
    marginTop: 10,
    flexDirection:"row"
  },
  submitText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  checkBox: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkBoxTextT: {
    marginRight: 10,
    fontStyle: "italic",
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontFamily: FONT_MULI_REGULAR,
    marginLeft: 10,
  },
  fileName: {
    marginLeft: 30,
    marginRight: 10,
    width: 150,
    color: COLOR_SECONDARY,
    fontSize: 10,
  },
  fileNameContainer: {
    width: "60%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  side: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBoxContainer: {
    width: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadId: {
    marginRight: 10,
    textAlign: "right",
    fontSize: 15,
    paddingLeft: 10,
    fontFamily: FONT_MULI_BOLD,
  },
  mainTitleText: {
    color: "#000",
    fontSize: 19,
    alignSelf: "center",
    fontFamily: FONT_MULI_BOLD,
  },
  sideText: {
    color: COLOR_SECONDARY,
    marginRight: 5,
    fontFamily: FONT_LIGHT,
  },
});
export default connect(mapStateToProps)(App);
