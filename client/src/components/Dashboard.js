import React, { Component } from "react";
import { queryOneSymbol, queryMultipleSymbol } from '../apis/stockApi';
import { queryWatchList, addSymbolToWatchList, removeSymbolToWatchList } from '../apis/watchListApi';


class SearchPanel extends Component {
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
          <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Search</button>
        </form>
      </div>
    </div>);
  }
}

const quoteColor = (v) => ({ color: v > 0 ? 'green' : 'red' });
class StockInfo extends Component {

  handleAddToWatchList = () => {
    this.props.addToWatchList(this.props.stock.quote.symbol);
  };

  handleRemoveFromWatchList = () => {
    this.props.removeFromWatchList(this.props.stock.quote.symbol);
  };
  render() {
    if (!this.props.stock) {
      return null;
    }
    const quote = this.props.stock.quote;
    const symbol = quote.symbol;
    
    const watched = this.props.symbols && this.props.symbols.indexOf(symbol) !== -1;

    return (<div className="card">
      <div className="card-header">
        {quote.companyName} ({quote.symbol})
    </div>
      <div className="card-body container">
        <div className="row">
          <div className="col-8">
            <h4>
              {quote.latestPrice}
              &nbsp;&nbsp;
                <small style={quoteColor(quote.change)}>
                {quote.change} ({parseFloat(quote.changePercent * 100).toFixed(2)}%)
                </small>
            </h4>
            <h6><small>{quote.latestSource} {quote.latestTime}</small></h6>
            <h6><small>Open: {quote.open}</small></h6>
            <h6><small>Close: {quote.close}</small></h6>
            <h6><small>52 Week: {quote.week52Low} - {quote.week52High}</small></h6>
            {this.props.removeFromWatchList && <div><button onClick={this.handleRemoveFromWatchList} className="btn btn-primary">Remove</button></div>}
            {!watched && this.props.addToWatchList && <div><button onClick={this.handleAddToWatchList} className="btn btn-primary">Add</button></div>}
          </div>
          <div className="col-4" style={{ display: 'flex', alignItems: 'center' }}>
            <div><img src={this.props.stock.logo.url} width="80" /></div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

class WatchList extends Component {

  state = {
    stocks: []
  }

  refresh = (symbols) => {
    if (symbols.length === 0) {
      this.setState({ stocks: [] });
      return;
    }
    queryMultipleSymbol(symbols).then((stocks) => {
      this.setState({ stocks: Object.values(stocks) });
    });
  }

  removeFromWatchList = (symbol) => {
    this.props.removeFromWatchList(symbol);
  }

  componentDidUpdate(prevProps) {
    if (!Object.is(prevProps, this.props)) {
      this.refresh(this.props.symbols);
    }
  }

  componentDidMount() {
    this.refresh(this.props.symbols);
  }

  render() {
    return (
      <div className="cards">
        {this.state.stocks.map((stock) => {
          return <StockInfo
            key={stock.quote.symbol}
            stock={stock}
            removeFromWatchList={this.removeFromWatchList}
          />;
        })}
      </div>);
  }
}
class Dashboard extends Component {

  state = {
    watchList: []
  };

  handleSearch = ({ stockCode, companyName }) => {
    if (stockCode.length > 0) {
      queryOneSymbol(stockCode).then((stock) => {
        this.setState({ stockSearching: stock });
      });
    }
  };

  handleAddToWatchList = (symbol) => {
    if (this.state.watchList.indexOf(symbol) !== -1) {
      return;
    }

    addSymbolToWatchList('default', symbol)
      .then(() => {
        this.setState((state) => ({
          watchList: [symbol, ...state.watchList]
        }));
      }, (error) => {
        alert("API error, unable to fetch add new symbol.");
      });
  }

  handleRemoveFromWatchList = (symbol) => {
    const index = this.state.watchList.indexOf(symbol);
    if (index === -1) {
      return;
    }

    removeSymbolToWatchList('default', symbol)
      .then(() => {
        this.setState((state) => {
          const updated = [...this.state.watchList];
          updated.splice(index, 1)
          return { watchList: updated };
        });
      }, (error) => {
        alert("API error, unable to fetch remove symbol.");
      });
  }

  componentDidMount() {
    queryWatchList('default')
      .then((watchList) => {
        this.setState({ watchList })
      }, (error) => {
        alert("API error, unable to fetch watch list items.");
      });
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col">
              <SearchPanel onSearch={this.handleSearch} />
            </div>
            <div className="col">
              <StockInfo 
                stock={this.state.stockSearching}
                addToWatchList={this.state.watchList.indexOf(this.state.stockSearching) === -1 && this.handleAddToWatchList}
                symbols={this.state.watchList}
              />
            </div>
          </div>
        </div>
        <br />
        <div className="container">
          <WatchList symbols={this.state.watchList} removeFromWatchList={this.handleRemoveFromWatchList} />
        </div>
      </div>
    );
  }
}

export default Dashboard;
