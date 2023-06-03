import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import { PRIMARY_COLOR } from "../../../assets/color";
import {
  FONT_PRIMARY,
  FONT_LIGHT,
  FONT_MULI_BOLD,
  FONT_BOLD,
  FONT_MULI_REGULAR,
} from "../../../assets/fonts";
import AntDesign from "react-native-vector-icons/AntDesign";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import { ARTISTS_TREE, AUDIO_GALLERY } from "../../../common/endpoints";
import Api from "../../../common/api";
import i18n from "../../../i18n";
import Modal from "react-native-modal";
import VideoPlayer from "react-native-video-controls";
import { WebView } from "react-native-webview";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Video from "react-native-video";

const { height, width } = Dimensions.get("screen");
var videoLink = "";

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
      isLoading: true,
      loading: true,
      videoLink: [],
      playing: false,
      artistDetail: "",
      event: this.props.navigation.getParam("event", null),
      item: "",
      videoUrl: this.props.navigation.getParam("video", null),
    };
    this.vimeoPlay = this.vimeoPlay.bind(this);
  }
  componentDidMount() {
    this.vimeoPlay();
  }

  _onLoadEnd = () => {
    this.setState({
      loading: false,
    });
  };

  vimeoPlay() {
    console.log("viddddd", this.state.videoUrl);
    if (this.state.videoUrl && this.state.videoUrl?.video?.includes("vimeo")) {
      if (this.state.videoUrl?.video) {
        var url = this.state.videoUrl?.video;
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
            videoName: this.state.collectionDetail.videoTitle1,
          });
        }
      }
    }
  }

  renderOptions = () => {
    if (this.state.videoLink && this.state.videoLink.length > 0) {
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

  render() {
    const event = this.state.event;
    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView style={{ flex: 1 }}>
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
                    source={{ uri: event.eventCover }}
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
                {event.title}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => ({
  lang: state.programmes.lang,
});
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 17,
    textAlign: "right",
    paddingLeft: 10,
    fontFamily: FONT_LIGHT,
    paddingRight: 10,
    marginTop: 20,
  },
  title2: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    paddingRight: 10,
    marginTop: 5,
  },
  imageContainer: {},
  image: {
    height: 220,
    width: width * 0.9,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  aboutText: {
    textAlign: "right",
    marginRight: 10,
    fontSize: 17,
    fontFamily: FONT_MULI_BOLD,
    marginTop: 30,
    paddingLeft: 10,
  },
  imageEvent: {
    height: 260,
    width: "100%",
  },
  related: {
    height: 270,
    width: 300,
    alignSelf: "center",
    padding: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
    marginBottom: 40,
  },
  titleEvent: {
    fontSize: 20,
    textAlign: "right",
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: FONT_MULI_BOLD,
  },
  imageVideo: {
    height: 90,
    width: 90,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 10,
  },
  imageBackground: {
    height: 90,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  iconContainer2: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 0.5,
    elevation: 5,
  },
  WebView: {
    height: 250,
    marginTop: 20,
    backgroundColor: "#000",
    borderWidth: 1,
    margin: 5,
    marginBottom: 15,
  },
  mainTitleText: {
    color: "#000",
    fontSize: 19,
    alignSelf: "center",
    fontFamily: FONT_MULI_BOLD,
  },
  imageFull: {
    height: 500,
    width: width * 0.97,
    alignSelf: "center",
    borderRadius: 4,
  },
  videoContainer: {
    height: 265,
    borderRadius: 20,
    marginHorizontal: 13,
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.5,
    marginBottom: 15,
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
  masters: {
    marginTop: 30,
  },
  mastersText: {
    fontSize: 18,
    fontFamily: FONT_BOLD,
    padding: 10,
    alignSelf: "center",
  },
  mastersItem: {
    width: 100,
    borderRadius: 15,
    margin: 10,
    marginTop: 5,
  },
  mastersImage: {
    height: 100,
    width: 100,
    borderRadius: 75,
  },
  certificateImage: {
    height: 100,
    width: 100,
    borderRadius: 5,
  },
  certificate: {
    width: 100,
    borderRadius: 5,
    margin: 10,
    marginTop: 5,
  },
  masterNameText: {
    alignSelf: "center",
    textAlign: "center",
    padding: 5,
    fontSize: 12,
    fontFamily: FONT_MULI_REGULAR,
  },
});
export default connect(mapStateToProps)(App);
