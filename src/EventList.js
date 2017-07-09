//CommentList.js
import React, { Component } from 'react';
import Event from './Event';
import EventMenu from './EventMenu';

class EventList extends Component {

  render() {
   if(this.props.data.length > 0){
     let eventNodes = this.props.data.map(event => {
       return (
         <Event venue={ event.meta.name }
                date={ event.meta.date }
                count={ event.totalTickets }
                tickets={ event.tickets }
                timezone={ event.meta.timeZone }
                stubHubId={ event.stubHubId }
                onClick={() => this.props.onClick(event.stubHubId, event.tickets)}
                key={ event.stubHubId }
                selected={ this.props.selected }
                ticketsInSelection={ event.ticketsInSelection.length }>
         </Event>
       )
     })
     return (
      <div>
        <EventMenu
          reSort={this.props.reSort}
          filter={this.props.filter}
        />
        <div className='eventPane'>
          { eventNodes }
        </div>
      </div>
     )
   } else {

     return (
      <div>
        <EventMenu
          reSort={this.props.reSort}
          filter={this.props.filter}
        />
          <div className='eventPane'>
          <Event venue='No Events Found' key="0">
          </Event>
          </div>
      </div>
     )
   }
  }
}
export default EventList;
