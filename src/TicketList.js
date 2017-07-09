//CommentList.js
import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group' // ES6

import TicketGroup from './TicketGroup';
import TicketMenu from './TicketMenu';

class TicketList extends Component {
  render() {
   if(this.props.data.length > 0){
     let ticketNodes = this.props.data.map(t => {
       return (
         <TicketGroup
                broadcast={ t.broadcast }
                eventName={ t.event.name }
                cost={ t.cost }
                faceValue={ t.faceValue }
                highSeat={ t.highSeat }
                lastPriceUpdate={ t.lastPriceUpdate }
                eventDate={ t.eventDate }
                listPrice={ t.listPrice }
                lowSeat={ t.lowSeat }
                quantity={ t.quantity }
                row={ t.row }
                section={ t.section }
                seatType={ t.seatType }
                seats={ t.seats }
                selected={this.props.selected}
                stubhubEventId={ t.event.stubhubEventId }
                totalTickets={ t.totalEventTickets }
                ticketObj={ t }
                skyBoxId={ t.skyboxId }
                key={ t.skyboxId }
                globalEdit={() => this.props.globalEdit(null,null)}
                quickEdit={() => this.props.quickEdit(t.stubhubEventId, t)}
                handleTicketCheck={() => this.props.handleTicketCheck(t.event.stubhubEventId, t)}
                >
         </TicketGroup>
       )
     })

     return (
       <div>
         <TicketMenu selected={this.props.selected} globalEdit={this.props.globalEdit} handleDeselectAllTickets={this.props.handleDeselectAllTickets}/>
         <div className='ticketPane'>
           <CSSTransitionGroup
            transitionName="ticketBox"
            transitionEnterTimeout={750}
            transitionLeaveTimeout={10}
            transitionAppear={true}
            transitionAppearTimeout={250}>
            { ticketNodes }
           </CSSTransitionGroup>
         </div>
        </div>
     )
   } else {

     return (
        <div>
          <TicketMenu selected={this.props.selected} globalEdit={this.props.globalEdit} handleDeselectAllTickets={this.props.handleDeselectAllTickets}/>
          <div className='ticketPane'>
            <div className='ticketBox'>
              <div>
                <div className='tPropsRow'>
                  <div className='tProps tLocSection'>Select an event from the left...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
     )
   }
  }
}
export default TicketList;
