import React from 'react';
import axios from 'axios';



export default class Saved extends React.Component {

    handleRemoveButtonClicked = e => {
        e.preventDefault();
        const { name } = e.target;

        return axios.delete(`/api/articles/${name}`).then(res => {
            this.props.refreshSavedArticles();
        })
    }
    render() {
        return (<div>
            <div className="card">
                <div className="card-header">
                    Saved Articles
                </div>
                <ul className="list-group list-group-flush">
                    {this.props.savedArticles.map((article) => (
                        <li key={article._id}
                            className="list-group-item d-flex justify-content-between align-items-center">
                            <a href={article.url} target="_blank">{article.title}</a>
                            <button
                                type="button"
                                className="btn btn-primary"
                                name={article._id}
                                onClick={this.handleRemoveButtonClicked}>Remove</button>
                        </li>))}
                </ul>
            </div>
        </div>);
    }
}