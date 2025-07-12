import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import {
  Searchbar,
  Surface,
  Text,
  ActivityIndicator,
  TouchableRipple,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Song = {
  type: string;
  videoId: string;
  name: string;
  artist: {
    artistId: string;
    name: string;
  };
  album: {
    albumId: string;
    name: string;
  };

  duration: number;
  thumbnails: {
    url: string;
    width: number;
    height: number;
  }[];
};

type SearchResults = {
  results: Song[];
};

const Home = () => {
  const styles = StyleSheet.create({
    searchbar: {
      margin: 8,
    },
    songItem: {
      borderRadius: 8,
    },
    songContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      width: "100%",
      marginVertical: 8,
      pointerEvents: "none",
    },
    songImage: {
      height: 64,
      width: 64,
      borderRadius: 4,
    },
    songInfo: {
      marginStart: 16,
      flex: 1,
      height: "100%",
      paddingVertical: 4,
      justifyContent: "flex-start",
    },
    songTitle: {
      fontWeight: "bold",
      fontSize: 18,
      paddingEnd: 16,
    },
    artistName: {
      color: "#999",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listContainer: {
      width: "100%",
      paddingHorizontal: 8,
    },
    surface: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!search.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Replace with your Spotify API endpoint and authentication
      const response = await fetch(
        `/api/ytmusic/search?q=${encodeURIComponent(search)}&type=song`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch songs");
      }

      const data: SearchResults = await response.json();
      setSongs(data.results);
    } catch (err) {
      setError("Failed to load search results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <TouchableRipple
      borderless={true}
      style={styles.songItem}
      onPress={() => {
        router.push(
          `/player?name=${item.name}&artist=${item.artist.name}&album=${item.album.name}`
        );
      }}
    >
      <View style={styles.songContainer}>
        <Image
          source={{ uri: item.thumbnails[1].url }}
          style={styles.songImage}
        />
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text style={styles.artistName}>{item.artist.name}</Text>
        </View>
      </View>
    </TouchableRipple>
  );

  return (
    <Surface style={styles.surface}>
      <Searchbar
        style={styles.searchbar}
        icon="cog"
        onIconPress={() => router.push("/settings")}
        placeholder="Search songs..."
        value={search}
        onChangeText={(text) => setSearch(text)}
        onSubmitEditing={handleSearch}
        onClearIconPress={() => {
          setSearch("");
          setSongs([]);
        }}
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text>{error}</Text>
        </View>
      ) : (
        <FlatList
          style={styles.listContainer}
          contentContainerStyle={{ flexGrow: 1 }}
          data={songs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.videoId}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>{search ? "No songs found" : "Search for songs"}</Text>
            </View>
          }
        />
      )}
    </Surface>
  );
};

export default Home;
