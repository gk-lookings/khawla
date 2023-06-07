import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { connect } from "react-redux";
import {
  SECONDARY_COLOR,
  PRIMARY_COLOR,
  COLOR_SECONDARY,
} from "../../../assets/color";
import Api from "../../../common/api";
import VideoPlayer from "react-native-video-controls";
import {
  FONT_PRIMARY,
  FONT_MULI_BOLD,
  FONT_LIGHT,
  FONT_MULI_REGULAR,
} from "../../../assets/fonts";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Modal from "react-native-modal";
import i18n from "../../../i18n";
import {
  ARTISTS,
  ADD_ORDER,
  SHIPPING_INFO_USER,
} from "../../../common/endpoints";
import LinearGradient from "react-native-linear-gradient";
import Video from "react-native-video";
import AutoHeightWebView from "react-native-autoheight-webview";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { WebView } from "react-native-webview";
import Animation from "lottie-react-native";
import anim from "../../../assets/animation/success.json";
import cancel from "../../../assets/animation/cancel.json";
import { TextField, OutlinedTextField } from "react-native-material-textfield";
import CheckBox from "react-native-check-box";
var videoLink = "";
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
          <Text style={styles.mainTitleText}>{i18n.t("Events")}</Text>
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
          onPress={() => navigation.goBack(null)}
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
      eventData: this.props.navigation.getParam("item", null),
      eventDetails: [],
      hhCollection: [],
      isLastPageHH: false,
      isLoading: true,
      loading: true,
      isVisible: false,
      videoLinks: "",
      artistDetails: "",
      isVisibleImage: false,
      image: "",
      videoLink: [],
      playing: false,
      isVisiblePic: false,
      image: "",
      eventId: this.props.navigation.getParam("eventId", null),
      page: 1,
      totalCollection: 0,
      addressModel: false,
      buyModel: false,
      buyDetails: [],
      orderData: [],
      declineModel: false,
      addAddrsModal: false,
      shippingInfo: [],
      address1: null,
      address2: null,
      email: null,
      emailValidate: true,
      phone: null,
      mobile: null,
      validate: null,
      error: null,
      country: null,
      isChecked: false,
      isVisibleLoginCheck: false,
    };
    this.renderVideos = this.renderVideos.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this.renderArtist = this.renderArtist.bind(this);
    this.renderArtwork = this.renderArtwork.bind(this);
    this.renderhhCollection = this.renderhhCollection.bind(this);
    this.onPress = this.onPress.bind(this);
    this.artistDetails = this.artistDetails.bind(this);
    this.vimeoPlay = this.vimeoPlay.bind(this);
    this.hhCollection = this.hhCollection.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.shippingInfo = this.shippingInfo.bind(this);
    this.shippingInfoLoad = this.shippingInfoLoad.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.renderAddress = this.renderAddress.bind(this);
    // this.validate = this.validate.bind(this)
    this.buyNow = this.buyNow.bind(this);
  }

  componentDidMount() {
    const params =
      this.state.eventId == null
        ? this.state.eventData.eventId
        : this.state.eventId;
    var language = this.props.lang == "ar" ? 1 : 2;
    Api(
      "get",
      `https://www.khawlafoundation.com/api/json_event_indetail.php?eventId=${params}&language=${language}`
    ).then((response) => {
      console.log("events detail...123456", response);
      if (response) {
        this.setState({
          eventDetails: response,
          isLoading: false,
        });
        {
          this.artistDetails();
        }
        {
          this.vimeoPlay();
        }
      } else {
        this.setState({
          isLoading: false,
        });
      }
    });
    this.props.navigation.setParams({ onPress: this.onPress });
    this.hhCollection(params, language);
    // Api('get', `https://www.khawlafoundation.com/api/json_event_artworks.php?eventId=${params}&language=${language}&artistId=14`)
    //     .then((response) => {

    //         if (response) {
    //             this.setState({
    //                 hhCollection: response.items,
    //                 isLoading: false,
    //             })

    //         }
    //         else {
    //             this.setState({
    //                 isLoading: false,
    //             })
    //         }
    //     })
  }

  hhCollection(params, language) {
    Api(
      "get",
      `https://www.khawlafoundation.com/api/json_event_artworks.php?eventId=${params}&language=${language}&artistId=14&page=${
        this.state.page
      }`
    ).then((response) => {
      console.log("response hh collectionss", response);
      if (response) {
        this.setState({
          hhCollection: [...this.state.hhCollection, ...response.items],
          isLoading: false,
          isLastPageHH: response.isLastPage,
          page: this.state.page + 1,
          totalCollection: response.total,
        });
      } else {
        this.setState({
          isLoading: false,
        });
      }
    });
  }
  onEnd() {
    if (
      this.state.isLastPageHH &&
      this.state.totalCollection == this.state.hhCollection.length
    )
      return;
    const params =
      this.state.eventId == null
        ? this.state.eventData.eventId
        : this.state.eventId;
    var language = this.props.lang == "ar" ? 1 : 2;
    this.hhCollection(params, language);
  }
  onPress() {
    this.props.navigation.navigate("Home");
  }

  artistDetails() {
    const artistId = this.state.eventDetails.artistId;
    var language = this.props.lang == "ar" ? 1 : 2;
    Api(
      "get",
      ARTISTS + "?artistId=" + artistId + `&language=${language}`
    ).then((response) => {
      console.log("aetist responseeeee sarath", response);
      if (response.items.length > 0) {
        this.setState({
          artistDetails: response.items[0],
        });
      } else {
        this.setState({
          artistDetails: "",
        });
      }
    });
  }

  renderVideos({ item }) {
    return (
      <TouchableOpacity
        onPress={() => this.setState({ isVisible: true, videoLinks: item })}
        style={styles.videoImage}
      >
        <ImageBackground
          source={{ uri: this.state.eventDetails.eventCover }}
          style={{ height: 95, width: 95, borderRadius: 10 }}
          borderRadius={10}
          blurRadius={2}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#000",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.5,
              borderRadius: 10,
            }}
          >
            <AntDesign
              name="playcircleo"
              size={25}
              color="#fff"
              style={styles.iconContainer2}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
  // onPress={() => this.setState({ isVisibleImage: true, image: item })}
  renderImage({ item }) {
    return (
      <TouchableOpacity
        onPress={() => this.setState({ isVisiblePic: true, image: item })}
        style={styles.imageList}
      >
        <Image source={{ uri: item }} style={styles.imageItem} />
      </TouchableOpacity>
    );
  }
  renderArtist({ item }) {
    return (
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("ArtistDetail", {
              artistId: item.artistId,
            })
          }
        >
          <Image
            source={{ uri: item.picture }}
            style={styles.artistimageItem}
          />
        </TouchableOpacity>
        <Text>{item.artistName}</Text>
      </View>
    );
  }

  renderhhCollection({ item }) {
    return (
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("hhWorkDetails", {
              hhWorkDetails: item,
            })
          }
        >
          <Image source={{ uri: item.artPicture }} style={styles.imageList} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={{ width: 90 }}>
          {item.artTitle}
        </Text>
      </View>
    );
  }
  renderArtwork({ item }) {
    return (
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("EventArtWorkDetails", {
              artWorkDetails: item,
            })
          }
        >
          <Image source={{ uri: item.artPicture }} style={styles.imageItem1} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={{ width: 80 }}>
          {item.artTitle}
        </Text>
      </View>
    );
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  }

  _onLoadEnd = () => {
    this.setState({
      loading: false,
    });
  };

  vimeoPlay() {
    if (
      this.state.eventDetails &&
      this.state.eventDetails.videoURL.includes("vimeo")
    ) {
      if (this.state.eventDetails.videoURL) {
        var url = this.state.eventDetails.videoURL;
        var regExp = /https:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
        var urlParts = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(url);
        var path = urlParts[2];
        var tempArray = path
          .split("/")
          .splice(path.split("/").length - 2, path.split("/").length - 1);
        var match = url.match(regExp);
        if (match) {
          const VIMEO_ID = match[2];
          fetch(
            `https://player.vimeo.com/video/${VIMEO_ID}/config?h=${
              tempArray[1]
            }`
          )
            .then((res) => res.json())
            .then((res) =>
              this.setState({
                videoLink: res.request.files.hls.cdns[
                  res.request.files.hls.default_cdn
                ].url.trim(),
                loading: false,
              })
            )
            .catch((err) => {
              console.log("err", err);
            });
          return videoLink;
        }
        if (this.state.videoLink != videoLink) {
          this.setState({
            videoLink: videoLink,
            videoName: this.state.eventDetails.videoTitle1,
          });
        }
      }
    }
  }

  renderOptions = () => {
    if (this.state.videoLink.length > 0) {
      console.log("link,,,fuction,,", this.state.videoLink);
      return (
        <View style={{}}>
          <Video
            ref={(ref) => {
              this.player = ref;
            }}
            source={{ uri: this.state.videoLink }}
            playInBackground={false}
            paused={false}
            playInBackground={true}
            playWhenInactive={true}
            fullscreenOrientation={"landscape"}
            navigator={this.props.navigator}
            onLoad={() => this.setState({ videoLoad: null })}
            controls={true}
            resizeMode={"contain"}
            style={[
              styles.backgroundVideo,
              { backgroundColor: this.state.loading ? "#EDEDED" : "#000" },
            ]}
          />
        </View>
      );
    }
  };
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
  onSave() {
    if (this.state.address1 == null || this.state.address1 == "") {
      this.setState({ validate: "Address cannot be empty" });
      return 0;
    }
    if (this.state.address2 == null || this.state.address2 == "") {
      this.setState({ validate: "Address cannot be empty" });
      return 0;
    }
    if (this.state.email == null || this.state.email == "") {
      this.setState({ validate: "Email cannot be empty" });
      return 0;
    }
    if (!this.state.emailValidate) {
      this.setState({ validate: "Enter valid Email" });
      return 0;
    }
    if (this.state.phone == null || this.state.phone == "") {
      this.setState({ validate: "Phone cannot be empty" });
      return 0;
    }
    if (this.state.mobile == null || this.state.mobile == "") {
      this.setState({ validate: "Mobile cannot be empty" });
      return 0;
    }
    if (this.state.country == null || this.state.country == "") {
      this.setState({ validate: "Country cannot be empty" });
      return 0;
    }

    if (this.state.email !== null && this.state.emailValidate) {
      this.saveAddress();
      this.setState({ validate: null });
    }
  }

  saveAddress() {
    var language = this.props.lang == "ar" ? 1 : 2;
    let formD = new FormData();
    formD.append("language", language);
    formD.append("address_1", this.state.address1);
    formD.append("address_2", this.state.address2);
    formD.append("email", this.state.email);
    formD.append("mobile", this.state.mobile);
    formD.append("country", this.state.country);
    formD.append("telephone", this.state.phone);
    formD.append("isDefault", this.state.isChecked ? 1 : 0);
    formD.append("action", "add");

    Api(
      "post",
      "https://www.khawlafoundation.com/api/json_user_shippinginfos.php",
      formD
    ).then((response) => {
      alert("ok");
      if (response.statusCode == 200) {
        this.setState({
          addAddrsModal: false,
        }),
          this.shippingInfo(1);
      }
    });
  }
  changeModel() {
    setTimeout(() => {
      this.setState({
        addressModel: true,
        changeLoader: false,
      });
    }, 1000);
  }
  addadrsOpen() {
    setTimeout(() => {
      this.setState({
        addAddrsModal: true,
      });
    }, 1000);
  }

  addadrsClose() {
    setTimeout(() => {
      this.setState({
        addressModel: true,
      });
    }, 1000);
  }
  onSelect(value) {
    if (this.state.itemAddress != null) {
      this.setState({ itemAddress: value });
    }
  }

  isSelected(name) {
    let status = false;
    if (this.state.itemAddress.shippingId === name.shippingId) status = true;
    return status;
  }
  onPressBuy() {
    if (this.props.user) {
      this.shippingInfo(0);
    } else {
      this.setState({ isVisibleLogin: true });
    }
  }
  addadrsOpen() {
    setTimeout(() => {
      this.setState({
        addAddrsModal: true,
      });
    }, 1000);
  }

  addadrsClose() {
    setTimeout(() => {
      this.setState({
        addressModel: true,
      });
    }, 1000);
  }
  shippingInfo(data) {
    Api("post", SHIPPING_INFO_USER + `?page=${1}`).then((response) => {
      if (response) {
        let res = response.shipping;
        console.log("shipping info..", response);
        if (data == 0) {
          this.setState({
            shippingInfo: res,
            addressModel: true,
            itemAddress: response.shipping[0],
          });
        } else {
          setTimeout(() => {
            this.setState({
              shippingInfo: res,
              addressModel: true,
              itemAddress: response.shipping[0],
            });
          }, 1000);
        }
      }
    });
  }

  shippingInfoLoad() {
    let page = this.state.page;
    Api("post", SHIPPING_INFO_USER + `?page=${page}`).then((response) => {
      if (response) {
        let res = response.shipping;
        this.setState({
          shippingInfo: this.state.shippingInfo.concat(res),
          isLastPage: response.isLastPage,
          page: this.state.page + 1,
        });
      }
    });
  }

  buyNow() {
    let productId = this.state.eventDetails.eventId;
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
        setTimeout(() => {
          this.setState({
            buyModel: true,
            buyDetails: response,
          });
        }, 500);
      } else {
        this.setState({ buyLoading: false });
      }
    });
  }

  confirmOrder() {
    let productId = this.state.eventDetails.eventId;
    // let shippingId = this.state.itemAddress.shippingId
    let formData = new FormData();
    formData.append("productId", productId);
    formData.append("quantity", 1);
    formData.append("action", "orderNow");
    formData.append("productType", 4);
    Api("post", ADD_ORDER, formData).then((response) => {
      if (response.statusCode === 200) {
        this.setState({ confirm: response });
        this.createOrder();
      } else {
        this.setState({ buyLoading: false });
      }
    });
  }

  createOrder() {
    let productId = this.state.eventDetails.eventId;
    let productName = this.state.eventDetails.title;
    let amount = this.state.priceAED;
    let orderId = this.state.confirm.orderId;
    let quantity = this.state.numQuantity;
    let formData = new FormData();
    console.log("forrmdatatadtta", formData);
    formData.append("returnUrl", "https://www.khawlafoundation.com/home");
    formData.append("productType", 4);
    formData.append("orderId", orderId);
    formData.append("amount", this.props.navigation.getParam("priceAED", ""));
    formData.append("orderName", productName.slice(0, 20));
    formData.append("language", this.props.lang);
    // formData.append('customerName', 'testMerchant')
    console.log("form data create order", formData);
    Api(
      "post",
      "https://www.khawlafoundation.com/payment/addOrder.php",
      formData
    ).then((response) => {
      if (response.statusCode === 200) {
        this.setState({ orderData: response });
        this.props.navigation.setParams({ buyModel: false });
        this.orderUpdate();
      }
    });
  }

  orderUpdate() {
    let orderId = this.state.confirm.orderId;
    let reference = this.state.orderData.TransactionID;
    let formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("orderReference", reference);
    formData.append("action", "orderUpdate");
    Api("post", ADD_ORDER, formData).then((response) => {
      if (response.statusCode === 200) {
        console.log("transaction iddd", this.state.orderData.TransactionID);
        setTimeout(() => {
          this.setState({
            payModel: true,
            confirmLoader: false,
          });
        }, 500);
        // Linking.openURL(this.state.orderData.secureUrlPayment)
      }
    });
  }

  orderInfo() {
    let orderId = this.state.confirm.orderId;
    let formData = new FormData();
    formData.append("orderId", orderId);
    Api("post", ADD_ORDER, formData).then((response) => {
      if (response.statusCode === 200) {
      }
    });
  }
  renderAddress({ item }) {
    return (
      <TouchableOpacity
        onPress={() => this.onSelect(item)}
        style={styles.categoryList}
      >
        {this.isSelected(item) ? (
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
              {item.shippingAddress1}{" "}
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
              {item.shippingAddress2}
            </Text>
          </View>
          <Text style={styles.categoryText}>
            <Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>Email:</Text>{" "}
            {item.email}
          </Text>
          <Text style={styles.categoryText}>
            <Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>
              Mobile:
            </Text>{" "}
            {item.mobile}
          </Text>
          <Text style={styles.categoryText}>
            <Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>
              Telephone:
            </Text>{" "}
            {item.telephone}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    var today = this.formatDate(new Date());
    var eventDate = this.state.eventDetails.eventDateFrom;
    const events = this.state.eventDetails;
    const price = this.state.buyDetails.totalPrice;
    const priceAED = this.state.buyDetails.priceAED;

    return (
      <SafeAreaView style={styles.mainContainer}>
        {this.state.isLoading && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          </View>
        )}
        {!this.state.isLoading && (
          <ScrollView style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => this.setState({ isVisibleImage: true })}
            >
              <Image
                source={{ uri: events.eventCover }}
                style={styles.imageStyle}
                onLoadEnd={this._onLoadEnd}
                resizeMode="contain"
              />
              <ActivityIndicator
                style={styles.activityIndicator}
                animating={this.state.loading}
              />
            </TouchableOpacity>
            <View>
              {events.title != "" && (
                <Text
                  numberOfLines={3}
                  style={[
                    styles.titleEvent,
                    this.props.lang == "ar" && { textAlign: "right" },
                  ]}
                >
                  {events.title}
                </Text>
              )}
              <View>
                {events.eventDisplayDate != "" && (
                  <View
                    style={[
                      styles.dateContainer,
                      this.props.lang == "ar" && {
                        flexDirection: "row-reverse",
                      },
                    ]}
                  >
                    <AntDesign
                      name="calendar"
                      size={16}
                      color={COLOR_SECONDARY}
                      style={[
                        styles.icon,
                        this.props.lang == "ar" && {
                          marginRight: 10,
                          marginLeft: 0,
                        },
                      ]}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.eventDate,
                        this.props.lang == "ar" && { textAlign: "right" },
                      ]}
                    >
                      {events.eventDateFrom}
                    </Text>
                  </View>
                )}
                {events.eventTime != " " && (
                  <View
                    style={[
                      styles.dateContainer,
                      this.props.lang == "ar" && {
                        flexDirection: "row-reverse",
                      },
                    ]}
                  >
                    <AntDesign
                      name="clockcircleo"
                      size={16}
                      color={COLOR_SECONDARY}
                      style={[
                        styles.icon,
                        this.props.lang == "ar" && {
                          marginRight: 10,
                          marginLeft: 0,
                        },
                      ]}
                    />
                    <Text
                      numberOfLines={3}
                      style={[
                        styles.eventDate,
                        this.props.lang == "ar" && { textAlign: "right" },
                      ]}
                    >
                      {events.eventTime}
                    </Text>
                  </View>
                )}
                {events.location != " " && (
                  <View
                    style={[
                      styles.dateContainer,
                      this.props.lang == "ar" && {
                        flexDirection: "row-reverse",
                      },
                    ]}
                  >
                    <SimpleLineIcons
                      name="location-pin"
                      size={16}
                      color={COLOR_SECONDARY}
                      style={[
                        styles.icon,
                        this.props.lang == "ar" && {
                          marginRight: 10,
                          marginLeft: 0,
                        },
                      ]}
                    />
                    <Text
                      numberOfLines={3}
                      style={[
                        styles.eventDate,
                        this.props.lang == "ar" && { textAlign: "right" },
                      ]}
                    >
                      {events.location}
                    </Text>
                  </View>
                )}
              </View>
              {this.state.artistDetails != "" && (
                <TouchableOpacity
                  style={[
                    { flexDirection: "row", alignItems: "center" },
                    this.props.lang == "ar" && { flexDirection: "row-reverse" },
                  ]}
                  onPress={() =>
                    this.props.navigation.navigate("ArtistDetail", {
                      artists:
                        this.state.artistDetails && this.state.artistDetails,
                    })
                  }
                >
                  <Text
                    numberOfLines={3}
                    style={[
                      styles.titleArtist,
                      this.props.lang == "ar" && {
                        textAlign: "right",
                        paddingRight: 10,
                        paddingLeft: 3,
                      },
                    ]}
                  >
                    {this.state.artistDetails &&
                      this.state.artistDetails.artistTitle}
                  </Text>
                  <EvilIcons
                    name="external-link"
                    size={20}
                    color={PRIMARY_COLOR}
                    style={{ opacity: 0.7 }}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("PdfView", {
                  pdfData: this.state.eventDetails?.brochureEn,
                })
              }
              style={{ flexDirection: "row" }}
            >
              <AntDesign
                name="pdffile1"
                size={15}
                color={PRIMARY_COLOR}
                //   onPress={() =>
                //     navigation.navigate("PdfView", {
                //       seriesdetail: ExhibitionDetails,
                //     })
                //   }
                style={{ marginLeft: 10 }}
              />
              <Text style={{ color: PRIMARY_COLOR }}>Brochure in English</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("PdfView", {
                  pdfData: this.state.eventDetails?.brochureAr,
                })
              }
              style={{ flexDirection: "row" }}
            >
              <AntDesign
                name="pdffile1"
                size={15}
                color={PRIMARY_COLOR}
                //   onPress={() =>
                //     navigation.navigate("PdfView", {
                //       seriesdetail: ExhibitionDetails,
                //     })
                //   }
                style={{ marginLeft: 10 }}
              />
              <Text style={{ color: PRIMARY_COLOR }}>Brochure in Arabic</Text>
            </TouchableOpacity>
            <View style={styles.descriptionView}>
              <AutoHeightWebView
                style={styles.WebView}
                customStyle={`
                                * {
                                }
                                p {
                                    font-size: 17px;
                                }`}
                files={[
                  {
                    href: "cssfileaddress",
                    type: "text/css",
                    rel: "stylesheet",
                  },
                ]}
                source={{ html: events.description }}
                scalesPageToFit={true}
                viewportContent={"width=device-width, user-scalable=yes"}
                scrollEnabled={false}
              />
            </View>

            {/* {events.isPaid ==1?(<TouchableOpacity style={styles.register1} onPress={()=>this.buyNow()}><Text style={{color:"white",fontFamily: FONT_MULI_BOLD,
        fontSize: 15}}>Buy Now</Text></TouchableOpacity>):null} */}
            {this.state.eventDetails.eventArtworks != "" && (
              <View style={styles.videosContainer}>
                <View
                  style={[
                    styles.moreContainer,
                    this.props.lang == "ar" && { flexDirection: "row-reverse" },
                  ]}
                >
                  <Text
                    style={[
                      styles.imageTitle,
                      this.props.lang == "ar" && { textAlign: "right" },
                    ]}
                  >
                    Artworks
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("EventArtWorks", {
                        Id: this.state.eventDetails.eventId,
                      })
                    }
                    style={styles.moreBox}
                  >
                    <Text style={styles.moreText}>See more</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={this.state.eventDetails.eventArtworks}
                  renderItem={this.renderArtwork}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={true}
                  style={{ marginTop: 15, marginLeft: 5 }}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
            {this.state.eventDetails.eventArtists != "" && (
              <View style={styles.videosContainer}>
                <View
                  style={[
                    styles.moreContainer,
                    this.props.lang == "ar" && { flexDirection: "row-reverse" },
                  ]}
                >
                  <Text
                    style={[
                      styles.imageTitle,
                      this.props.lang == "ar" && { textAlign: "right" },
                    ]}
                  >
                    Artists
                  </Text>
                  <TouchableOpacity
                    style={styles.moreBox}
                    onPress={() =>
                      this.props.navigation.navigate("EventArtist", {
                        Id: this.state.eventDetails.eventId,
                      })
                    }
                  >
                    <Text style={styles.moreText}>See more</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={this.state.eventDetails.eventArtists}
                  renderItem={this.renderArtist}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={true}
                  style={{ marginTop: 15, marginLeft: 5 }}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
            {this.state.eventDetails.isHHCollectionAvailable == 1 && (
              <View style={styles.videosContainer}>
                <View
                  style={[
                    styles.moreContainer,
                    this.props.lang == "ar" && { flexDirection: "row-reverse" },
                  ]}
                >
                  <Text
                    style={[
                      styles.imageTitle,
                      this.props.lang == "ar" && { textAlign: "right" },
                    ]}
                  >
                    HH's collection
                  </Text>
                  <TouchableOpacity
                    style={styles.moreBox}
                    onPress={() =>
                      this.props.navigation.navigate("HhCollection", {
                        hhwork: this.state.hhCollection,
                      })
                    }
                  >
                    <Text style={styles.moreText}>See more</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={this.state.hhCollection.slice(0, 4)}
                  renderItem={this.renderhhCollection}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={true}
                  style={{ marginTop: 15, marginLeft: 5 }}
                  showsHorizontalScrollIndicator={false}
                  onEndReached={this.onEnd()}
                />
              </View>
            )}
            {this.state.eventDetails.eventPhotos != "" && (
              <View style={styles.videosContainer}>
                <View
                  style={[
                    styles.moreContainer,
                    this.props.lang == "ar" && { flexDirection: "row-reverse" },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.imageTitle,
                      this.props.lang == "ar" && { textAlign: "right" },
                    ]}
                  >
                    {events.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("EventPictures", {
                        event: this.state.eventDetails,
                      })
                    }
                    style={styles.moreBox}
                  >
                    <Text style={styles.moreText}>See more</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={this.state.eventDetails.eventPhotos}
                  renderItem={this.renderImage}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={true}
                  style={{ marginTop: 15, marginLeft: 5 }}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
            {this.state.eventDetails && this.state.eventDetails.videoURL != "" && (
              <View>
                <View
                  style={[
                    styles.moreContainerVideo,
                    this.props.lang == "ar" && { flexDirection: "row-reverse" },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.imageTitle,
                      this.props.lang == "ar" && { textAlign: "right" },
                    ]}
                  >
                    {events.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("EventVideos", {
                        event: this.state.eventDetails,
                      })
                    }
                    style={styles.moreBox}
                  >
                    <Text style={styles.moreText}>See more</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.videoContainer}>
                  {this.state.playing && this.state.videoLink != "" ? (
                    <View>{this.renderOptions()}</View>
                  ) : (
                    <TouchableOpacity
                      style={styles.videoContainerMain}
                      onPress={() => this.setState({ playing: true })}
                    >
                      <View style={styles.imageVideoBG}>
                        <Image
                          style={styles.imageVideoImage}
                          source={{ uri: this.state.eventDetails.eventCover }}
                        />
                      </View>
                      <FontAwesome5
                        style={styles.videoIcon}
                        name="play"
                        size={40}
                        color={PRIMARY_COLOR}
                      />
                    </TouchableOpacity>
                  )}
                  <View style={styles.videoTitleContainer}>
                    <Text numberOfLines={1} style={styles.videoTitle}>
                      {this.state.eventDetails.title}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <Modal
              isVisible={this.state.isVisible}
              hideModalContentWhileAnimating={true}
              animationIn="zoomIn"
              animationOut="zoomOut"
              hasBackdrop={true}
              backdropColor="black"
              backdropOpacity={0.9}
              onBackButtonPress={() => this.setState({ isVisible: false })}
              onBackdropPress={() => this.setState({ isVisible: false })}
              style={{
                marginTop: 10,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0,
              }}
            >
              <VideoPlayer
                source={{ uri: this.state.videoLinks }}
                navigator={this.props.navigator}
                onBack={() => this.setState({ isVisible: false })}
              />
            </Modal>
            {/* buy modal */}
            <Modal
              isVisible={this.props.navigation.getParam("buyModel", false)}
              // isVisible={true}
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
                    source={{ uri: events.eventCover }}
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
                      {events.title}
                    </Text>
                    {/* <Text style={{ fontSize: 13, fontFamily: FONT_MULI_REGULAR, lineHeight: 20 }}>Quantity  : 1</Text>
                                            <Text style={{ fontSize: 13, fontFamily: FONT_MULI_REGULAR, lineHeight: 20 }}>Shipping cost  : {this.state.buyDetails.shippingCost}</Text>
                                            <Text style={{ fontSize: 13, fontFamily: FONT_MULI_REGULAR }}>Tax  : {this.state.buyDetails.tax}</Text> */}

                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: FONT_MULI_BOLD,
                        color: PRIMARY_COLOR,
                      }}
                    >
                      <Text style={{ fontSize: 13, color: "#000" }}>
                        Amount Payable{" "}
                      </Text>
                      : {this.props.navigation.getParam("priceAED", "")} AED
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: FONT_MULI_BOLD,
                        color: PRIMARY_COLOR,
                        marginLeft: 102,
                      }}
                    >
                      : {this.props.navigation.getParam("priceUSD", "")} USD
                    </Text>
                  </View>
                </View>
                {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 5, marginRight: 10 }}>
                                        <Text style={[styles.categoryText, { fontFamily: FONT_MULI_BOLD }]}>Address  </Text>
                                        {!this.state.changeLoader ?
                                            <TouchableOpacity onPress={() => this.setState({ buyModel: false, changeLoader: true }, this.changeModel())} style={styles.changeButton}>
                                                <Text style={{ color: '#2e77ff' }}>Change</Text>
                                            </TouchableOpacity>
                                            :
                                            <View style={styles.changeButton}>
                                                <ActivityIndicator size="small" color={COLOR_SECONDARY} />
                                            </View>
                                        }
                                    </View> */}
                {/* <View style={styles.addAddress2}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={[styles.categoryText, { lineHeight: null }]}>{this.state.itemAddress && this.state.itemAddress.shippingAddress1}  </Text>
                                            <View style={{ width: 1, height: 12, backgroundColor: SECONDARY_COLOR, opacity: .5 }}></View>
                                            <Text style={[styles.categoryText, { lineHeight: null }]}>  {this.state.itemAddress && this.state.itemAddress.shippingAddress2}</Text>
                                        </View>
                                        <Text style={styles.categoryText}><Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>Email:</Text> {this.state.itemAddress && this.state.itemAddress.email}</Text>
                                        <Text style={styles.categoryText}><Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>Mobile:</Text> {this.state.itemAddress && this.state.itemAddress.mobile}</Text>
                                        <Text style={styles.categoryText}><Text style={{ color: SECONDARY_COLOR, fontSize: 14 }}>Telephone:</Text> {this.state.itemAddress && this.state.itemAddress.telephone}</Text>
                                    </View> */}
                <View style={[styles.nextButton, { marginBottom: 10 }]}>
                  <TouchableOpacity
                    // onPress={() => this.setState({ buyModel: false })}
                    onPress={() =>
                      this.props.navigation.setParams({ buyModel: false })
                    }
                    style={styles.nextbuttonbox}
                  >
                    <Text style={styles.addAddressTitle}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState(
                        { confirmLoader: true },
                        this.confirmOrder()
                      )
                    }
                    style={[styles.nextbuttonbox, { width: 180 }]}
                  >
                    <Text style={styles.addAddressTitle}>CONFIRM ORDER</Text>
                    {!this.state.confirmLoader ? (
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
            {/* adress modal */}
            <Modal
              isVisible={this.state.addressModel}
              hasBackdrop={true}
              backdropOpacity={0.5}
              onBackButtonPress={() => this.setState({ addressModel: false })}
              onBackdropPress={() => this.setState({ addressModel: false })}
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
                  {this.state.shippingInfo != "" ? (
                    <FlatList
                      data={this.state.shippingInfo}
                      renderItem={this.renderAddress}
                      keyExtractor={(item, index) => index.toString()}
                      ListHeaderComponent={this.renderFirst}
                      style={{ maxHeight: height / 1.8 }}
                      // ListFooterComponent={this.footerView}
                      onEndReached={this.shippingInfoLoad}
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
                  onPress={() =>
                    this.setState({ addressModel: false }, this.addadrsOpen())
                  }
                  style={styles.addAddress}
                >
                  <AntDesign
                    name="pluscircleo"
                    size={17}
                    color={PRIMARY_COLOR}
                  />
                  <Text style={styles.addAddressTitle1}> Add new address</Text>
                </TouchableOpacity>
                <View
                  style={[
                    styles.nextButton,
                    { marginRight: 5, marginBottom: 10 },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => this.setState({ addressModel: false })}
                    style={styles.nextbuttonbox}
                  >
                    <Text style={styles.addAddressTitle}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={this.state.shippingInfo == "" ? true : false}
                    onPress={() =>
                      this.setState({ addressModel: false }, this.buyNow())
                    }
                    style={[
                      this.state.shippingInfo != ""
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
            {/* confim order */}
            <Modal
              isVisible={this.state.payModel}
              backdropOpacity={0.5}
              // onBackButtonPress={() => this.setState({ isVisible: false })}
              // onBackdropPress={() => this.setState({ isVisible: false })}
              useNativeDriver={true}
              hideModalContentWhileAnimating={true}
              backdropTransitionOutTiming={0}
              animationInTiming={100}
              animationOutTiming={100}
              style={{
                height: height,
                width: width,
                margin: 0,
                backgroundColor: "white",
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
                  console.log("event url", event.url);
                  if (
                    event.url.slice(0, 37) ===
                    "https://www.khawlafoundation.com/home"
                  ) {
                    // Linking.openURL(event.url)
                    if (event.url.includes("transactionStatus=0")) {
                      this.setState({ payModel: false });
                      setTimeout(() => {
                        this.setState({
                          faildModel: true,
                        });
                        this.animation.play();
                      }, 500);
                      setTimeout(() => {
                        this.setState({
                          faildModel: false,
                        });
                      }, 2500);
                      this.orderInfo();
                    } else if (event.url.includes("transactionStatus=1")) {
                      this.setState({ payModel: false });
                      setTimeout(() => {
                        this.setState({
                          successModel: true,
                        });
                        this.animation.play();
                      }, 500);
                      setTimeout(() => {
                        this.setState({
                          successModel: false,
                        });
                      }, 2000);
                      this.orderInfo();
                    } else if (event.url.includes("transactionStatus=-1")) {
                      this.setState({ payModel: false });
                      setTimeout(() => {
                        this.setState({
                          declineModel: true,
                        });
                      }, 500);
                      setTimeout(() => {
                        this.setState({
                          declineModel: false,
                        });
                      }, 2000);
                      this.orderInfo();
                    }
                    return false;
                  }
                  return true;
                }}
                // source={{uri: this.state.orderData.PaymentPortal,   body: JSON.stringify({name: 'TransactionID',value:this.state.orderData.TransactionID }) ,method:'POST'}}
                source={{
                  html: `<html><body onload="document.forms[0].submit();">
                                                <form action=${
                                                  this.state.orderData
                                                    ?.PaymentPortal
                                                } method="post">
                                                <input type='Hidden' name='TransactionID' value="${
                                                  this.state.orderData
                                                    ?.TransactionID
                                                }"/>
                                                <input type="submit" value="Submit" style="opacity:0"></form></html>`,
                }}
              />
            </Modal>
            {/* success modal */}
            <Modal
              isVisible={this.state.successModel}
              hideModalContentWhileAnimating={true}
              animationIn="zoomIn"
              animationOut="slideOutRight"
              animationInTiming={800}
              animationOutTiming={500}
              style={styles.modal}
            >
              {!this.state.cartLoading && (
                <View style={styles.fullModel}>
                  <Animation
                    ref={(animation) => {
                      this.animation = animation;
                    }}
                    style={{
                      width: 80,
                      height: 80,
                    }}
                    loop={true}
                    source={anim}
                  />
                  <Text style={styles.modalTextSuccess}>Payment success</Text>
                </View>
              )}
              {this.state.cartLoading && (
                <View style={styles.containerModal}>
                  <ActivityIndicator size="small" color={PRIMARY_COLOR} />
                </View>
              )}
            </Modal>
            {/* failed modal */}
            <Modal
              isVisible={this.state.declineModel}
              hideModalContentWhileAnimating={true}
              animationIn="zoomIn"
              animationOut="slideOutRight"
              animationInTiming={800}
              animationOutTiming={500}
              style={styles.modal}
            >
              {!this.state.cartLoading && (
                <View style={styles.fullModel}>
                  <IconMaterial name="error-outline" size={80} color="red" />
                  <Text style={styles.modalTextFaild}>Payment Declined!</Text>
                </View>
              )}
              {this.state.cartLoading && (
                <View style={styles.containerModal}>
                  <ActivityIndicator size="small" color={PRIMARY_COLOR} />
                </View>
              )}
            </Modal>
            <Modal
              isVisible={this.state.faildModel}
              hideModalContentWhileAnimating={true}
              animationIn="zoomIn"
              animationOut="slideOutRight"
              animationInTiming={800}
              animationOutTiming={500}
              style={styles.modal}
            >
              {!this.state.cartLoading && (
                <View style={styles.fullModel}>
                  <Animation
                    ref={(animation) => {
                      this.animation = animation;
                    }}
                    style={{
                      width: 80,
                      height: 80,
                    }}
                    loop={true}
                    source={cancel}
                  />
                  <Text style={styles.modalTextSuccess}>Payment canceled</Text>
                </View>
              )}
              {this.state.cartLoading && (
                <View style={styles.containerModal}>
                  <ActivityIndicator size="small" color={PRIMARY_COLOR} />
                </View>
              )}
            </Modal>
            <Modal
              isVisible={this.state.isVisibleImage}
              hideModalContentWhileAnimating={true}
              animationIn="zoomIn"
              animationOut="zoomOut"
              hasBackdrop={true}
              backdropColor="black"
              backdropOpacity={0.9}
              onBackButtonPress={() => this.setState({ isVisibleImage: false })}
              onBackdropPress={() => this.setState({ isVisibleImage: false })}
              style={{}}
            >
              <View style={styles.imageFull}>
                <Image
                  source={{ uri: events.eventCover }}
                  resizeMode="contain"
                  style={styles.imageFull}
                />
              </View>
              <TouchableOpacity
                onPress={() => this.setState({ isVisibleImage: false })}
                style={{ marginTop: -10 }}
              >
                <AntDesign
                  name="closecircleo"
                  size={20}
                  color="#fff"
                  style={{ alignSelf: "center" }}
                />
              </TouchableOpacity>
            </Modal>
            <Modal
              isVisible={this.state.isVisiblePic}
              hideModalContentWhileAnimating={true}
              animationIn="zoomIn"
              animationOut="zoomOut"
              hasBackdrop={true}
              backdropColor="black"
              backdropOpacity={0.9}
              onBackButtonPress={() => this.setState({ isVisiblePic: false })}
              onBackdropPress={() => this.setState({ isVisiblePic: false })}
              style={{}}
            >
              <View style={styles.imageFull}>
                <Image
                  source={{ uri: this.state.image }}
                  resizeMode="contain"
                  style={styles.imageFull}
                />
              </View>
              <TouchableOpacity
                onPress={() => this.setState({ isVisiblePic: false })}
                style={{ marginTop: -10 }}
              >
                <AntDesign
                  name="closecircleo"
                  size={20}
                  color="#fff"
                  style={{ alignSelf: "center" }}
                />
              </TouchableOpacity>
            </Modal>
            {/* add adress */}
            <Modal
              isVisible={this.state.addAddrsModal}
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
                      formatText={this.formatText}
                      onSubmitEditing={this.onSubmit}
                      tintColor={PRIMARY_COLOR}
                      containerStyle={styles.textInput}
                      onChangeText={(text) => this.setState({ address1: text })}
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
                      formatText={this.formatText}
                      onSubmitEditing={this.onSubmit}
                      tintColor={PRIMARY_COLOR}
                      containerStyle={styles.textInput}
                      onChangeText={(text) => this.setState({ address2: text })}
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
                      formatText={this.formatText}
                      onSubmitEditing={this.onSubmit}
                      tintColor={PRIMARY_COLOR}
                      containerStyle={styles.textInput}
                      onChangeText={(text) => this.setState({ country: text })}
                      secureTextEntry={this.state.showpswrd}
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
                      formatText={this.formatText}
                      onSubmitEditing={this.onSubmit}
                      tintColor={PRIMARY_COLOR}
                      containerStyle={styles.textInput}
                      onChangeText={(text) =>
                        this.validate(
                          text,
                          "email",
                          this.setState({ error: null })
                        )
                      }
                      secureTextEntry={this.state.showpswrd}
                      lineWidth={1}
                    />
                  </View>
                  {!this.state.emailValidate && (
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
                      formatText={this.formatText}
                      onSubmitEditing={this.onSubmit}
                      tintColor={PRIMARY_COLOR}
                      containerStyle={styles.textInput}
                      onChangeText={(text) => this.setState({ phone: text })}
                      lineWidth={1}
                      ref={(phone) => {
                        this.textInput = phone;
                      }}
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
                      formatText={this.formatText}
                      onSubmitEditing={this.onSubmit}
                      tintColor={PRIMARY_COLOR}
                      containerStyle={styles.textInput}
                      onChangeText={(text) => this.setState({ mobile: text })}
                      lineWidth={1}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 10,
                      marginLeft: 30,
                    }}
                  >
                    <CheckBox
                      style={{ marginLeft: 10 }}
                      onClick={() => {
                        this.setState({
                          isChecked: !this.state.isChecked,
                        });
                      }}
                      isChecked={this.state.isChecked}
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
                  {this.state.validate && (
                    <Text style={styles.validationText}>
                      {this.state.validate}
                    </Text>
                  )}
                  <View style={[styles.nextButton, { marginRight: 35 }]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState(
                          { addAddrsModal: false },
                          this.addadrsClose
                        )
                      }
                      style={styles.nextbuttonbox}
                    >
                      <Text style={styles.addAddressTitle}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.onSave()}
                      style={styles.nextbuttonbox}
                    >
                      <Text style={styles.addAddressTitle}>SAVE</Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </Modal>
            <Modal
              isVisible={this.state.isVisibleLoginCheck}
              hideModalContentWhileAnimating={true}
              animationIn="zoomIn"
              animationOut="zoomOut"
              useNativeDriver={true}
              hideModalContentWhileAnimating={true}
              animationOutTiming={300}
              onBackButtonPress={() =>
                this.setState({ isVisibleLoginCheck: false })
              }
              onBackdropPress={() =>
                this.setState({ isVisibleLoginCheck: false })
              }
              style={styles.modal}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalText}>
                    You need to login to view this content. Please Login. Not a
                    Member? Join Us.
                  </Text>
                </View>
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.buttonCancel}
                    onPress={() =>
                      this.setState({ isVisibleLoginCheck: false })
                    }
                  >
                    <Text style={styles.cancel}>{i18n.t("CANCEL")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({ isVisibleLoginCheck: false }, () =>
                        this.props.navigation.navigate("Login")
                      )
                    }
                    style={styles.button}
                  >
                    <Text style={styles.subscribe}>{i18n.t("LOGIN")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        )}
        {eventDate >= today &&
          (this.props.user ? (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("RegisterEvent", {
                  item: events,
                })
              }
            >
              <LinearGradient
                colors={["#b34f77", "#b3406e", "#b3406e"]}
                style={styles.register}
              >
                <Text style={styles.registerText}>{i18n.t("Register")}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.setState({ isVisibleLoginCheck: true })}
            >
              <LinearGradient
                colors={["#b34f77", "#b3406e", "#b3406e"]}
                style={styles.register}
              >
                <Text style={styles.registerText}>{i18n.t("Register")}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => ({
  lang: state.programmes.lang,
  user: state.userLogin.user,
});
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    textAlign: "justify",
    paddingLeft: 10,
    fontFamily: FONT_LIGHT,
    paddingRight: 10,
  },
  eventDate: {
    fontSize: 14,
    textAlign: "left",
    paddingRight: 7,
    paddingLeft: 7,
    fontFamily: FONT_LIGHT,
    color: COLOR_SECONDARY,
  },
  imageContainer: {
    backgroundColor: "#fff",
  },
  titleEvent: {
    fontSize: 20,
    textAlign: "left",
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: FONT_MULI_BOLD,
  },
  imageTitle: {
    fontSize: 15,
    textAlign: "left",
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: FONT_MULI_BOLD,
    width: width - 90,
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  iconContainer2: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    elevation: 5,
  },
  videoImage: {
    margin: 5,
    height: 95,
    width: 95,
    justifyContent: "center",
    borderRadius: 10,
  },
  imageList: {
    margin: 5,
    height: 95,
    width: 95,
    justifyContent: "center",
    borderRadius: 10,
  },
  titleArtist: {
    fontSize: 14,
    textAlign: "left",
    paddingRight: 3,
    paddingLeft: 10,
    color: "#ad6183",
    fontFamily: FONT_MULI_BOLD,
  },
  imageStyle: {
    height: 220,
    width: width * 0.9,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  videosContainer: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: 30,
  },
  register: {
    width: "80%",
    height: 40,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "center",
    margin: 5,
  },
  register1: {
    width: "60%",
    height: 40,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "center",
    margin: 5,
  },
  mainTitleText: {
    color: "#000",
    fontSize: 19,
    alignSelf: "center",
    fontFamily: FONT_MULI_BOLD,
  },
  descriptionView: {
    marginTop: 25,
    margin: 10,
  },
  imageItem: {
    height: 95,
    width: 95,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  artistimageItem: {
    height: 95,
    width: 95,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  imageItem1: {
    height: 95,
    width: 200,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  imageFull: {
    height: 500,
    width: width * 0.97,
    alignSelf: "center",
    borderRadius: 4,
  },
  registerText: {
    color: "#fff",
    fontFamily: FONT_MULI_BOLD,
    fontSize: 15,
  },
  icon: {
    marginLeft: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  videoContainer: {
    height: 265,
    borderRadius: 20,
    marginHorizontal: 13,
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.5,
    marginBottom: 5,
    backgroundColor: "#fff",
    elevation: 3,
    marginTop: 20,
  },
  videoContainerMain: {
    position: "absolute",
    marginTop: 25,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: "100%",
  },
  imageVideoBG: {
    backgroundColor: "#000",
    height: 210,
    width: "95%",
    alignSelf: "center",
    borderRadius: 20,
    justifyContent: "center",
  },
  imageVideoImage: {
    height: 210,
    width: "100%",
    alignSelf: "center",
    borderRadius: 20,
    opacity: 0.7,
  },
  videoTitleContainer: {
    height: 40,
    justifyContent: "center",
    bottom: 0,
    position: "absolute",
    width: "100%",
  },
  videoTitle: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: FONT_MULI_BOLD,
  },
  videoIcon: {
    position: "absolute",
  },
  backgroundVideo: {
    height: 200,
    borderRadius: 20,
    marginTop: 25,
    width: "95%",
    alignSelf: "center",
  },
  WebView: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#fff",
  },
  moreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  moreContainerVideo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 80,
  },
  moreBox: {
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: PRIMARY_COLOR,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 23,
  },
  moreText: {
    fontSize: 12,
    fontFamily: FONT_MULI_BOLD,
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
  addressTitle: {
    fontFamily: FONT_MULI_BOLD,
    fontSize: 14,
    color: "#fff",
    marginLeft: 10,
  },
  categoryText: {
    fontFamily: FONT_MULI_REGULAR,
    fontSize: 15,
    lineHeight: 20,
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
  addAddressTitle: {
    fontFamily: FONT_MULI_REGULAR,
    fontSize: 15,
    color: "#fff",
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
  addAddressTitle1: {
    fontFamily: FONT_MULI_REGULAR,
    fontSize: 14,
    marginLeft: 10,
    color: SECONDARY_COLOR,
  },
  fullModel: {
    height: height,
    width: width,
    margin: 0,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
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
  categoryList: {
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    width: "80%",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  modalText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: FONT_PRIMARY,
    color: "black",
    opacity: 0.9,
  },
  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  buttonCancel: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#DDDDDD",
  },
  button: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },
  cancel: {
    paddingRight: 25,
    fontSize: 18,
    color: PRIMARY_COLOR,
    fontFamily: FONT_PRIMARY,
  },
});
export default connect(mapStateToProps)(App);
