import React, { useState, useEffect } from "react";
import Header from "../../common/header/Header";
import { Link, useParams } from "react-router-dom";
import moment from 'moment';
import { Typography } from "@material-ui/core";
import YouTube from "react-youtube";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import "./Details.css";
import { Fragment } from "react";

const Details = (props) => {
  let { id } = useParams();

  let [movieData, setMovieData] = useState("");
  let [genres, setGenres] = useState([]);
  let [youtubeUrl, setYouttubeUrl] = useState("");
  let [artists, setArtists] = useState([]);
  let [rating, setRating] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      try {
        let response = await fetch(
          props.baseUrl + "movies/" + id
        );
        let result = await response.json();
        setMovieData(result);
        setArtists(result.artists);
        setYouttubeUrl(result.trailer_url);
        setGenres(result.genres);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.clear();
        }
      }
    };
    getDetails();
  }, []);

  const onClick = (value) => (event) => {
    if (rating === 1 && rating === value) setRating(0);
    else setRating(value);
  };


  const youtubeId = youtubeUrl.split("=")[1];

  const opts = {
    height: "500",
    width: "100%",
    playerVars: {
      autoplay: 0,
      origin: "http://localhost:3000",
    },
  };

  return (
    <Fragment>
      <Header bookShow={true} bookShowId={id} />
      <div className="root-container">
        <Typography>
          <Link to="/" className="back-link">
            <span className="back-to-home">&#60; Back to Home</span>
          </Link>
        </Typography>
        <div className="main-content">
          <div className="left-content">
            <img src={movieData.poster_url} alt={movieData.title} style={{ width: '-webkit-fill-available' }} />
          </div>
          <div className="middle-content">
            <Typography variant="h2" component="h2">
              {movieData.title}
            </Typography>
            <Typography variant="subtitle1">
              <b>Genre: </b>
              {genres.map((genre) => `${genre}, `)}
            </Typography>
            <Typography variant="subtitle1">
              <b>Duration: </b>
              {movieData.duration}
            </Typography>
            <Typography variant="subtitle1">
              <b>Release Date: </b>
              {moment(movieData.release_date).format('ddd MMM DD YYYY')}
            </Typography>
            <Typography variant="subtitle1">
              <b>Rating: </b>
              {movieData.rating}
            </Typography>
            <Typography
              variant="subtitle1"
            >
              <b>
                Plot:{" "}
                <a href={movieData.wiki_url} target="_blank">
                  (Wiki Link)
                </a>
              </b>
              {" " + movieData.storyline}
            </Typography>
            <Typography
              variant="subtitle1"
            >
              <b>Trailer:</b>
            </Typography>
            <YouTube
              videoId={youtubeId}
              opts={opts}
              onReady={(event) => {
                event.target.pauseVideo();
              }}
            />
          </div>
          <div className="right-content">
            <Typography>
              <b>Rate this movie:</b>
            </Typography>
            <div>
              {[1, 2, 3, 4, 5].map((element) => (
                <StarBorderIcon
                  id={element}
                  key={element}
                  style={
                    rating >= element
                      ? { color: "yellow", cursor: "pointer" }
                      : { cursor: "pointer" }
                  }
                  onClick={onClick(element)}
                />
              ))}
            </div>
            <div className="artist-heading">
              Artists:
            </div>
            <ImageList rowHeight={180}>
              {artists ? (
                artists.map((artist) => (
                  <ImageListItem key={artist.id}>
                    <img src={artist.profile_url} alt={artist.first_name} />
                    <ImageListItemBar
                      title={artist.first_name + " " + artist.last_name}
                    />
                  </ImageListItem>
                ))
              ) : (
                <h6>No artist data available</h6>
              )}
            </ImageList>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Details;