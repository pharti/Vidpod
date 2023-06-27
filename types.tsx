export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  MyFeed: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  HomeScreen: undefined;
  AlbumScreen: {
    title: string;
  };
  EpisodeScreen: {
    title: string;
  };
};
export type LibraryParamsList = {
  LibraryScreen: undefined;
  AlbumScreen: {
    title: string;
  };
  EpisodeScreen: {
    title: string;
  };
};
export type TabTwoParamList = {
  TabTwoScreen: undefined;
  AlbumScreen: {
    title: string;
  };
  EpisodeScreen: {
    title: string;
  };
};

export type Album = {
  id: number;
  // imageUri:string;
  name: string;
  feedlink: string;
  artistsHeadline: string;
  // by:string,
  type: string;
  image_url: string;
  numberOfLikes: number;
};
export type Author = {
  name: string;
};
export type Enclosure = {
  url: string;
};
export type Itunes = {
  image: string;
  duration: string;
};
export type Song = {
  id: string;
  title: string;
  // podcast_id: number;
  authors: Array<Author>;
  enclosures: Array<Enclosure>;
  itunes: Itunes;
};
