import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import App from './components/App';

// Declare routes
const Routes = props => (
  <Router {...props}>
    <Route path="/" component={App} />
  </Router>
);

// Render the router
ReactDOM.render(
  <Routes history={browserHistory} />,
  document.getElementById('root')
);
