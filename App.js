import React, { Component } from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./common/store";
import Router from "./screens/router";
import { PersistGate } from "redux-persist/integration/react";
import firebase from "react-native-firebase";
import { Platform } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import NavigationService from "./common/NavigationService";
export { store };
class App extends Component {
  async componentDidMount() {
    //Create channel
    const channel = new firebase.notifications.Android.Channel(
      "default",
      "Default",
      firebase.notifications.Android.Importance.Max
    ).setDescription("General notifications");
    firebase.notifications().android.createChannel(channel);
    {
      Platform.OS === "ios" && firebase.notifications().setBadge(0);
    }
    //Notification listener
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        console.log("push notification", notification);
        const localNotification = new firebase.notifications.Notification({
          sound: "default",
          show_in_foreground: true,
          title: notification.title,
          body: notification.body,
        })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setBody(notification.body)
          .setData(notification.data);
        if (Platform.OS === "android")
          localNotification.android
            .setChannelId("default")
            .android.setPriority(firebase.notifications.Android.Priority.High)
            .android.setSmallIcon("titlelogo")
            .android.setColor("#FF6448");
        firebase.notifications().displayNotification(localNotification);
      });
    //background
    //Notification open listener
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    {
      Platform.OS === "ios" && firebase.notifications().setBadge(0);
    }
    if (notificationOpen) {
      console.log(
        "__--------____---_-------open___+-=-=-=-_=-=-=-=-",
        notificationOpen.notification
      );
      // App was opened by a notification
      // Get the action triggered by the notification being opened
      const notification = notificationOpen.notification;
      if (notification.data.itemType == 1) {
        NavigationService.push("AboutUs");
      }
      if (notification.data.itemType == 2) {
        NavigationService.push("EventDetail", {
          eventId: notification.data.itemId,
        });
      }
      if (notification.data.itemType == 3) {
        NavigationService.push("ProgrammeDetail", {
          programmeId: notification.data.itemId,
        });
      }
      if (notification.data.itemType == 4) {
        NavigationService.push("LatestFeedsDetail", {
          latestFeedId: notification.data.itemId,
        });
      }
      if (notification.data.itemType == 5) {
        NavigationService.push("OnlineSection", {
          courseId: notification.data.itemId,
        });
      }
      if (notification.data.itemType == 6) {
        NavigationService.push("CollectionDetail", {
          collectionId: notification.data.itemId,
        });
      }
      if (notification.data.itemType == 7) {
        NavigationService.push("ArtistDetail", {
          artistId: notification.data.itemId,
        });
      }
      if (notification.data.itemType == 8) {
        NavigationService.push("Library");
      }
      if (notification.data.itemType == 9) {
        NavigationService.push("AudioDetail", {
          audioId: notification.data.itemId,
        });
      }
      if (notification.data.itemType == 10) {
        NavigationService.push("Founder");
      }
      if (notification.data.itemType == 11) {
        NavigationService.push("Media");
      }
      if (notification.data.itemType == 12) {
        NavigationService.push("News");
      }
      if (notification.data.itemType == 13) {
        NavigationService.push("KidsCornerLessons", {
          courseId: notification.data.itemId,
        });
      }
      if (notification.data.itemType == 14) {
        NavigationService.push("CollabrationDetail", {
          collabrationId: notification.data.itemId,
        });
      }
      if (notification.data.itemType == 15) {
        NavigationService.push("ArticleDetail", {
          articleId: notification.data.itemId,
        });
      }
      if (notification.data.itemType == 16) {
        NavigationService.push("OnlineShopping");
      }
      // Get information about the notification that was opened
    }
  }
  componentWillUnmount() {
    this.notificationListener();
    // this.notificationOpenedListener();
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Router
            ref={(navigatorRef) => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        </PersistGate>
      </Provider>
    );
  }
}
export default App;
