import React from "react";
import { Dimensions } from "react-native";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import BottomTab from "../components/BottomTab";
import DrawerItem from "../components/DrawerComponent";
import Home from "./home";
import Programmes from "./programmes";
import ProgrammeDetail from "./programmeDetail";
import Media from "./Media";
import Library from "./library";
import AboutUs from "./aboutUs";
import ContactUs from "./contactUs";
import EventDetail from "./eventDetail";
import Events from "./events";
import RegisterEvent from "./registerEvent";
import Article from "./Article";
import Artists from "./artists";
import ArtistDetail from "./artistDetail";
import ArtistsTree from "./artists/components/ArtistsTree";
import ArtistsTreeDetail from "./artistDetail/components/ArtistsTreeDetail";
import TermsCondition from "./termsConditions";
import CookiePolicy from "./termsConditions/components/CookiePolicy";
import PrivacyPolicy from "./termsConditions/components/PrivacyPolicy";
import Collection from "./collection";
import News from "./news";
import CollectionDetail from "./collectionDetail";
import NewsDetail from "./newsDetail";
import AudioGallery from "./audioGallery";
import ArticleDetail from "./articleDetail";
import Login from "./login";
import OnlineDetail from "./onlineSectionDetail";
import SignUp from "./signUp";
import Settings from "./settings";
import OTP from "./otp";
import ForgotPassword from "./forgotPassword";
import ResetPassword from "./resetPassword";
import OnlineSection from "./onlineSection";
import OnlineShopping from "./onlineShopping";
import OnlineShoppingDetail from "./onlineShoppingDetail";
import Cart from "./cart";
import Filter from "./filter";
import FilterCategory from "./filterCategory";
import ArtGallery from "./artGallery";
import ArtGalleryDetail from "./artGalleryDetail";
import KidsCorner from "./kidsCorner";
import KidsCornerDetail from "./kidsCornerDetail";
import ChildProgrammes from "./childProgrammes";
import Collabration from "./collabration";
import CollabrationDetail from "./collabrationDetail";
import CertifiedCalligraphers from "./certifiedCalligraphers";
import Courses from "./courses";
import CountryMap from "./certifiedCalligraphers/components/CountryMap";
import AudioDetail from "./audioGallery/components/AudioDetail";
import LatestFeeds from "./latestFeeds";
import LatestFeedsDetail from "./latestFeedsDetail";
import Founder from "./founder";
import FounderDetail from "./founderDetail";
import secondChildProgrammes from "./childProgrammes/components/secondChildProgrammes";
import LanguageSelection from "./languageSelection";
import ArtistsWorld from "./artistsWorld";
import ArtistList from "./artistsWorld/components/ArtistList";
import ArtistListSub from "./artistsWorld/components/ArtistListSub";
import ArtistListCountry from "./artistsWorld/components/ArtistListCountry";
import CountryMapWorld from "./artistsWorld/components/CountryMapWorld";
import CountryList from "./artistsWorld/components/CountryList";
import ArtistWorldDetail from "./artistDetail/components/ArtistWorldDetail";
import ArtistsWorldSub from "./artistsWorld/components/ArtistsWorldSub";
import MyOrder from "./myOrder";
import MyOrderDetail from "./myOrder/MyOrderDetail";
import ArtWorkForm from "./artWorkForm";
import Search from "./search";
import EventCategory from "./events/components/EventCategory";
import entry from "./entry";
import showAllProgramme from "./programmeDetail/components/showAllProgramme";
import ArtistSearch from "./artists/components/ArtistSearch";
import KidsCornerLessons from "./kidsCorner/components/KidsCornerLessons";
import AuctionArt from "./auctionArt";
import AuctionArtDetail from "./auctionArtDetail";
import Festival from "./festival";
import UpcomingEvents from "./upcomingEvents";
import ArtGalleryUpcomingEvents from "./artGalleryUpcomingEvents";
import ArtistsUpcomingEvents from "./artistsUpcomingEvents";
import HHcollection from "./hhcollection";
import RegisterVisitor from "./registerVisitor";
import EventPictures from "./eventDetail/components/EventPictures";
import EventVideos from "./eventDetail/components/EventVideos";
import VideoDetail from "./eventDetail/components/VideoDetail";
import Address from "./settings/components/Address";
import AddressDetail from "./settings/components/AddressDetail";
// import ArtAr from './artGalleryDetail/components/artAr'

import { PRIMARY_COLOR, SECONDARY_COLOR } from "../assets/color";
import EventArtWorks from "./eventDetail/components/EventArtWorks";
import EventArtWorkDetails from "./eventDetail/components/EventArtWorkDetails";
import EventArtist from "./eventDetail/components/EventArtist";
import HhCollection from "./eventDetail/components/HhCollection";
import hhWorkDetails from "./eventDetail/components/hhWorkDetails";
import kac from "./kac/components/kac";
import PdfView from "./eventDetail/components/PdfView";
const { height, width } = Dimensions.get("screen");

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: Home,
    },
  },
  {
    headerMode: "screen",
  }
);

const ProgrammesStack = createStackNavigator(
  {
    Programmes: {
      screen: Programmes,
    },
    ProgrammeDetail: {
      screen: ProgrammeDetail,
    },
    ChildProgrammes: {
      screen: ChildProgrammes,
    },
    ArticleDetail: {
      screen: ArticleDetail,
    },
    secondChildProgrammes: {
      screen: secondChildProgrammes,
    },
    showAllProgramme: {
      screen: showAllProgramme,
    },
    OnlineSection: {
      screen: OnlineSection,
    },
    ArtistDetail: {
      screen: ArtistDetail,
    },
  },
  {
    headerMode: "screen",
  }
);

const AboutUsStack = createStackNavigator(
  {
    AboutUs: {
      screen: AboutUs,
    },
  },
  {
    headerMode: "screen",
  }
);

const MediaStack = createStackNavigator(
  {
    Media: {
      screen: Media,
    },
  },
  {
    headerMode: "screen",
  }
);

const LibraryStack = createStackNavigator(
  {
    Library: {
      screen: Library,
    },
  },
  {
    headerMode: "screen",
  }
);

const OnlineShoppingStack = createStackNavigator(
  {
    OnlineShopping: {
      screen: OnlineShopping,
    },
    Filter: {
      screen: Filter,
    },
    FilterCategory: {
      screen: FilterCategory,
    },
    Cart: {
      screen: Cart,
    },
    OnlineShoppingDetail: {
      screen: OnlineShoppingDetail,
    },
    MyOrder: {
      screen: MyOrder,
    },
    MyOrderDetail: {
      screen: MyOrderDetail,
    },
    Address: {
      screen: Address,
    },
    AddressDetail: {
      screen: AddressDetail,
    },
  },
  {
    headerMode: "screen",
  }
);

const AudioGalleryStack = createStackNavigator(
  {
    AudioGallery: {
      screen: AudioGallery,
    },
    AudioDetail: {
      screen: AudioDetail,
    },
  },
  {
    headerMode: "screen",
  }
);

const EventStack = createStackNavigator(
  {
    EventCategory: {
      screen: EventCategory,
    },
    Events: {
      screen: Events,
    },
  },
  {
    headerMode: "screen",
  }
);

const ContactUsStack = createStackNavigator(
  {
    ContactUs: {
      screen: ContactUs,
    },
  },
  {
    headerMode: "screen",
  }
);

const RegisterVisitorStack = createStackNavigator(
  {
    RegisterVisitor: {
      screen: RegisterVisitor,
    },
  },
  {
    headerMode: "screen",
  }
);
const ArticleStack = createStackNavigator(
  {
    Article: {
      screen: Article,
    },
    ArticleDetail: {
      screen: ArticleDetail,
    },
    ChildProgrammes: {
      screen: ChildProgrammes,
    },
  },
  {
    headerMode: "screen",
  }
);
const CollabrationStack = createStackNavigator(
  {
    Collabration: {
      screen: Collabration,
    },
    CollabrationDetail: {
      screen: CollabrationDetail,
    },
    ArticleDetail: {
      screen: ArticleDetail,
    },
  },
  {
    headerMode: "screen",
  }
);
const CalligraphersStack = createStackNavigator(
  {
    CertifiedCalligraphers: {
      screen: CertifiedCalligraphers,
    },
    ArtistsTree: {
      screen: ArtistsTree,
    },
    ArtistsTreeDetail: {
      screen: ArtistsTreeDetail,
    },
    CountryMap: {
      screen: CountryMap,
    },
  },
  {
    headerMode: "screen",
  }
);
const ArtistsStack = createStackNavigator(
  {
    Artists: {
      screen: Artists,
    },
    ArtistDetail: {
      screen: ArtistDetail,
    },
    LatestFeedsDetail: {
      screen: LatestFeedsDetail,
    },
    OnlineSection: {
      screen: OnlineSection,
    },
    ArtistSearch: {
      screen: ArtistSearch,
    },
  },
  {
    headerMode: "screen",
  }
);
const EventDetailStack = createStackNavigator(
  {
    EventDetail: {
      screen: EventDetail,
    },
    ArtistDetail: {
      screen: ArtistDetail,
    },
    RegisterEvent: {
      screen: RegisterEvent,
    },
    EventPictures: {
      screen: EventPictures,
    },
    EventVideos: {
      screen: EventVideos,
    },
    VideoDetail: {
      screen: VideoDetail,
    },
    EventArtWorks: {
      screen: EventArtWorks,
    },
    EventArtWorkDetails: {
      screen: EventArtWorkDetails,
    },
    EventArtist: {
      screen: EventArtist,
    },
    HhCollection: {
      screen: HhCollection,
    },
    hhWorkDetails: {
      screen: hhWorkDetails,
    },
    PdfView: {
      screen: PdfView,
    },
    // ArtistDetail:{
    //     screen:ArtistDetail
    // }
  },
  {
    headerMode: "screen",
  }
);

const KidsCornerStack = createStackNavigator(
  {
    KidsCorner: {
      screen: KidsCorner,
    },
    KidsCornerDetail: {
      screen: KidsCornerDetail,
    },
    KidsCornerLessons: {
      screen: KidsCornerLessons,
    },
    ArtistDetail: {
      screen: ArtistDetail,
    },
  },
  {
    headerMode: "screen",
  }
);
const NewsStack = createStackNavigator(
  {
    News: {
      screen: News,
    },
    NewsDetail: {
      screen: NewsDetail,
    },
  },
  {
    headerMode: "screen",
  }
);

const CoursesStack = createStackNavigator(
  {
    Courses: {
      screen: Courses,
    },
    OnlineSection: {
      screen: OnlineSection,
    },
    OnlineDetail: {
      screen: OnlineDetail,
    },
    ArtistDetail: {
      screen: ArtistDetail,
    },
  },
  {
    headerMode: "screen",
  }
);
const CollectionStack = createStackNavigator(
  {
    Collection: {
      screen: Collection,
    },
    CollectionDetail: {
      screen: CollectionDetail,
    },
  },
  {
    headerMode: "screen",
  }
);
const SettingsStack = createStackNavigator(
  {
    Settings: {
      screen: Settings,
    },
    MyOrder: {
      screen: MyOrder,
    },
    MyOrderDetail: {
      screen: MyOrderDetail,
    },
    Address: {
      screen: Address,
    },
    AddressDetail: {
      screen: AddressDetail,
    },
  },
  {
    headerMode: "screen",
  }
);
const ArtGalleryStack = createStackNavigator(
  {
    ArtGallery: {
      screen: ArtGallery,
    },
    ArtGalleryDetail: {
      screen: ArtGalleryDetail,
    },
    ArtistDetail: {
      screen: ArtistDetail,
    },
    LatestFeedsDetail: {
      screen: LatestFeedsDetail,
    },
    OnlineSection: {
      screen: OnlineSection,
    },
    // ArtAr: {
    //     screen: ArtAr
    // },
  },
  {
    headerMode: "screen",
  }
);
const FounderStack = createStackNavigator(
  {
    Founder: {
      screen: Founder,
    },
    FounderDetail: {
      screen: FounderDetail,
    },
    ArticleDetail: {
      screen: ArticleDetail,
    },
  },
  {
    headerMode: "screen",
  }
);
const LatestFeedsStack = createStackNavigator(
  {
    LatestFeeds: {
      screen: LatestFeeds,
    },
    LatestFeedsDetail: {
      screen: LatestFeedsDetail,
    },
    ArtistsTreeDetail: {
      screen: ArtistsTreeDetail,
    },
    ArtistDetail: {
      screen: ArtistDetail,
    },
  },
  {
    headerMode: "screen",
  }
);
const ArtistsWorldStack = createStackNavigator(
  {
    ArtistsWorld: {
      screen: ArtistsWorld,
    },
    ArtistList: {
      screen: ArtistList,
    },
    CountryMapWorld: {
      screen: CountryMapWorld,
    },
    CountryList: {
      screen: CountryList,
    },
    ArtistWorldDetail: {
      screen: ArtistWorldDetail,
    },
    ArtistListCountry: {
      screen: ArtistListCountry,
    },
    ArtistsWorldSub: {
      screen: ArtistsWorldSub,
    },
    ArtistListSub: {
      screen: ArtistListSub,
    },
    ArtistDetail: {
      screen: ArtistDetail,
    },
    LatestFeedsDetail: {
      screen: LatestFeedsDetail,
    },
  },
  {
    headerMode: "screen",
  }
);
const ArtWorkFormStack = createStackNavigator(
  {
    ArtWorkForm: {
      screen: ArtWorkForm,
    },
  },
  {
    headerMode: "screen",
  }
);
const SearchStack = createStackNavigator(
  {
    Search: {
      screen: Search,
    },
    ArticleDetail: {
      screen: ArticleDetail,
    },
    OnlineSection: {
      screen: OnlineSection,
    },
    OnlineDetail: {
      screen: OnlineDetail,
    },
    ArtistDetail: {
      screen: ArtistDetail,
    },
  },
  {
    headerMode: "screen",
  }
);
const FestivalStack = createStackNavigator(
  {
    Festival: {
      screen: Festival,
    },
    // FestivalDetail: {
    //     screen: FestivalDetail
    // },
  },
  {
    headerMode: "screen",
  }
);
const AuctionArtStack = createStackNavigator(
  {
    AuctionArt: {
      screen: AuctionArt,
    },
    AuctionArtDetail: {
      screen: AuctionArtDetail,
    },
  },
  {
    headerMode: "screen",
  }
);
const kacStack = createStackNavigator(
  {
    kac: {
      screen: kac,
    },
  },
  {
    headerMode: "screen",
  }
);
const UpcomingEventsStack = createStackNavigator(
  {
    UpcomingEvents: {
      screen: UpcomingEvents,
    },
    RegisterEvent: {
      screen: RegisterEvent,
    },
    ArtGalleryUpcomingEvents: {
      screen: ArtGalleryUpcomingEvents,
    },
    ArtistsUpcomingEvents: {
      screen: ArtistsUpcomingEvents,
    },
    ArtistDetail: {
      screen: ArtistDetail,
    },
    ArtGalleryDetail: {
      screen: ArtGalleryDetail,
    },
    LatestFeedsDetail: {
      screen: LatestFeedsDetail,
    },
    OnlineSection: {
      screen: OnlineSection,
    },
    HHcollection: {
      screen: HHcollection,
    },
  },
  {
    headerMode: "screen",
  }
);
const BottomTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
    },
    AboutUs: {
      screen: AboutUsStack,
    },
    Programmes: {
      screen: ProgrammesStack,
    },
    // Events: {
    //     screen: EventStack
    // },
    Settings: {
      screen: SettingsStack,
    },
  },
  {
    tabBarComponent: (props) => <BottomTab {...props} />,
    tabBarOptions: {
      activeTintColor: PRIMARY_COLOR,
      inactiveTintColor: SECONDARY_COLOR,
      showLabel: true,
      backBehavior: "none",
      style: {
        height: 70,
      },
    },
  }
);
const DrawerContent = (props) => <DrawerItem {...props} />;

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: BottomTabNavigator,
    },
    AboutUs: {
      screen: AboutUsStack,
    },
    Programmes: {
      screen: ProgrammesStack,
    },
    Events: {
      screen: EventStack,
    },
    ArtGallery: {
      screen: ArtGalleryStack,
    },
    Library: {
      screen: LibraryStack,
    },
    Media: {
      screen: MediaStack,
    },
    Article: {
      screen: ArticleStack,
    },
    Artists: {
      screen: ArtistsStack,
    },
    CertifiedCalligraphers: {
      screen: CalligraphersStack,
    },
    ArtistsWorld: {
      screen: ArtistsWorldStack,
    },
    Collection: {
      screen: CollectionStack,
    },
    AudioGallery: {
      screen: AudioGalleryStack,
    },
    // News: {
    //     screen: NewsStack
    // },
    LatestFeeds: {
      screen: LatestFeedsStack,
    },
    Courses: {
      screen: CoursesStack,
    },
    KidsCorner: {
      screen: KidsCornerStack,
    },
    Collabration: {
      screen: CollabrationStack,
    },
    // ArtWorkForm: {
    //     screen: ArtWorkFormStack
    // },
    AuctionArt: {
      screen: AuctionArtStack,
    },
    Festival: {
      screen: FestivalStack,
    },
    OnlineShopping: {
      screen: OnlineShoppingStack,
    },
    ContactUs: {
      screen: ContactUsStack,
    },
    RegisterVisitor: {
      screen: RegisterVisitorStack,
    },
    kac: {
      screen: kacStack,
    },
  },
  {
    contentComponent: DrawerContent,
    //drawerLockMode: 'unlocked',
    contentOptions: {
      backBehavior: "none",
      itemsContainerStyle: {
        marginVertical: 100,
        width: width * 0.4,
      },
      activeTintColor: PRIMARY_COLOR,
      inactiveTintColor: SECONDARY_COLOR,
    },
  }
);
const AppStack = createStackNavigator(
  {
    Home: {
      screen: DrawerNavigator,
    },
    EventDetail: {
      screen: EventDetailStack,
    },
    TermsCondition: {
      screen: TermsCondition,
    },
    CookiePolicy: {
      screen: CookiePolicy,
    },
    PrivacyPolicy: {
      screen: PrivacyPolicy,
    },
    Login: {
      screen: Login,
    },
    SignUp: {
      screen: SignUp,
    },
    OTP: {
      screen: OTP,
    },
    ForgotPassword: {
      screen: ForgotPassword,
    },
    ResetPassword: {
      screen: ResetPassword,
    },
    Article: {
      screen: ArticleStack,
    },
    LanguageSelection: {
      screen: LanguageSelection,
    },
    OnlineShoppingDetail: {
      screen: OnlineShoppingDetail,
    },
    Search: {
      screen: SearchStack,
    },
    Founder: {
      screen: FounderStack,
    },
    entry: {
      screen: entry,
    },
    UpcomingEvents: {
      screen: UpcomingEventsStack,
    },
    kac: {
      screen: kacStack,
    },
  },
  {
    headerMode: "none",
    initialRouteName: "entry",
  }
);
export default createAppContainer(AppStack);
