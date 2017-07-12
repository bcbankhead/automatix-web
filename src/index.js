import React from 'react';
import ReactDOM from 'react-dom';
//import { BrowserRouter } from 'react-router-dom'
import EventWindow from './events/EventWindow';

//Import Styles
import './style-base-0.css';
import './style-base-topmenu.css';
import './events/style-event-0.css';
import './events/style-event-topmenu.css';
import './tickets/style-ticket-0.css';
//import './style-ticket-modal.css';
import './tickets/style-ticket-topmenu.css';


//import registerServiceWorker from './registerServiceWorker';
ReactDOM.render(

    <EventWindow/>,

  document.getElementById('root')
);
//registerServiceWorker();
// <CommentBox
// url='http://localhost:3001/api/comments'
// />,
// //pollInterval={2000} />,
// document.getElementById('root')
