import React, { Component } from "react";

const quoteColor = (v) => ({ color: v > 0 ? 'green' : 'red' });
export default class StockInfo extends Component {

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
        </div>);
    }
}
