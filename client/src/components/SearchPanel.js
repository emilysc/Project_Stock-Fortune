import React, { Component } from "react";

export default class SearchPanel extends Component {
    state = {
        stockCode: "",
        company: ""
    };

    handleInputChange = event => {
        // Destructure the name and value properties off of event.target
        // Update the appropriate state
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        this.props.onSearch(this.state);
    };

    render() {
        return (<div className="card">
            <div className="card-header">
                Search
      </div>
            <div className="card-body">
                <form autoComplete="off">
                    <div className="form-group">
                        <label>Stock Code</label>
                        <input
                            type="text"
                            className="form-control"
                            name="stockCode"
                            value={this.state.stockCode}
                            onChange={this.handleInputChange}
                            disabled={this.state.company.length > 0} />
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Search</button>
                </form>
            </div>
        </div>);
        /*
         <p style={{ textAlign: 'center' }}>or</p>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  className="form-control"
                  name="company"
                  value={this.state.company}
                  onChange={this.handleInputChange}
                  disabled={this.state.stockCode.length > 0} />
              </div>
        */
    }
}
