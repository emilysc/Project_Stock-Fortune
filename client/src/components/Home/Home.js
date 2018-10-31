import React from 'react';
import axios from 'axios';

const fetchNYT = ({ topic, startYear, endYear }) => {
    return axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json', {
        params: {
            "api-key": "b9f91d369ff59547cd47b931d8cbc56b:0:74623931",
            'q': topic,
            'begin_date': `${startYear}0101`,
            'end_date': `${endYear}1231`
        }
    }).then(res => {
        if (res.status !== 200) {
            throw new Error("API error");
        }
        return res.data.response.docs;
    })
}

const fetchSavedArticles = () => {
    return axios.get('/api/articles', {});
}

/*
 This component should be able to query the NYT API for articles. 
 It displays the results from the API search in a rendered list that 
 displays the article title, publication date, 
 and allows the user to visit an article's url or save the article to the MongoDB.
*/
export default class Home extends React.Component {
    state = {
        topic: "",
        startYear: new Date().getFullYear() - 1,
        endYear: new Date().getFullYear(),
        documents: [],
        savedArticles: []
    };

    handleInputChange = event => {
        // Destructure the name and value properties off of event.target
        // Update the appropriate state
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleSearch = e => {
        e.preventDefault();
        fetchNYT(this.state).then((documents) => {
            this.setState({
                documents: documents.map((document) => ({
                    'id': document._id,
                    'title': document.headline.main,
                    'url': document.web_url,
                    'date': new Date(document.pub_date).toISOString()
                }))
            });
        })
    };

    handleSaveButtonClicked = e => {
        e.preventDefault();
        const { name } = e.target;
        const documentToSave = this.state.documents.find((doc) => doc.id === name);
        if (!documentToSave) {
            throw new Error("document not found");
        }

        return axios.post('/api/articles', { ...documentToSave }).then(res => {
            this.props.refreshSavedArticles();
        })
    }
    componentDidMount() {
        fetchSavedArticles().then((articles) => {
            this.setState({ savedArticles: articles });
        })
    }
    render() {
        return (<div>
            <div className="card">
                <div className="card-header">
                    Search
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label>Topic</label>
                            <input type="text"
                                className="form-control"
                                name="topic"
                                value={this.state.topic}
                                onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Start year</label>
                            <input type="number"
                                className="form-control"
                                name="startYear"
                                value={this.state.startYear}
                                onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>End year</label>
                            <input type="number"
                                className="form-control"
                                name="endYear"
                                value={this.state.endYear}
                                onChange={this.handleInputChange} />
                        </div>
                        <button type="submit" className="btn btn-primary" onClick={this.handleSearch}>Search</button>
                    </form>
                </div>
            </div>

            <br />
            <div className="card">
                <div className="card-header">
                    Result
                </div>
                <ul className="list-group list-group-flush">
                    {this.state.documents.map((document) => (
                        <li key={document.id}
                            className="list-group-item d-flex justify-content-between align-items-center">
                            {document.title}
                            <button
                                type="button"
                                className="btn btn-primary"
                                name={document.id}
                                onClick={this.handleSaveButtonClicked}>Save</button>
                        </li>))}
                </ul>
            </div>
        </div>);
    }
}