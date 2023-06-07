import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLOR_SECONDARY, PRIMARY_COLOR } from "../../../assets/color";
import {
  FONT_PRIMARY,
  FONT_MULI_REGULAR,
  FONT_MULI_BOLD,
} from "../../../assets/fonts";
import Api from "../../../common/api";
import { COLLABRATION } from "../../../common/endpoints";
import i18n from "../../../i18n";

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
          <Text style={styles.mainTitleText}>{i18n.t("Collabration")}</Text>
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
          <AntDesign name="closecircleo" size={20} color={"#000"} style={{}} />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={{ paddingRight: 15, paddingLeft: 15 }}
        >
          <IconMaterial name="sort" size={30} color="black" />
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      article: [],
      isLoading: true,
      articleIntro: "",
      isList: false,
    };
    this.onPress = this.onPress.bind(this);
    this.renderArticle = this.renderArticle.bind(this);
    this.renderArticleGrid = this.renderArticleGrid.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    // console.log('prproop.................',prevProps.lang,'V/S prop lang...............',this.props.lang)
    if (prevProps.lang != this.props.lang) {
      this.getData();
    }
  }

  getData() {
    this.props.navigation.setParams({ onPress: this.onPress });
    var language = this.props.lang == "ar" ? 1 : 2;
    Api("get", COLLABRATION + `?language=${language}`).then((responseJson) => {
      if (responseJson) {
        console.log("collabraion", responseJson);
        this.setState({
          article: responseJson.items,
          isLoading: false,
        });
      } else {
        this.setState({
          isLoading: false,
        });
      }
    });
  }

  onPress() {
    this.props.navigation.navigate("Home");
  }

  renderArticle({ item }) {
    var data = item.articleDescription;
    // var newDescription = data.split('<br>').join('\n')
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("CollabrationDetail", { item: item })
        }
        style={[
          styles.itemContainer,
          this.props.lang == "en" && { flexDirection: "row-reverse" },
        ]}
      >
        <View style={styles.arrow}>
          {/* {this.props.lang == 'ar' ?
                        <IconMaterial name='keyboard-arrow-left' size={28} color={'#999999'} />
                        :
                        <IconMaterial name='keyboard-arrow-right' size={28} color={'#999999'} />
                    } */}
        </View>
        <View style={styles.itemView}>
          <Text
            numberOfLines={1}
            style={[
              styles.eventTitle,
              this.props.lang == "en" && { textAlign: "left" },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.subItem,
              { fontWeight: "600" },
              this.props.lang == "en" && { textAlign: "left" },
            ]}
          >
            {item.articleDisplayDate}
          </Text>
        </View>
        <Image source={{ uri: item.picture }} style={styles.imageStyle} />
      </TouchableOpacity>
    );
  }

  renderArticleGrid({ item }) {
    var data = item.articleDescription;
    // var newDescription = data.split('<br>').join('\n')
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("CollabrationDetail", { item: item })
        }
        style={styles.itemContainerGrid}
      >
        <View style={styles.imageStyleGridView}>
          <Image source={{ uri: item.picture }} style={styles.imageStyleGrid} />
        </View>
        <View style={styles.itemViewGrid}>
          <Text
            numberOfLines={1}
            style={[
              styles.eventTitleGrid,
              this.props.lang == "ar" && { fontSize: 15 },
            ]}
          >
            {item.title}
          </Text>
          <Text style={[styles.subItemGrid, { fontWeight: "600" }]}>
            {item.articleDisplayDate}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {this.state.isLoading ? (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={styles.header}>
              <View style={styles.showItem}>
                <Text style={styles.showingText}>
                  ( {this.state.article.length} )
                </Text>
              </View>
              <TouchableOpacity
                style={styles.gridView}
                onPress={() => this.setState({ isList: !this.state.isList })}
              >
                {!this.state.isList ? (
                  <Feather name="list" size={23} />
                ) : (
                  <Icon name="view-grid" size={23} />
                )}
              </TouchableOpacity>
            </View>
            <ScrollView>
              {this.state.isList && (
                <FlatList
                  data={this.state.article}
                  renderItem={this.renderArticle}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                />
              )}
              {!this.state.isList && (
                <FlatList
                  data={this.state.article}
                  renderItem={this.renderArticleGrid}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                  style={{ alignSelf: "center" }}
                />
              )}
            </ScrollView>
          </ScrollView>
        )}
      </View>
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
  itemContainer: {
    height: 95,
    flexDirection: "row",
    width: width * 0.92,
    alignItems: "center",
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  itemContainerGrid: {
    height: height / 4,
    width: width * 0.45,
    alignItems: "center",
    backgroundColor: "#fff",
    alignSelf: "center",
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 20,
    marginTop: 10,
  },
  arrow: {
    height: "100%",
    width: width * 0.08,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "right",
    fontFamily: FONT_MULI_BOLD,
  },
  subItem: {
    fontSize: 13,
    fontFamily: FONT_MULI_REGULAR,
    textAlign: "right",
    color: COLOR_SECONDARY,
  },
  eventTitleGrid: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: FONT_MULI_BOLD,
    paddingLeft: 5,
    paddingRight: 5,
  },
  subItemGrid: {
    fontSize: 11,
    fontFamily: FONT_MULI_REGULAR,
    textAlign: "center",
    color: COLOR_SECONDARY,
  },
  imageStyle: {
    height: 65,
    width: 65,
    borderRadius: 10,
    paddingRight: 20,
    paddingLeft: 20,
  },
  imageStyleGrid: {
    height: height / 5,
    width: "100%",
    alignSelf: "center",
    borderRadius: 15,
  },
  itemView: {
    height: "100%",
    width: "72%",
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  itemViewGrid: {
    height: 45,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  mainTitleText: {
    color: "#000",
    fontSize: 19,
    alignSelf: "center",
    fontFamily: FONT_MULI_BOLD,
  },
  header: {
    height: 40,
    flexDirection: "row",
    width: width - 40,
    alignSelf: "center",
    justifyContent: "space-between",
  },
  showItem: {
    justifyContent: "center",
  },
  gridView: {
    justifyContent: "center",
    alignItems: "center",
  },
  showingText: {
    fontFamily: FONT_MULI_BOLD,
    fontSize: 14,
  },
  imageStyleGridView: {
    height: height / 5,
    width: "100%",
    alignSelf: "center",
    borderRadius: 15,
    shadowColor: "#000000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  activityIndicator: {
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
  },
});
export default connect(mapStateToProps)(App);
