import React, { Component } from "react";
import { queryOneSymbol, queryMultipleSymbol } from '../apis/stockApi';
import { queryWatchList, addSymbolToWatchList, removeSymbolToWatchList } from '../apis/watchListApi';
import SearchPanel from './SearchPanel';
import StockInfo from './StockInfo';
import WatchList from './WatchList';

import "./Dashboard.css";

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
            <div className="col-12 col-md-6">
              <SearchPanel onSearch={this.handleSearch} />
            </div>
            <div className="col-12 col-md-6">
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
          <p>Watching {this.state.watchList.length} stocks.</p>
          <WatchList symbols={this.state.watchList} removeFromWatchList={this.handleRemoveFromWatchList} />
        </div>
      </div>
    );
  }
}

export default Dashboard;
