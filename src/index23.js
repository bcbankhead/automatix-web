import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './style.css';

ReactDOM.render(
  <Router>
    <Route path="/" component={Root}>

    </Route>
  </Router>, document.getElementById('root'))
  //
  // <IndexRoute component={App} />
  // <Route path="/post/:id" component={ParamsExample} />
  // <Route path="/query" component={QueryExample} />
  // <Route path="programmatic" component={ProgrammaticExample} />
  // <Route path="*" component={FourOFour}/>
