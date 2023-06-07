import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import {
  FONT_PRIMARY,
  FONT_MULI_BOLD,
  FONT_BOLD,
  FONT_MULI_EXTRABOLD,
  FONT_MEDIUM,
  FONT_MULI_REGULAR,
} from "../../../assets/fonts";
import {
  SECONDARY_COLOR,
  PRIMARY_COLOR,
  COLOR_SECONDARY,
} from "../../../assets/color";
import Api from "../../../common/api";
import i18n from "../../../i18n";
import Modal from "react-native-modal";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import CheckBox from "react-native-check-box";
import {
  TextField,
  formatText,
  onSubmit,
  OutlinedTextField,
} from "react-native-material-textfield";
import { ScrollView } from "react-navigation";
import { useSelector } from "react-redux";
import { ADD_ORDER, SHIPPING_INFO_USER } from "../../../common/endpoints";
import { WebView } from "react-native-webview";
import LottieView from "lottie-react-native";
import anim from "../../../assets/animation/success.json";
import cancel from "../../../assets/animation/cancel.json";
import { formatRate } from "../../../utils/formatRate";
const { height, width } = Dimensions.get("screen");
export default function EventArtWorkDetails({ navigation }) {
  const { artWorkDetails } = navigation.state.params;
  const isLoggedIn = useSelector((state) => state.userLogin.user);
  const lang = useSelector((state) => state.programmes.lang);
  console.log("user", lang);
  console.log("dataaaa", artWorkDetails);
  const [modelVisible, setModelVisible] = useState(false);
  const [validation, setValidate] = useState({ validate: "" });
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [sendLoader, setSendLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [shippingInfoDetails, setShippingInfoDetails] = useState("");
  const [addressModel, setAddressModel] = useState(false);
  const [addAddressModal, setAddAdressModal] = useState(false);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [itemAddress, setItemAddress] = useState("");
  const [buyModal, setBuyModal] = useState(false);
  const [buyDetails, setBuyDetails] = useState("");
  const [cnfrmResponse, setCnfrmResponse] = useState("");
  const [createOrderResponse, setCreateOrderResponse] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [country, setCountry] = useState("");
  const [phoneAddress, setPhoneAddress] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [mobileAddress, setMobileAddress] = useState("");
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [changeLoader, setChangeLoader] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [confirmLoader, setConfirmLoader] = useState(false);
  const [faildModal, setFaildModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [declinedModal, setDeclinedModal] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  let nameRef = useRef();
  let emailRef = useRef();
  let phoneRef = useRef();
  let messageRef = useRef();
  const animation = useRef(null);
  const onSubmit = () => {
    setSendLoader(true);
    let formData = new FormData();
    formData.append("action", "contact");
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("feedback", message);
    formData.append("artworkId", artWorkDetails.artId);
    Api(
      "post",
      "https://www.khawlafoundation.com/api/contact-priceRequest.php",
      formData
    ).then((response) => {
      if (response.status === "success") {
        setSendLoader(false);
        setSuccess(true);
        nameRef.current.clear();
        emailRef.current.clear();
        phoneRef.current.clear();
        messageRef.current.clear();
        setInvalidEmail(false);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setSendLoader(false);
      }
    });
  };
  function validate(text, type) {
    console.log(
      "🚀 ~ file: EventArtWorkDetails.js ~ line 112 ~ validate ~ text",
      text
    );
    let alph = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (type == "email") {
      if (alph.test(text)) {
        console.log("Valid");
        setInvalidEmail(false);
        setEmail(text);
      } else {
        console.log("Invalid");
        setInvalidEmail(true);
        setEmail(text);
      }
    }
  }
  function onSucces() {
    onSubmit();
  }
  function isEmptyTextField() {
    if (name == "") {
      setValidate("Name cannot be empty");
      return 0;
    }
    if (email == "") {
      setValidate("Email cannot be empty");
      return 0;
    }
    if (phone == "") {
      setValidate("Phone number cannot be empty");
      return 0;
    }
    if (invalidEmail) {
      setValidate("Enter valid Email");
      return 0;
    }
    if (message == "") {
      setValidate("Message cannot be empty");
      return 0;
    } else {
      onSucces();
    }
  }

  const EnquiryForm = () => {
    return (
      <View style={styles.contactConatainer}>
        <TouchableOpacity onPress={() => setModelVisible(false)}>
          <AntDesign
            name="closecircleo"
            size={20}
            color="#000"
            style={{ alignSelf: "flex-end", marginTop: 5 }}
          />
        </TouchableOpacity>
        <Text style={styles.mainHeading}>{i18n.t("price_request")}</Text>
        <View style={{ marginHorizontal: 10 }}>
          <TextField
            label={i18n.t("Name")}
            keyboardType="default"
            value={name}
            tintColor={PRIMARY_COLOR}
            containerStyle={styles.textInput}
            lineWidth={1}
            autoCapitalize="none"
            onFocus={() => setValidate("")}
            onChangeText={(text) => setName(text)}
            ref={nameRef}
          />
          <TextField
            label={i18n.t("Email")}
            keyboardType="default"
            formatText={formatText}
            onSubmitEditing={onSubmit}
            tintColor={PRIMARY_COLOR}
            lineWidth={1}
            autoCapitalize="none"
            onFocus={() => setValidate("")}
            onChangeText={(text) => validate(text, "email")}
            ref={emailRef}
          />

          {invalidEmail && (
            <Text
              style={{
                textAlign: "left",
                color: "red",
                // fontFamily: FONT_PRIMARY3,
                fontSize: 12,
              }}
            >
              Please enter a valid email
            </Text>
          )}
          <TextField
            label={i18n.t("Phone")}
            keyboardType="default"
            formatText={formatText}
            onSubmitEditing={onSubmit}
            tintColor={PRIMARY_COLOR}
            lineWidth={1}
            autoCapitalize="none"
            onFocus={() => setValidate("")}
            onChangeText={(text) => setPhone(text)}
            ref={phoneRef}
            value={phone}
          />
          {/* <TextField
             label={i18n.t("Message")}
             keyboardType="default"
             formatText={formatText}
             onSubmitEditing={onSubmit}
             tintColor={PRIMARY_COLOR}
             lineWidth={1}
             autoCapitalize="none"
             onFocus={() => setValidate("")}
             onChangeText={(text) => setMessage(text.trim())}
             ref={messageRef}
           /> */}
          <TextInput
            style={[
              {
                height: height * 0.15,
                borderWidth: 0.8,
                borderColor: "grey",
                marginVertical: 10,
              },
            ]}
            placeholder="Feedback"
            multiline={true}
            onChangeText={(text) => setMessage(text.trim())}
            textAlignVertical="top"
            ref={messageRef}
          />
          {validation != "" && (
            <Text
              style={{
                textAlign: "left",
                color: "red",
                // fontFamily: FONT_PRIMARY3,
                fontSize: 12,
              }}
            >
              {validation}
            </Text>
          )}
          {/* <TouchableOpacity onPress={() => this.setState({ isSend: true }, () => this.onSend())} style={styles.send}>
                                         <Text style={{ color: '#fff', fontWeight: 'bold' }}>{i18n.t("Send")}</Text>
                                         {this.state.isSend && this.state.validate == null &&
                                             <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 5 }} />
                                         }
                                     </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.send}
            onPress={() => isEmptyTextField()}
          >
            <Text
              style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
            >
              {i18n.t("Send")}
            </Text>
            {sendLoader && (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginLeft: 5 }}
              />
            )}
          </TouchableOpacity>

          {success && (
            <Text style={{ color: "green" }}>
              {" "}
              Your message have been send successfully{" "}
            </Text>
          )}
        </View>
      </View>
    );
  };
  const transform = (data) => {
    if (data) {
      return data.replace(/<[^>]+>|\r\n\t|&idquo;|&nbsp;/g, "");
    }
    return data;
  };
  console.log("email validation", invalidEmail);
  function onSave() {
    if (address1 == null || address1 == "") {
      setValidate({ validate: "Address cannot be empty" });
      return 0;
    }
    if (address2 == null || address2 == "") {
      setValidate({ validate: "Address cannot be empty" });
      return 0;
    }
    if (email == null || email == "") {
      setValidate({ validate: "Email cannot be empty" });
      return 0;
    }
    if (invalidEmail) {
      setValidate({ validate: "Enter valid Email" });
      return 0;
    }
    if (phoneAddress == null || phoneAddress == "") {
      setValidate({ validate: "Phone cannot be empty" });
      return 0;
    }
    if (mobileAddress == null || mobileAddress == "") {
      setValidate({ validate: "Mobile cannot be empty" });
      return 0;
    }
    if (country == null || country == "") {
      setValidate({ validate: "Country cannot be empty" });
      return 0;
    }

    if (emailAddress !== null && !invalidEmail) {
      saveAddress();
      setValidate({ validate: null });
    }
  }

  const saveAddress = () => {
    var language = lang == "ar" ? 1 : 2;
    let formD = new FormData();
    formD.append("language", 2);
    formD.append("address_1", address1);
    formD.append("address_2", address2);
    formD.append("email", email);
    formD.append("mobile", mobileAddress);
    formD.append("country", country);
    formD.append("telephone", phoneAddress);
    formD.append("isDefault", isChecked ? 1 : 0);
    formD.append("action", "add");
    console.log("add address", formD);

    Api("post", SHIPPING_INFO_USER, formD).then((response) => {
      console.log("add address response check", response);
      if (response.statusCode == 200) {
        console.log("add address response", response);
        setAddAdressModal(false);

        shippingInfo(1);
      }
    });
  };
  function onPressBuy() {
    if (isLoggedIn) {
      shippingInfo();
    } else {
      navigation.navigate("Login");
    }
  }
  function shippingInfo(data) {
    Api("post", SHIPPING_INFO_USER + `?page=${1}`).then((response) => {
      console.log("shipping details", response);
      setShippingInfoDetails(response.shipping);
      setItemAddress(response.shipping[0]);
      setAddressModel(true);
    });
  }
  function shippingInfoLoad() {
    if (isLastPage) return;
    Api("post", SHIPPING_INFO_USER + `?page=${page}`).then((response) => {
      if (response) {
        setShippingInfoDetails(shippingInfoDetails.concat(response.shipping));
        setIsLastPage(response.isLastPage);
        setPage(page + 1);
      }
    });
  }
  function onSelect(value) {
    if (itemAddress != null) {
      setItemAddress(value);
    }
  }

  function isSelected(name) {
    let status = false;
    if (itemAddress?.shippingId === name?.shippingId) status = true;
    return status;
  }
  function addadrsOpen() {
    setAddressModel(false);
    setTimeout(() => {
      setAddAdressModal(true);
    }, 1000);
  }

  function addadrsClose() {
    setAddAdressModal(false);
    setTimeout(() => {
      setAddressModel(true);
    }, 1000);
  }
  function buyNow() {
    let productId = artWorkDetails.artId;
    let formData = new FormData();
    let shippingId = itemAddress?.shippingId;
    formData.append("productId", productId);
    formData.append("productType", 3);
    formData.append("quantity", 1);
    formData.append("action", "buyNow");
    formData.append("language", 2);
    formData.append("shippingId", shippingId);
    Api("post", ADD_ORDER, formData).then((response) => {
      if (response.statusCode === 200) {
        setBuyDetails(response);
        setAddressModel(false);
        setTimeout(() => {
          setBuyModal(true);
        }, 1000);
      } else {
      }
    });
  }
  function confirmOrder() {
    setConfirmLoader(true);
    let productId = artWorkDetails?.artId;
    let shippingId = itemAddress?.shippingId;
    let formData = new FormData();
    formData.append("productId", productId);
    formData.append("quantity", 1);
    formData.append("action", "orderNow");
    formData.append("shippingId", shippingId);
    Api("post", ADD_ORDER, formData).then((response) => {
      if (response.statusCode === 200) {
        setCnfrmResponse(response);
        let orderId = response?.orderId;
        createOrder(orderId);
      } else {
        // this.setState({ buyLoading: false })
      }
    });
  }
  function createOrder(orderId) {
    let productId = artWorkDetails.artId;
    let productName = artWorkDetails.artTitle;
    let amount = buyDetails.totalPrice;
    // let orderId = cnfrmResponse?.orderId;
    let formData = new FormData();

    formData.append("returnUrl", "https://www.khawlafoundation.com/home");
    formData.append("productType", 4);
    formData.append("orderId", orderId);
    formData.append("amount", amount);
    formData.append("orderName", productName);
    formData.append("language", 2);
    // formData.append('customerName', 'testMerchant')
    Api(
      "post",
      "https://www.khawlafoundation.com/payment/addOrder.php",
      formData
    ).then((response) => {
      if (response.statusCode === 200) {
        setCreateOrderResponse(response);
        // buyModel: false
        let reference = response?.TransactionID;
        orderUpdate(reference, orderId);
      }
    });
  }
  function orderUpdate(reference, orderId) {
    // let orderId = cnfrmResponse?.orderId;
    // let reference = createOrderResponse?.TransactionID;
    let formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("orderReference", reference);
    formData.append("action", "orderUpdate");
    Api("post", ADD_ORDER, formData).then((response) => {
      if (response.statusCode === 200) {
        setBuyModal(false);
        setTimeout(() => {
          {
            setPayModal(true);
            setConfirmLoader(false);
          }
        }, 1000);
        // Linking.openURL(this.state.orderData.secureUrlPayment)
      }
    });
  }

  function orderInfo() {
    let orderId = cnfrmResponse?.orderId;
    let formData = new FormData();
    formData.append("orderId", orderId);
    Api("post", ADD_ORDER, formData).then((response) => {
      if (response.statusCode === 200) {
        console.log("response order info", response);
      }
    });
  }
  function changeModel() {
    setTimeout(() => {
      setAddressModel(true);
      setChangeLoader(false);
    }, 1000);
  }
  function renderAddress({ item }) {
    return (
      <TouchableOpacity
        onPress={() => onSelect(item)}
        style={styles.categoryList}
      >
        {isSelected(item) ? (
          <IconMaterial
            name="radio-button-checked"
            size={19}
            color={PRIMARY_COLOR}
            style={{ marginTop: 5 }}
          />
        ) : (
          <IconMaterial
            name="radio-button-unchecked"
            size={19}
            color={PRIMARY_COLOR}
            style={{ marginTop: 5 }}
          />
        )}
        <View style={{ marginLeft: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.categoryText, { lineHeight: null }]}>
              {item?.shippingAddress1}{" "}
            </Text>
            <View
              style={{
                width: 1,
                height: 12,
                backgroundColor: SECONDARY_COLOR,
                opacity: 0.5,
              }}
            />
            <Text style={[styles.categoryText, { lineHeight: null }]}>
              {" "}
              {item?.shippingAddress2}
            </Text>
          </View>
          <Text style={styles.categoryText}>
            <Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>Email:</Text>{" "}
            {item?.email}
          </Text>
          <Text style={styles.categoryText}>
            <Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>
              Mobile:
            </Text>{" "}
            {item?.mobile}
          </Text>
          <Text style={styles.categoryText}>
            <Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>
              Telephone:
            </Text>{" "}
            {item?.telephone}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  console.log("art work details sarath", artWorkDetails);
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: artWorkDetails?.artPicture }}
          style={styles.imageItem1}
        />
        <Text style={styles.artTitle}>{artWorkDetails?.artTitle}</Text>
        <Text>{transform(artWorkDetails?.artDescription)}</Text>
        <Text style={styles.amountText}>
          Price in USD:{artWorkDetails?.price} USD
        </Text>
        <Text style={styles.amountText}>
          Price in AED:{artWorkDetails?.priceAED} AED
        </Text>
        <View style={styles.qrContainer}>
          <Image
            style={styles.qrImage}
            source={{ uri: artWorkDetails.qrPicture }}
          />
        </View>
      </ScrollView>
      {artWorkDetails?.isForSale == 0 && (
        <TouchableOpacity
          style={styles.priceContainer}
          onPress={() => setModelVisible(true)}
        >
          <Text style={styles.priceText}>{i18n.t("price_request")}</Text>
        </TouchableOpacity>
      )}
      {artWorkDetails?.isForSale == 1 && (
        // onPress={() => this.onPressBuy()}
        <TouchableOpacity
          style={styles.buyNowContainer}
          onPress={() => onPressBuy()}
        >
          <Text style={styles.priceText}>Buy now</Text>
        </TouchableOpacity>
      )}
      {artWorkDetails?.isForSale == 2 && (
        // onPress={() => this.onPressBuy()}
        <View style={styles.buyNowContainer}>
          <Text style={styles.priceText}>Sold Out</Text>
        </View>
      )}

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "green",
        }}
      >
        <Modal
          isVisible={modelVisible}
          hasBackdrop={true}
          backdropOpacity={0.7}
          hideModalContentWhileAnimating={true}
          animationIn="zoomIn"
          animationOut="zoomOut"
          useNativeDriver={true}
          onBackButtonPress={() => setModelVisible(false)}
          onBackdropPress={() => setModelVisible(false)}
          backdropTransitionOutTiming={0}
          style={styles.bottomModal1}
          backdropColor="#000"
        >
          {EnquiryForm()}
        </Modal>
        <Modal
          isVisible={addressModel}
          hasBackdrop={true}
          backdropOpacity={0.5}
          onBackButtonPress={() => setAddressModel(false)}
          onBackdropPress={() => setAddressModel(false)}
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          backdropTransitionOutTiming={0}
          animationInTiming={500}
          animationOutTiming={500}
          style={styles.bottomModal}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderTopRightRadius: 30,
              paddingTop: 0,
            }}
          >
            <View style={styles.titleBar}>
              <Text style={styles.addressTitle}>Select Address</Text>
            </View>
            <View>
              {shippingInfoDetails != "" ? (
                <FlatList
                  data={shippingInfoDetails}
                  renderItem={renderAddress}
                  keyExtractor={(item, index) => index.toString()}
                  style={{ maxHeight: height / 1.8 }}
                  // ListFooterComponent={this.footerView}
                  onEndReached={shippingInfoLoad}
                />
              ) : (
                <Text
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    marginLeft: 5,
                    fontFamily: FONT_MULI_REGULAR,
                    color: SECONDARY_COLOR,
                    fontSize: 16,
                  }}
                >
                  No address found ! please add your address
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => addadrsOpen()}
              style={styles.addAddress}
            >
              <AntDesign name="pluscircleo" size={17} color={PRIMARY_COLOR} />
              <Text style={styles.addAddressTitle1}> Add new address</Text>
            </TouchableOpacity>
            <View
              style={[styles.nextButton, { marginRight: 5, marginBottom: 10 }]}
            >
              <TouchableOpacity
                onPress={() => setAddressModel(false)}
                style={styles.nextbuttonbox}
              >
                <Text style={styles.addAddressTitle}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={shippingInfoDetails == "" ? true : false}
                onPress={() => buyNow()}
                style={[
                  shippingInfoDetails != ""
                    ? styles.nextbuttonbox
                    : styles.nextbuttonboxInactive,
                ]}
              >
                <Text style={styles.addAddressTitle}>NEXT</Text>
                <AntDesign
                  name="doubleright"
                  size={16}
                  color="#ffff"
                  style={{ marginLeft: 5 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          isVisible={buyModal}
          hasBackdrop={true}
          backdropOpacity={0.5}
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          backdropTransitionOutTiming={0}
          animationInTiming={500}
          animationOutTiming={500}
          style={styles.bottomModal}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 10,
              borderTopRightRadius: 30,
              paddingTop: 0,
            }}
          >
            <View style={[styles.titleBar, { marginBottom: 0 }]}>
              <Text style={styles.addressTitle}>Confirm your order</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 30,
              }}
            >
              <Image
                resizeMode="contain"
                source={{ uri: artWorkDetails.artPicture }}
                style={{ height: 120, width: 120, marginTop: 10 }}
              />
              <View style={{ marginLeft: 20 }}>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 20,
                    fontFamily: FONT_MULI_BOLD,
                    color: PRIMARY_COLOR,
                    width: width / 1.9,
                  }}
                >
                  {artWorkDetails.artTitle}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: FONT_MULI_REGULAR,
                    lineHeight: 20,
                  }}
                >
                  Quantity : 1
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: FONT_MULI_REGULAR,
                    lineHeight: 20,
                  }}
                >
                  Shipping cost : {buyDetails.shippingCost}
                </Text>
                <Text style={{ fontSize: 13, fontFamily: FONT_MULI_REGULAR }}>
                  Tax : {buyDetails.tax}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: FONT_MULI_BOLD,
                    color: PRIMARY_COLOR,
                  }}
                >
                  <Text style={{ fontSize: 13, color: "#000" }}>
                    Total price :{" "}
                  </Text>
                  {formatRate(buyDetails.totalPriceAed)} AED
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: FONT_MULI_BOLD,
                    color: PRIMARY_COLOR,
                    marginLeft: 65,
                  }}
                >
                  : {formatRate(buyDetails.totalPriceUSD)} USD
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginLeft: 5,
                marginRight: 10,
              }}
            >
              <Text
                style={[styles.categoryText, { fontFamily: FONT_MULI_BOLD }]}
              >
                Address{" "}
              </Text>
              {!changeLoader ? (
                <TouchableOpacity
                  onPress={() => {
                    setBuyModal(false);
                    setChangeLoader(true);
                    changeModel();
                  }}
                  style={styles.changeButton}
                >
                  <Text style={{ color: "#2e77ff" }}>Change</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.changeButton}>
                  <ActivityIndicator size="small" color={COLOR_SECONDARY} />
                </View>
              )}
            </View>
            <View style={styles.addAddress2}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[styles.categoryText, { lineHeight: null }]}>
                  {itemAddress && itemAddress?.shippingAddress1}{" "}
                </Text>
                <View
                  style={{
                    width: 1,
                    height: 12,
                    backgroundColor: SECONDARY_COLOR,
                    opacity: 0.5,
                  }}
                />
                <Text style={[styles.categoryText, { lineHeight: null }]}>
                  {" "}
                  {itemAddress && itemAddress.shippingAddress2}
                </Text>
              </View>
              <Text style={styles.categoryText}>
                <Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>
                  Email:
                </Text>{" "}
                {itemAddress && itemAddress?.email}
              </Text>
              <Text style={styles.categoryText}>
                <Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>
                  Mobile:
                </Text>{" "}
                {itemAddress && itemAddress?.mobile}
              </Text>
              <Text style={styles.categoryText}>
                <Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>
                  Telephone:
                </Text>{" "}
                {itemAddress && itemAddress?.telephone}
              </Text>
            </View>
            <View style={[styles.nextButton, { marginBottom: 10 }]}>
              <TouchableOpacity
                onPress={() => {
                  setBuyModal(false);
                }}
                style={styles.nextbuttonbox}
              >
                <Text style={styles.addAddressTitle}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmOrder()}
                style={[styles.nextbuttonbox, { width: 180 }]}
              >
                <Text style={styles.addAddressTitle}>CONFIRM ORDER</Text>
                {!confirmLoader ? (
                  <AntDesign
                    name="doubleright"
                    size={16}
                    color="#ffff"
                    style={{ marginLeft: 5 }}
                  />
                ) : (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    style={{ marginLeft: 5 }}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={addAddressModal}
          hideModalContentWhileAnimating={true}
          animationIn="zoomIn"
          animationOut="slideOutRight"
          animationInTiming={800}
          animationOutTiming={500}
          style={styles.modal}
        >
          <View style={styles.addressForm}>
            <Text style={styles.addAddressText}>Add Address</Text>
            <View style={styles.seperator2} />
            <KeyboardAvoidingView style={styles.addressContainer}>
              <View style={[styles.textInputBox, { marginTop: 10 }]}>
                <FontAwesome
                  name="address-book-o"
                  size={25}
                  color={SECONDARY_COLOR}
                  style={styles.iconSub}
                />
                <OutlinedTextField
                  label="Address"
                  keyboardType="default"
                  // formatText={formatText}
                  tintColor={PRIMARY_COLOR}
                  containerStyle={styles.textInput}
                  onChangeText={(text) => setAddress1(text)}
                  lineWidth={1}
                />
              </View>
              <View style={styles.textInputBox}>
                <FontAwesome
                  name="address-book-o"
                  size={25}
                  color={SECONDARY_COLOR}
                  style={styles.iconSub}
                />
                <OutlinedTextField
                  label="Address line 2"
                  keyboardType="default"
                  // formatText={this.formatText}
                  // onSubmitEditing={this.onSubmit}
                  tintColor={PRIMARY_COLOR}
                  containerStyle={styles.textInput}
                  onChangeText={(text) => setAddress2(text)}
                  lineWidth={1}
                />
              </View>
              <View style={styles.textInputBox}>
                <Entypo
                  name="location"
                  size={25}
                  color={SECONDARY_COLOR}
                  style={styles.iconSub}
                />
                <OutlinedTextField
                  label="Country"
                  keyboardType="default"
                  // formatText={this.formatText}
                  // onSubmitEditing={this.onSubmit}
                  tintColor={PRIMARY_COLOR}
                  containerStyle={styles.textInput}
                  onChangeText={(text) => setCountry(text)}
                  lineWidth={1}
                />
              </View>
              <View style={styles.textInputBox}>
                <Entypo
                  name="email"
                  size={25}
                  color={SECONDARY_COLOR}
                  style={styles.iconSub}
                />
                <OutlinedTextField
                  label="Email"
                  keyboardType="email-address"
                  // formatText={this.formatText}
                  // onSubmitEditing={this.onSubmit}
                  tintColor={PRIMARY_COLOR}
                  containerStyle={styles.textInput}
                  onChangeText={(text) =>
                    validate(text, "email", setError(null))
                  }
                  // secureTextEntry={this.state.showpswrd}
                  lineWidth={1}
                />
              </View>
              {invalidEmail && (
                <Text style={styles.emailValidate}>Enter valid Email</Text>
              )}
              <View style={styles.textInputBox}>
                <IconMaterial
                  name="local-phone"
                  size={25}
                  color={SECONDARY_COLOR}
                  style={styles.iconSub}
                />
                <OutlinedTextField
                  label="Phone"
                  keyboardType="number-pad"
                  // formatText={this.formatText}
                  // onSubmitEditing={this.onSubmit}
                  tintColor={PRIMARY_COLOR}
                  containerStyle={styles.textInput}
                  onChangeText={(text) => setPhoneAddress(text)}
                  lineWidth={1}
                />
              </View>
              <View style={styles.textInputBox}>
                <Entypo
                  name="mobile"
                  size={25}
                  color={SECONDARY_COLOR}
                  style={styles.iconSub}
                />
                <OutlinedTextField
                  label="Mobile"
                  keyboardType="number-pad"
                  // formatText={this.formatText}
                  // onSubmitEditing={this.onSubmit}
                  tintColor={PRIMARY_COLOR}
                  containerStyle={styles.textInput}
                  onChangeText={(text) => setMobileAddress(text)}
                  lineWidth={1}
                />
              </View>
              <View
                style={{ flexDirection: "row", marginTop: 10, marginLeft: 30 }}
              >
                <CheckBox
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    setIsChecked(!isChecked);
                  }}
                  isChecked={isChecked}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 16,
                    marginTop: 2,
                    color: SECONDARY_COLOR,
                  }}
                >
                  Default
                </Text>
              </View>
              {!!validation.validate && (
                <Text style={styles.validationText}>{validation.validate}</Text>
              )}
              <View style={[styles.nextButton, { marginRight: 35 }]}>
                <TouchableOpacity
                  onPress={() => addadrsClose()}
                  style={styles.nextbuttonbox}
                >
                  <Text style={styles.addAddressTitle}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onSave()}
                  style={styles.nextbuttonbox}
                >
                  <Text style={styles.addAddressTitle}>SAVE</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
        <Modal
          isVisible={payModal}
          backdropOpacity={0.5}
          // onBackButtonPress={() => this.setState({ isVisible: false })}
          // onBackdropPress={() => this.setState({ isVisible: false })}
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          backdropTransitionOutTiming={0}
          animationInTiming={100}
          animationOutTiming={100}
          style={{
            margin: 0,
          }}
        >
          <WebView
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            // injectedJavaScript={INJECTEDJAVASCRIPT}
            // onNavigationStateChange={this._onNavigationStateChange.bind(this)}
            onShouldStartLoadWithRequest={(event) => {
              console.log(
                "link..................transaction status.........",
                event.url.includes("transactionStatus=0")
              );

              console.log("payment portal link", event.url);
              if (
                event.url.slice(0, 37) ===
                "https://www.khawlafoundation.com/home"
              ) {
                // Linking.openURL(event.url)
                if (event.url.includes("transactionStatus=0")) {
                  setPayModal(false);
                  setTimeout(() => {
                    setFaildModal(true);
                    // animation.current?.play();
                  }, 500);
                  setTimeout(() => {
                    setFaildModal(false);
                  }, 2000);
                  orderInfo();
                } else if (event.url.includes("transactionStatus=1")) {
                  setPayModal(false);
                  setTimeout(() => {
                    setSuccessModal(true);
                    animation.current?.play();
                  }, 500);
                  setTimeout(() => {
                    setSuccessModal(false);
                  }, 2000);
                  orderInfo();
                } else if (event.url.includes("transactionStatus=-1")) {
                  setPayModal(false);
                  setTimeout(() => {
                    setDeclinedModal(true);
                  }, 500);
                  setTimeout(() => {
                    setDeclinedModal(false);
                  }, 2000);
                  orderInfo();
                }
                return false;
              }
              return true;
            }}
            // source={{uri: this.state.orderData.PaymentPortal,   body: JSON.stringify({name: 'TransactionID',value:this.state.orderData.TransactionID }) ,method:'POST'}}

            source={{
              html: `<html><body onload="document.forms[0].submit();">
                                                <form action=${
                                                  createOrderResponse?.PaymentPortal
                                                } method="post">
                                                <input type='Hidden' name='TransactionID' value="${
                                                  createOrderResponse?.TransactionID
                                                }"/>
                                                <input type="submit" value="Submit" style="opacity:0"></form></html>`,
            }}
          />
        </Modal>
        <Modal
          isVisible={faildModal}
          hideModalContentWhileAnimating={true}
          animationIn="zoomIn"
          animationOut="slideOutRight"
          animationInTiming={800}
          animationOutTiming={500}
          style={{}}
        >
          {faildModal && (
            <View style={[styles.fullModel]}>
              <LottieView
                source={require("../../../assets/animation/cancel.json")}
                autoPlay
                loop
                style={{ height: 80, width: 80 }}
              />
              <Text style={styles.modalTextSuccess}>Payment canceled</Text>
            </View>
          )}
          {/* {!faildModal && (
            <View style={styles.containerModal}>
              <ActivityIndicator size="small" color={PRIMARY_COLOR} />
            </View>
          )} */}
        </Modal>
        <Modal
          isVisible={successModal}
          hideModalContentWhileAnimating={true}
          animationIn="zoomIn"
          animationOut="slideOutRight"
          animationInTiming={800}
          animationOutTiming={500}
          style={styles.modal}
        >
          {successModal && (
            <View style={styles.fullModel}>
              <LottieView
                source={require("../../../assets/animation/success.json")}
                autoPlay
                loop
                style={{ height: 80, width: 80 }}
              />
              <Text style={styles.modalTextSuccess}>Payment success</Text>
            </View>
          )}
          {/* {cartLoading && (
            <View style={styles.containerModal}>
              <ActivityIndicator size="small" color={PRIMARY_COLOR} />
            </View>
          )} */}
        </Modal>
        <Modal
          isVisible={declinedModal}
          hideModalContentWhileAnimating={true}
          animationIn="zoomIn"
          animationOut="slideOutRight"
          animationInTiming={800}
          animationOutTiming={500}
          style={styles.modal}
        >
          {declinedModal && (
            <View style={styles.fullModel}>
              <IconMaterial name="error-outline" size={80} color="red" />
              <Text style={styles.modalTextFaild}>Payment Declined!</Text>
            </View>
          )}

          {/* <View style={styles.containerModal}>
              <ActivityIndicator size="small" color={PRIMARY_COLOR} />
            </View>
          )} */}
        </Modal>
      </View>
    </View>
  );
}
EventArtWorkDetails.navigationOptions = ({ navigation }) => ({
  title: null,
  headerTitleAlign: "center",

  headerRight: null,
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => navigation.goBack(null)}
      style={{ paddingRight: 15, paddingLeft: 15 }}
    >
      <IconMaterial name="keyboard-arrow-left" size={32} color={"#000"} />
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  imageItem1: {
    width: 408,
    height: 250,
    borderRadius: 5,
  },
  artTitle: {
    fontSize: 20,
    textAlign: "left",

    color: "#ad6183",
    fontFamily: FONT_MULI_BOLD,
  },
  artDescription: {
    textAlign: "justify",
  },
  aboutus1: {
    backgroundColor: "#ad6183",
    width: 130,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  priceText: {
    fontSize: 16,
    fontFamily: FONT_MULI_BOLD,
    color: "#fff",
  },
  priceContainer: {
    backgroundColor: "green",
    width: width - 100,
    alignSelf: "center",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    position: "absolute",
    bottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
    marginBottom: 50,
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
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  mainHeading: {
    fontSize: 20,
    alignSelf: "center",
    marginTop: 10,
    fontFamily: FONT_MULI_EXTRABOLD,
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
    marginBottom: 10,
    flexDirection: "row",
  },
  qrContainer: {
    marginVertical: 30,
    alignSelf: "center",
    paddingBottom: 100,
  },
  qrImage: {
    width: width / 1.2,
    height: width / 1.2,
  },
  buyNowContainer: {
    backgroundColor: PRIMARY_COLOR,
    width: width - 100,
    alignSelf: "center",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    position: "absolute",
    bottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  bottomModal: {
    margin: 0,
    justifyContent: "flex-end",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  titleBar: {
    height: 32,
    backgroundColor: PRIMARY_COLOR,
    width: width,
    borderTopRightRadius: 30,
    marginLeft: -10,
    justifyContent: "center",
    marginBottom: 20,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  addressTitle: {
    fontFamily: FONT_MULI_BOLD,
    fontSize: 14,
    color: "#fff",
    marginLeft: 10,
  },
  addAddressTitle: {
    fontFamily: FONT_MULI_REGULAR,
    fontSize: 15,
    color: "#fff",
  },
  addAddressTitle: {
    fontFamily: FONT_MULI_REGULAR,
    fontSize: 15,
    color: "#fff",
  },
  addAddressTitle1: {
    fontFamily: FONT_MULI_REGULAR,
    fontSize: 14,
    marginLeft: 10,
    color: SECONDARY_COLOR,
  },
  addAddress: {
    flexDirection: "row",
    padding: 5,
    borderRadius: 8,
    width: width - 18,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ebeced",
  },
  addAddress2: {
    padding: 5,
    borderRadius: 8,
    alignSelf: "flex-end",
    width: width - 18,
    alignSelf: "center",
    marginBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ebeced",
  },
  nextButton: {
    flexDirection: "row",
    alignSelf: "flex-end",
    width: width - 20,
    alignSelf: "center",
    height: 40,
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
  },
  nextbuttonbox: {
    backgroundColor: PRIMARY_COLOR,
    height: "100%",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 7,
    flexDirection: "row",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  nextbuttonboxInactive: {
    backgroundColor: PRIMARY_COLOR,
    height: "100%",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 7,
    flexDirection: "row",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    opacity: 0.5,
  },
  categoryText: {
    fontFamily: FONT_MULI_REGULAR,
    fontSize: 15,
    lineHeight: 20,
  },
  nextbuttonbox: {
    backgroundColor: PRIMARY_COLOR,
    height: "100%",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 7,
    flexDirection: "row",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  changeButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    margin: 5,
  },
  addressForm: {
    backgroundColor: "#fff",
    width: width - 30,
    alignSelf: "center",
    padding: 10,
    borderRadius: 10,
  },
  addAddressText: {
    alignSelf: "center",
    fontFamily: FONT_MULI_BOLD,
    fontSize: 16,
  },
  textInput: {
    height: height * 0.065,
    width: "90%",
    borderRadius: 10,
    paddingLeft: 5,
    alignSelf: "center",
  },
  textInputBox: {
    width: "98%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconSub: {
    width: "10%",
  },
  emailValidate: {
    marginLeft: 45,
    color: "red",
    marginBottom: 10,
  },
  validationText: {
    marginLeft: 10,
    color: "red",
  },
  seperator2: {
    height: 1,
    backgroundColor: "#ebeced",
    width: width - 30,
    alignSelf: "center",
  },
  bottomModal: {
    margin: 0,
    justifyContent: "flex-end",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  categoryList: {
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  fullModel: {
    // height: height,
    // width: width,
    flex: 1,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  amountText: {
    color: "#ad6183",
    fontFamily: FONT_MULI_BOLD,
  },
});
