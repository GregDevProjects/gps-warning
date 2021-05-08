import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

//An object representing behavior that should be applied to the incoming notification.
//see https://docs.expo.io/versions/latest/sdk/notifications/#notificationbehavior
const NOTIFICATION_BEHAVIOR = {
  shouldShowAlert: true,
  shouldPlaySound: true,
  shouldSetBadge: true,
};

//non persistent push notifications?
Notifications.setNotificationHandler({
  handleNotification: async () => NOTIFICATION_BEHAVIOR,
});

//TODO: come up with some defaults for content param
/**
 * send a push to the local device immediately
 *
 * @param {Object} content An object representing notification content that you pass in to, see https://docs.expo.io/versions/latest/sdk/notifications/#notificationcontentinput
 */
const sendLocalNotification = (content) => {
  Notifications.scheduleNotificationAsync({ content, trigger: null });
};

const registerForPushNotificationsAsync = async () => {
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

//TODO: turn this into a custom hook?
const listeners = () => {
  const notificationListener = useRef();
  const responseListener = useRef();

  // This listener is fired whenever a notification is received while the app is foregrounded
  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("foreground push received ");
    }
  );

  // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  responseListener.current = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log("background push received ");
    }
  );

  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };
};

export { sendLocalNotification, registerForPushNotificationsAsync };
