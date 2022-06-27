import React, { useState, useEffect, Fragment } from 'react';
import Header from '../../common/header/Header';
import Heading from '../../common/heading/Heading';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import {
  Card,
  CardContent,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Input,
  Checkbox,
  Button,
  ListItemText,
  Typography,
} from '@material-ui/core';
import './Home.css';
import { Link } from 'react-router-dom';
import moment from 'moment';

const Home = props => {
  const useStyles = makeStyles(theme => ({
    grid: {
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
    },
    root: {
      float: 'right',
      margin: theme.spacing(1, 'auto'),
      minWidth: 240,
      maxWidth: 'fit-content'
    },
    title: {
      color: theme.palette.primary.light,
    },
    withMargin: {
      marginBottom: theme.spacing(1, 'auto'),
      marginTop: theme.spacing(1, 'auto'),
    },
    button: {
      width: '100%',
    },
    upcomingMoviesGrid: {
      flexWrap: "nowrap",
      width: "100%",
      transform: "translateZ(0)",
    },
    releasedMoviesGrid: {
      transform: "translateZ(0)",
      cursor: "pointer",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 240,
      maxWidth: 240,
    },
  }));

  const classes = useStyles();

  const [UpcomingMovies, setUpcomingMovies] = useState([]);
  const [ReleasedMovies, setReleasedMovies] = useState([]);
  const [GenreList, setGenreList] = useState([]);
  const [ArtistList, setArtistList] = useState([]);
  const [MovieName, setMovieName] = useState("");
  const [SelectedGenres, setSelectedGenres] = useState([]);
  const [SelectedArtists, setSelectedArtists] = useState([]);
  const [StartReleasedDate, setStartReleasedDate] = useState("");
  const [EndReleasedDate, setEndReleasedDate] = useState("");


  useEffect(() => {
    fetch(props.baseUrl + "movies?status=PUBLISHED", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((response) => setUpcomingMovies(response.movies));

    //Fetch released movies
    fetch(props.baseUrl + "movies?status=RELEASED", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response.movies);
        setReleasedMovies(response.movies)
      });

    //Fetch genres
    fetch(props.baseUrl + "genres", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((response) => setGenreList(response.genres));

    //Fetch artists
    fetch(props.baseUrl + "artists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((response) => setArtistList(response.artists));
  }, []);

  const applyFilterHandler = () => {
    let initialQueryString = "?status=RELEASED";

    if (MovieName !== "") {
      initialQueryString += "&title=" + MovieName;
    }
    if (SelectedGenres.length > 0) {
      initialQueryString += "&genres=" + SelectedGenres.toString();
    }
    if (SelectedArtists.length > 0) {
      initialQueryString += "&artists=" + SelectedArtists.toString();
    }
    if (StartReleasedDate !== "") {
      initialQueryString += "&start_date=" + StartReleasedDate;
    }
    if (EndReleasedDate !== "") {
      initialQueryString += "&end_date=" + EndReleasedDate;
    }

    fetch(props.baseUrl + "movies" + encodeURI(initialQueryString), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setReleasedMovies(response.movies);
      });
  };

  return (
    <Fragment>
      <Header bookShow={false} baseUrl={props.baseUrl} />
      <Heading />
      <ImageList className={classes.grid} cols={6} rowHeight={250}>
        {UpcomingMovies.map(tile => (
          <ImageListItem key={tile.id}>
            <img src={tile.poster_url} alt={tile.title} />
            <ImageListItemBar
              title={tile.title}
              actionIcon={<IconButton aria-label={`star ${tile.title}`} />}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <div className='second'>
        <div className='released'>
          <ImageList rowHeight={350} cols={4}>
            {ReleasedMovies.map((movie) => {
              return (
                <ImageListItem key={movie.id}>
                  <Link to={"/movie/" + movie.id}>
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      style={{
                        width: "100%",
                        alignItems: "center",
                        margin: "0px",
                        cursor: 'pointer'
                      }}
                    />
                  </Link>
                  <ImageListItemBar
                    title={movie.title}
                    subtitle={`Release Date:${moment(movie.release_date).format('ddd MMM DD YYYY')}`}
                  />
                </ImageListItem>
              );
            })}
          </ImageList>
        </div>
        <div className='filter'>
          <div className='cardComponent'>
            <Card className={classes.root}>
              <CardContent>
                <Typography
                  gutterBottom
                  component='h3'
                  className={classes.title}
                >
                  FIND MOVIES BY:
                </Typography>

                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                  <Input
                    id="movieName"
                    onChange={(e) => setMovieName(e.target.value)}
                  />
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-checkbox">
                    Genres
                  </InputLabel>
                  <Select
                    multiple
                    input={<Input id="select-multiple-checkbox-genre" />}
                    renderValue={(selected) => selected.join(",")}
                    value={SelectedGenres}
                    onChange={(e) => setSelectedGenres(e.target.value)}
                  >
                    {GenreList.map((genre) => (
                      <MenuItem key={genre.id} value={genre.genre}>
                        <Checkbox
                          checked={SelectedGenres.indexOf(genre.genre) > -1}
                        />
                        <ListItemText primary={genre.genre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-checkbox">
                    Artists
                  </InputLabel>
                  <Select
                    multiple
                    input={<Input id="select-multiple-checkbox" />}
                    renderValue={(selected) => selected.join(",")}
                    value={SelectedArtists}
                    onChange={(e) => setSelectedArtists(e.target.value)}
                  >
                    {ArtistList.map((artist) => (
                      <MenuItem
                        key={artist.id}
                        value={artist.first_name + " " + artist.last_name}
                      >
                        <Checkbox
                          checked={
                            SelectedArtists.indexOf(
                              artist.first_name + " " + artist.last_name
                            ) > -1
                          }
                        />
                        <ListItemText
                          primary={artist.first_name + " " + artist.last_name}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <TextField
                    id="releaseDateStart"
                    label="Release Date Start"
                    type="date"
                    defaultValue=""
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setStartReleasedDate(e.target.value)}
                  />
                </FormControl>

                <FormControl className={classes.formControl}>
                  <TextField
                    id="releaseDateEnd"
                    label="Release Date End"
                    type="date"
                    defaultValue=""
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setEndReleasedDate(e.target.value)}
                  />
                </FormControl>
                <br />
                <br />
                <FormControl className={classes.formControl}>
                  <Button
                    onClick={() => applyFilterHandler()}
                    variant="contained"
                    color="primary"
                  >
                    APPLY
                  </Button>
                </FormControl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
