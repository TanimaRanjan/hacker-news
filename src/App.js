import React from "react";
import "./App.css";
import Search from "./Search";
import Table from "./Table";
import Button from "./Button";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "100";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null
    };
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({
      searchKey: searchTerm
    });
    this.fetchTopStories(searchTerm);
  }

  onSearchChange = event => {
    this.setState({
      searchTerm: event.target.value
    });
  };

  fetchTopStories = (searchTerm, page = 0) => {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(response => response.json())
      .then(result => this.onSearchTopStories(result))
      .catch(error => error);
  };

  onSearchTopStories = result => {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    // Get all the hits from before
    // append more results to this when more is pressed
    const oldHits = results && result[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  };

  onDismiss = id => {
    //  const isNotID = item = item.objectID !== id

    const updatedList = this.state.result.hits.filter(item => {
      return item.objectID !== id;
    });

    let updatedResult = { ...this.state.result, hits: updatedList };
    this.setState({
      result: updatedResult
    });
  };

  onIsSearchNeeded = searchTerm => {
    return !this.state.results[searchTerm];
  };
  
  onSearchSubmit = event => {
    event.preventDefault();
    const { searchTerm } = this.state;
    this.setState({
      searchKey: searchTerm
    });
    // Only search if new key is given
    if (this.onIsSearchNeeded(searchTerm)) {
      this.fetchTopStories(searchTerm);
    }
  };

  render() {
    const { searchTerm, results, searchKey, error } = this.state;

    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;

    const result =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="iteractions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>

          {error ? (
            <div className="interactions">Something went wrong</div>
          ) : (
            <Table
              list={result}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
            />
          )}

          <div className="interactions">
            <Button
              onClick={() => {
                this.fetchTopStories(result, page + 1);
              }}
            >
              More
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
