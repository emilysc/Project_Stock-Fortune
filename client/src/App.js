import React, { Component } from "react";
import Dashboard from "./components/Dashboard";
import Jumbotron from "./components/Jumbotron";
import axios from 'axios';

class App extends Component {
  state = {
    user: undefined
  };

  componentDidMount() {
    axios.get('/api/users/me')
      .then(res => {
        this.setState({ user: res.data })
      }, (error, res) => {
        if (error.response.status === 403) {
          this.setState({ user: null });
        }
        console.log(error);
      });
  }

  render() {
    let content;
    if (this.state.user) {
      content = <Dashboard user={this.state.user} />;
    } else if (this.state.user === null) {
      content = <div><a class="btn btn-primary" href="/auth/google" role="button">Login with Google</a></div>
    } else {
      content = <div>Now loading...</div>;
    }
    return (
      <div>
        <Jumbotron user={this.state.user} />
        <div className="container">
          {content}
        </div>
      </div>
    );
  }
}

export default App;
