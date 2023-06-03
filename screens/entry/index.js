import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  FlatList,
  Animated,
  ActivityIndicator,
  BackHandler,
  AppState,
} from "react-native";
import { connect } from "react-redux";
import { resetBanner } from "../home/action";
import { NavigationActions } from "react-navigation";
import Images from "../../assets/images";

const { height, width } = Dimensions.get("screen");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExit: false,
    };
    this.goToPages = this.goToPages.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(resetBanner());

    AppState.addEventListener("change", (state) => this.navBackground(state));
  }

  navBackground(state) {
    if (state === "active") {
      if (this.props.isFirstlogin) {
        this.props.navigation.navigate("LanguageSelection");
      } else {
        if (this.state.isExit === true) {
          this.props.navigation.navigate("Home");
        }
      }
      // this.setState({ isExit: false });
    }
  }

  componentWillMount() {
    this._subscribe = this.props.navigation.addListener("didFocus", () => {
      this.setState({ isExit: true });
      BackHandler.exitApp();
    });
  }

  goToPages() {
    console.log(
      "go to apgess....>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
      this.props.isFirstlogin
    );
    if (this.props.isFirstlogin) {
      this.props.navigation.navigate("LanguageSelection");
    } else {
      this.props.navigation.navigate("Home");
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        {this.goToPages()}
        <Image
          source={Images.logoLetterNew}
          style={styles.image}
          resizeMode="contain"
        />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => ({
  isFirstlogin: state.resetFirstLogin.isFirstLogin,
});
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    height: width - 60,
    width: width - 60,
  },
});
export default connect(mapStateToProps)(App);
