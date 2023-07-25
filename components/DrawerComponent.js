import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Linking,
} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import { connect } from "react-redux";
import { SafeAreaView } from "react-navigation";
import { SECONDARY_COLOR, PRIMARY_COLOR } from "../assets/color";
import {
  FONT_PRIMARY,
  FONT_MEDIUM,
  FONT_MULI_BOLD,
  FONT_MULI_EXTRABOLD,
  FONT_MULI_REGULAR,
} from "../assets/fonts";
import Images from "../assets/images";
import i18n from "../i18n";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { SEQUENCE } from "../common/endpoints";
import Api from "../common/api";

const { height, width } = Dimensions.get("screen");

class DrawerMenu extends Component {
  navigateToScreen = (route) => () => {
    console.log("route", this.props.navigation.state.index);
    // if (this.props.navigation.state.index == 0) {
    //   this.props.navigation.dispatch(
    //     StackActions.reset({
    //       index: 0,
    //       actions: [NavigationActions.navigate({ routeName: "Home" })],
    //       key: "Home",
    //     })
    //   );
    //   this.props.navigation.navigate("Home");
    // }
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };

  componentDidMount() {
    const language = this.props.lang == "ar" ? 1 : 2;
    Api("get", SEQUENCE + `?language=${language}`).then((responseJson) => {
      const filter = responseJson.sort((a, b) =>
        a.sequence > b.sequence ? 1 : -1
      );
      if (responseJson) {
        this.setState({
          sequence: filter.filter(
            (responseJson) => responseJson.mobilePublished == true
          ),
        });
        console.log(
          "seqnceeee,drawer.,.,.,.,.,.,.,.",
          filter.filter((responseJson) => responseJson.mobilePublished == true)
        );
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user != this.props.user) {
      this.setState({ user: this.props.user });
      this.setState({
        cache: Math.random()
          .toString(36)
          .substring(7),
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      cache: Math.random()
        .toString(36)
        .substring(7),
      sequence: [],
    };
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SafeAreaView style={styles.container}>
            <View style={styles.coverContainer}>
              <TouchableOpacity
                style={styles.imageCover}
                onPress={() => this.props.navigation.navigate("Settings")}
              >
                <Image
                  source={
                    this.props.user && this.props.user.profile_pic
                      ? {
                        uri: `${this.props.user.profile_pic}&random=${this.state.cache
                          }`,
                      }
                      : Images.default
                  }
                  style={styles.imagePro}
                />
              </TouchableOpacity>
              {this.props.user && (
                <TouchableOpacity
                  style={styles.userData}
                  onPress={() => this.props.navigation.navigate("Settings")}
                >
                  <Text style={styles.fullname}>
                    {this.props.user && this.props.user.username
                      ? this.props.user.username
                      : "Guest User"}
                  </Text>
                  <Text style={styles.myProfileText}>My Profile</Text>
                  {/* <Text numberOfLines={1} style={styles.email}>{this.props.user.email}</Text> */}
                </TouchableOpacity>
              )}
              {!this.state.user && (
                <View style={styles.userDataLogin}>
                  <Text style={styles.fullname}>
                    {this.props.user && this.props.user.fullname
                      ? this.props.user.fullname
                      : "Guest User"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("Login")}
                    style={styles.loginBox}
                  >
                    <Text style={styles.loginText}>Login</Text>
                    <AntDesign name="login" size={12} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.contentContainer}>
              <View style={[styles.card, { paddingTop: 8 }]}>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 0
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("Home")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 0
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Home")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 1
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("AboutUs")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 1
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("About_us")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 2
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("Programmes")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 2
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Programmes")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 3
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("EventCategory")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 3
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Events")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 4
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("ArtGallery")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 4
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Art_gallery")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 5
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("Library")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 5
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Library")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 6
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("Media")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 6
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Media_Center")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 7
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("Article")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 7
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Article")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 8
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("Artists")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 8
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Artists")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 9
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("CertifiedCalligraphers")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 9
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Calligraphers")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 10
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("ArtistsWorld")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 10
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("artists_World")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 11
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("Collection")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 11
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Collection")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 12
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("AudioGallery")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 12
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Audio_Gallery")}
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={this.props.navigation.state.index == 11 ? styles.contentActive : styles.content} onPress={this.navigateToScreen('News')}>
                                    <Text style={this.props.navigation.state.index == 11 ? styles.labelStyle : styles.inactiveLabelStyle}>{i18n.t("Latest_updates")}</Text>
                                </TouchableOpacity> */}
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 13
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("LatestFeeds")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 13
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Latest_Feeds")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 14
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("Courses")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 14
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Distance_Learning")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 15
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("KidsCorner")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 15
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Little_Artist")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 16
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("Collabration")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 16
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Collabration")}
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={this.props.navigation.state.index == 17 ? styles.contentActive : styles.content} onPress={this.navigateToScreen('ArtWorkForm')}>
                                    <Text style={this.props.navigation.state.index == 17 ? styles.labelStyle : styles.inactiveLabelStyle}>ARTWORK REQUEST FORM</Text>
                                </TouchableOpacity> */}
                {this.state.sequence.every(
                  (item) => item.moduleName == "Auction"
                ) && (
                    <TouchableOpacity
                      style={
                        this.props.navigation.state.index == 17
                          ? styles.contentActive
                          : styles.content
                      }
                      onPress={this.navigateToScreen("AuctionArt")}
                    >
                      <Text
                        style={
                          this.props.navigation.state.index == 17
                            ? styles.labelStyle
                            : styles.inactiveLabelStyle
                        }
                      >
                        Auction
                      </Text>
                    </TouchableOpacity>
                  )}
                {this.state.sequence.every(
                  (item) => item.moduleName == "AlKhattFestival"
                ) && (
                    <TouchableOpacity
                      style={
                        this.props.navigation.state.index == 18
                          ? styles.contentActive
                          : styles.content
                      }
                      onPress={this.navigateToScreen("Festival")}
                    >
                      <Text
                        style={
                          this.props.navigation.state.index == 18
                            ? styles.labelStyle
                            : styles.inactiveLabelStyle
                        }
                      >
                        Al khatt festival
                      </Text>
                    </TouchableOpacity>
                  )}
                {this.state.sequence.every(
                  (item) => item.moduleName == "Online Shopping"
                ) && (
                    <TouchableOpacity
                      style={
                        this.props.navigation.state.index == 19
                          ? styles.contentActive
                          : styles.content
                      }
                      onPress={this.navigateToScreen("OnlineShopping")}
                    >
                      <Text
                        style={
                          this.props.navigation.state.index == 19
                            ? styles.labelStyle
                            : styles.inactiveLabelStyle
                        }
                      >
                        {i18n.t("online_store")}
                      </Text>
                    </TouchableOpacity>
                  )}
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 20
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("ContactUs")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 20
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("Contact_Us")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 22
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("kac")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 22
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("KAC_in_Meta_Verse")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    this.props.navigation.state.index == 21
                      ? styles.contentActive
                      : styles.content
                  }
                  onPress={this.navigateToScreen("RegisterVisitor")}
                >
                  <Text
                    style={
                      this.props.navigation.state.index == 21
                        ? styles.labelStyle
                        : styles.inactiveLabelStyle
                    }
                  >
                    {i18n.t("register_visitor")}
                  </Text>
                </TouchableOpacity>
                <View style={styles.policyView}>
                  <TouchableOpacity
                    style={[styles.content2, { marginTop: 0 }]}
                    onPress={this.navigateToScreen("PrivacyPolicy")}
                  >
                    <Text style={styles.inactiveLabelStyle2}>
                      Privacy Policy
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.content2}
                    onPress={this.navigateToScreen("CookiePolicy")}
                  >
                    <Text style={styles.inactiveLabelStyle2}>
                      Cookie Policy
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.content2}
                    onPress={this.navigateToScreen("TermsCondition")}
                  >
                    <Text style={styles.inactiveLabelStyle2}>
                      Terms and Conditions
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              <Image
                source={Images.logoLetterNew}
                style={styles.imageContainer}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("https://in.pinterest.com/khawlaacf/");
                }}
              >
                <Entypo
                  name="pinterest-with-circle"
                  size={30}
                  color={PRIMARY_COLOR}
                  style={{}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    "https://www.instagram.com/khawlaartandculture/"
                  );
                }}
              >
                <Entypo
                  name="instagram-with-circle"
                  size={30}
                  color={PRIMARY_COLOR}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("https://www.youtube.com/khawlafoundation");
                }}
              >
                <Entypo
                  name="youtube-with-circle"
                  size={30}
                  color={PRIMARY_COLOR}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("https://twitter.com/KhawlaAcf");
                }}
              >
                <Entypo
                  name="twitter-with-circle"
                  size={30}
                  color={PRIMARY_COLOR}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    "https://www.facebook.com/KhawlaArtAndCulture/"
                  );
                }}
              >
                <Entypo
                  name="facebook-with-circle"
                  size={30}
                  color={PRIMARY_COLOR}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    "https://www.linkedin.com/company/khawlaartandculture/"
                  );
                }}
              >
                <Entypo
                  name="linkedin-with-circle"
                  size={30}
                  color={PRIMARY_COLOR}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("https://linktr.ee/khawlaartandculture");
                }}
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  height: 29,
                  width: 29,
                  borderRadius: 29,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 23,
                  marginBottom: 10,
                }}
              >
                <Image
                  source={Images.linktree}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                  resizeMode={"contain"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL("https://wa.me/+971563847777");
                }}
              >
                <FontAwesome
                  name="whatsapp"
                  size={30}
                  color={PRIMARY_COLOR}
                  style={{ marginLeft: 15, marginBottom: 10 }}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userLogin.user,
    lang: state.programmes.lang,
  };
};

export default connect(mapStateToProps)(DrawerMenu);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(255, 250, 245)",
  },
  imgBack: {
    height: height * 0.25,
  },
  contentContainer: {
    flex: 1,
  },
  imageContainer: {
    height: 45.012,
    width: 168.513,
    alignSelf: "center",
    marginBottom: 10,
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: SECONDARY_COLOR,
  },
  name: {
    fontSize: 18,
    fontFamily: FONT_PRIMARY,
    textAlign: "center",
    paddingTop: 10,
    color: "#182D45",
    paddingBottom: 15,
  },
  login: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: PRIMARY_COLOR,
    alignSelf: "center",
  },
  loginText: {
    fontFamily: FONT_MEDIUM,
    fontSize: 12,
    lineHeight: 15,
    marginRight: 5,
  },
  card: {
    padding: 15,
  },
  content: {
    flexDirection: "row",
    height: 50,
    paddingLeft: 15,
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "#EEEEEE",
  },
  content2: {
    flexDirection: "row",
    height: 40,
    paddingLeft: 15,
    alignItems: "center",
  },
  contentActive: {
    flexDirection: "row",
    height: 50,
    paddingLeft: 15,
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 0.5,
    borderColor: "#EEEEEE",
  },
  close: {
    position: "absolute",
    right: 0,
    marginRight: 10,
    marginTop: 5,
  },
  labelStyle: {
    fontSize: 15,
    fontFamily: FONT_MULI_BOLD,
    color: PRIMARY_COLOR,
    marginLeft: 15,
  },
  inactiveLabelStyle: {
    fontSize: 15,
    marginLeft: 15,
    fontFamily: FONT_MULI_REGULAR,
    textAlign: "left",
  },
  inactiveLabelStyle2: {
    fontSize: 15,
    marginLeft: 15,
    // fontFamily: FONT_MULI_REGULAR,
    textAlign: "left",
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  coverContainer: {
    width: "90%",
    alignItems: "center",
    marginTop: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 1.5,
      height: 1.5,
    },
    shadowRadius: 1.5,
    shadowOpacity: 0.15,
    elevation: 1.5,
    marginHorizontal: 10,
    alignSelf: "center",
    paddingVertical: 8,
    flexDirection: "row",
  },
  imageCover: {
    height: 57,
    width: 57,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  imagePro: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  userData: {
    marginLeft: 5,
  },
  userDataLogin: {
    marginLeft: 5,
  },
  email: {
    fontSize: 13,
    fontFamily: FONT_PRIMARY,
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    width: 180,
  },
  mainContainer: {
    width: "100%",
    height: "100%",
  },
  fullname: {
    fontSize: 15,
    fontFamily: FONT_MEDIUM,
    lineHeight: 20,
  },
  myProfileText: {
    fontSize: 12,
    fontFamily: FONT_PRIMARY,
    lineHeight: 20,
  },
  loginBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  policyView: {
    backgroundColor: "#fff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0.5,
      height: 0.5,
    },
    shadowRadius: 0.5,
    shadowOpacity: 0.15,
    elevation: 0.5,
    borderRadius: 10,
    marginTop: 10,
    paddingBottom: 5,
  },
});