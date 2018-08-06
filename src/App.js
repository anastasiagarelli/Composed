import React, { Component } from 'react';
import './App.css';


class App extends Component {
  constructor () {
    super()
    this.state = {
      token: "",
      deviceId: "",
      loggedIn: false,
      error: "",
      trackName: "--",
      artistName: "--",
      albumName: "--",
      playing: false,
      position: 0,
      duration: 0,
      checkInterval: null
    }
    this.playerCheckInterval = null;
  }

  handleOnClick (evt) {
    if (this.state.token !== "") {
      this.setState({ loggedIn: true });
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
  }

  checkForPlayer() {
    const { token } = this.state;

    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "Anastasia's Spotify API Player",
        getOAuthToken: cb => { cb(token); },
      });
      this.createEventHandlers();
      this.player.connect();
    }
  }

  createEventHandlers() {
    this.player.on('initialization_error', err => {console.error(err)})
    this.player.on('authentication_error', err => {console.error(err)
      this.setState({ loggedIn: false})
    })
    this.player.on('account_error', err => {console.error(err)})
    this.player.on('playback_error', err => { console.error(err) })
    this.player.on('player_state_changed', state => this.onStateChanged(state))
    this.player.on('ready', data => {
      let { device_id } = data
      console.log("Woop!!")
      this.setState({ deviceId: device_id })
    })
  }

  onStateChanged(state) {
    console.log('STATE:', state)
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      // const currentTrack = state.track_window
      // const position = currentTrack.position
      // const duration = currentTrack.duration
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists.map(artist => artist.name).join(", ")
      const playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing
      })
    }
  }

  handleOnClickPrev() {
    this.player.previousTrack();
  }

  handleOnClickPlay() {
    this.player.togglePlay();
  }

  handleOnClickNext() {
    this.player.nextTrack();
  }

  render() {

    return (
      <div className="App">
        <div className="App-header">
          <h1 className="tracking-in-expand-fwd">Composition</h1>
        </div>
          {
            !this.state.loggedIn ?
            <p>Please enter your Spotify access token to get started. <br />
            If you need help, you can find it{" "}
            <a href="https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify">
            here
            </a>. <br />
            <input className="token-input" type="text" value={this.state.token} onChange={evt => this.setState({ token: evt.target.value })} /><br />
            <button type="submit" class="btn btn-secondary" onClick={() => this.handleOnClick()}>Submit</button>
            </p> :
            <div>
              <h2>Currently Playing</h2>
              <p>Artist: {this.state.artistName}</p>
              <p>Track: {this.state.trackName}</p>
              <p>Album: {this.state.albumName}</p><br />
              <p>
                <button type="button" className="btn btn-secondary" onClick={() => this.handleOnClickPrev()}>Previous</button>
                <button type="button" className="btn btn-secondary" onClick={() => this.handleOnClickPlay()}>{this.state.playing ? "Pause" : "Play"}</button>
                <button type="button" className="btn btn-secondary" onClick={() => this.handleOnClickNext()}>Next</button>
              </p>
              <span className="dot"></span>
            </div>

          }

      </div>
    )
  }
}

export default App;





