import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './styles/index.css';
import App from './App';
import Navbar from './components/navbar';
import Article from './components/article';
import Disease from './components/disease';
import Place from './components/place';
import Notfound from './components/notfound'

const routing = (
  <Router>
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/article/:id" component={Article} />
        <Route path="/disease/:id" component={Disease} />
        <Route path="/location/:id" component={Place} />
        <Route component={Notfound} />
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'))