import React from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  movieContainer: {
    width: Dimensions.get("window").width / 3 - 10,
    marginHorizontal: 5,
    marginTop: 6,
    marginBottom: 6
  },
  movieImageContainer: {
    flex: 1,
    height: 200
  },
  moviePosterImage: {
    borderRadius: 10,
    flex: 1
  },
  movieTitle: {
    fontFamily: "Avenir",
    fontSize: 14
  },
  movieFavoriteButtonContainer: {},
  movieFavoriteButton: {
    position: "absolute",
    top: 5,
    left: 5
  }
});

const MovieItem = props => {
  const { item, isFavorite, onToggleFavorite } = props;
  return (
    <View style={styles.movieContainer}>
      <View style={styles.movieImageContainer}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w154/${item.poster_path}`
          }}
          style={styles.moviePosterImage}
        />
      </View>
      <Text style={styles.movieTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <TouchableOpacity
        onPress={() => onToggleFavorite(item)}
        style={styles.movieFavoriteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name="ios-heart"
          size={24}
          color={isFavorite ? "red" : "#fff"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MovieItem;
