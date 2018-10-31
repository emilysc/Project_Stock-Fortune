import React, { Component } from "react";
import Jumbotron from "../Jumbotron";
import Home from "../Home";
import Saved from "../Saved";
import axios from 'axios';

const fetchSavedArticles = () => {
  return axios.get('/api/articles', {})
    .then(res => {
      if (res.status !== 200) {
        throw new Error("API error");
      }
      return res.data;
    })
}

class Dashboard extends Component {
  state = {
    savedArticles: []
  };

  componentDidMount() {
    this.refreshSavedArticles();
  }

  refreshSavedArticles = _ => {
    fetchSavedArticles().then((articles) => {
      this.setState({ savedArticles: articles });
    })
  };


  render() {
    return (
      <div>
        <Jumbotron />
        <div className="container">
          <Home refreshSavedArticles={this.refreshSavedArticles} />
          <br />
          <Saved savedArticles={this.state.savedArticles} refreshSavedArticles={this.refreshSavedArticles} />
        </div>
      </div>
    );
  }
}

export default Dashboard;
