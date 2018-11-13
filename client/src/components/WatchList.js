import React, { Component } from "react";
import { queryMultipleSymbol } from '../apis/stockApi';
import StockInfo from './StockInfo';

export default class WatchList extends Component {

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
        return (<div className="cards">
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