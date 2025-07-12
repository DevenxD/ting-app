import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { IconButton, Surface } from "react-native-paper";
import { useThemeContext } from "../contexts/ThemeContext";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import Slider from "@react-native-community/slider";

type Artist = {
  id: string;
  name: string;
  role: string;
  image: string;
  type: "artist";
  perma_url: string;
};

type ArtistMap = {
  primary_artists: Artist[];
  featured_artists: Artist[];
  artists: Artist[];
};

type Rights = {
  code: string;
  cacheable: string;
  delete_cached_object: string;
  reason: string;
};

type DownloadUrl = {
  quality: string;
  url: string;
};

type AlbumImage = {
  quality: string;
  url: string;
};

type MoreInfo = {
  music: string;
  album_id: string;
  album: string;
  label: string;
  label_id: string | null;
  origin: string;
  is_dolby_content: boolean;
  "320kbps": string;
  encrypted_media_url: string;
  encrypted_cache_url: string;
  encrypted_drm_cache_url: string;
  encrypted_drm_media_url: string;
  album_url: string;
  duration: string;
  rights: Rights;
  cache_state: string;
  has_lyrics: string;
  lyrics_snippet: string;
  starred: string;
  copyright_text: string;
  artistMap: ArtistMap;
  release_date: string | null;
  vcode: string;
  vlink: string;
  triller_available: boolean;
  request_jiotune_flag: boolean;
  webp: string;
};

type Song = {
  id: string;
  title: string;
  subtitle: string;
  header_desc: string;
  type: "song";
  perma_url: string;
  image: string;
  language: string;
  year: string;
  play_count: string;
  explicit_content: "0" | "1";
  list_count: string;
  list_type: string;
  list: string;
  more_info: MoreInfo;
  button_tooltip_info: any[];
  downloadUrl: DownloadUrl[];
  albumImage: AlbumImage[];
};

type SearchResponse = {
  total: number;
  start: number;
  results: Song[];
};

const Player = () => {
  const { theme } = useThemeContext();
  const { name, artist, album } = useLocalSearchParams();

  const [song, setSong] = useState<Song | null>(null);

  const searchSong = async () => {
    const response = await fetch(`/api/saavn/search?q=${name} - ${artist}`);
    const data: SearchResponse = await response.json();
    const songId = data.results[0].id;

    const songData = await getSong(songId);
    setSong(songData);
  };

  const player = useAudioPlayer(song?.downloadUrl[0].url || "", 100);
  const playerStatus = useAudioPlayerStatus(player);

  const getSong = async (id: string) => {
    const response = await fetch(`/api/saavn/getSong?id=${id}`);
    const data: Song = await response.json();
    return data;
  };

  useEffect(() => {
    searchSong();
  }, []);

  return (
    <Surface style={[styles.container]} theme={theme}>
      {song && (
        <View style={[styles.container, { padding: 16, width: "100%" }]}>
          <Image
            source={{ uri: song.image.replace("150x150", "500x500") }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 8,
            }}
          />

          <View style={{ margin: 8, marginTop: 16 }}>
            <Text
              style={{
                color: theme.colors.onSurface,
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              {song.title}
            </Text>
            <Text
              style={{
                color: theme.colors.onSurface,
                fontSize: 14,
              }}
            >
              {song.more_info.artistMap.primary_artists[0].name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
            }}
          >
            <IconButton icon="skip-previous" mode="contained-tonal" />
            <IconButton
              icon={playerStatus.playing ? "pause" : "play"}
              mode="contained"
              containerColor="white"
              iconColor={theme.colors.onPrimary}
              onPress={() =>
                playerStatus.playing ? player.pause() : player.play()
              }
            />
            <IconButton icon="skip-next" mode="contained-tonal" />
            <View style={{ flex: 1 }} />
            <IconButton icon="heart" mode="contained-tonal" />
          </View>

          <View
            style={{
              padding: 8,
              borderColor: theme.colors.secondary,
              borderWidth: 1,
              borderRadius: 8,
              marginVertical: 8,
              width: "100%",
            }}
          >
            <Slider
              style={{ width: "100%", height: 40 }}
              value={playerStatus.currentTime}
              minimumValue={0}
              maximumValue={playerStatus.duration}
              onSlidingComplete={(value) => player.seekTo(value)}
            />
          </View>

          <View
            style={{
              padding: 8,
              borderColor: theme.colors.secondary,
              borderWidth: 1,
              borderRadius: 8,
              marginVertical: 8,
              width: "100%",
            }}
          >
            <Text style={{ color: theme.colors.onSurface }}>Timestamps</Text>
          </View>

          <View
            style={{
              padding: 8,
              backgroundColor: "#555",
              borderRadius: 8,
              marginVertical: 8,
              width: "100%",
              minHeight: 100,
            }}
          >
            <Text style={{ color: theme.colors.onSurface }}>LYRICS CARD</Text>
            <Text style={{ color: theme.colors.onSurface }}>
              {playerStatus.currentTime}
            </Text>
          </View>
        </View>
      )}
    </Surface>
  );
};

export default Player;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
});
