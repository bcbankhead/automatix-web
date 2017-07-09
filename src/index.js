import React from 'react';
import ReactDOM from 'react-dom';
//import { BrowserRouter } from 'react-router-dom'
import EventWindow from './EventWindow';

//Import Styles
import './style-base-0.css';
import './style-base-topmenu.css';
import './style-event-0.css';
import './style-event-topmenu.css';
import './style-ticket-0.css';
import './style-ticket-modal.css';
import './style-ticket-topmenu.css';


//import registerServiceWorker from './registerServiceWorker';
ReactDOM.render(

    <EventWindow
    url='http://automatix.herokuapp.com/api/v1/inventory'
    />,

  document.getElementById('root')
);
//registerServiceWorker();
// <CommentBox
// url='http://localhost:3001/api/comments'
// />,
// //pollInterval={2000} />,
// document.getElementById('root')
