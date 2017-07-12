//Comment.js
import React, { Component } from 'react';
//import marked from 'marked';
import Moment from 'moment';
import FontAwesome from 'react-fontawesome';

class Event extends Component {
  selectTickets(){

   console.log(this.props, this.state)

  }

  renderSeats(seats){
    if(seats){
      let seatNodes = seats.split(',').map(s => {
        return(
          <div className='tSeatNode' key={ s }>{ s }</div>
        )
      })
      return seatNodes
    } else {
      return (<div></div>)
    }
  }

  render() {
    Moment.locale('en');
    var dt = new Date(this.props.lastPriceUpdate),
        selected = 'tProps tCheckBox',
        broadcasting = 'tProps grey',
        location = 'row:',
        locationStyle = 'tLocRow'

    if(this.props.selected && this.props.selected.indexOf(this.props.ticketObj) >= 0){
      selected = 'tProps tCheckBox tCheckBoxChecked'
    }

    broadcasting = this.props.broadcast ? 'tProps green' : 'tProps grey';
    location = isNaN(Number(this.props.row)) ? 'sec: ' : 'row: ';
    locationStyle = isNaN(Number(this.props.row)) ? 'tProps tLocSection' : 'tProps tLocRow';

    //selected = t.skyboxId === this.props.skyBoxId ? 'tProps tCheckBox tCheckBoxChecked' : 'tProps tCheckBox'
    return (
      <div className='ticketBox'>
        <div>

        <div className='tPropsRow'>
          <div className='tProps tEventTitleBar'>
            <div className='tProps tEventDate'>{ Moment(this.props.eventDate).format('ddd MMM D, YYYY') }</div>
            <div className='tProps tEventTitle'>{ this.props.eventName }</div>
            <div className='tProps tQuickEdit' onClick={this.props.quickEdit}><FontAwesome name='pencil'/></div>
            <div className={ selected } onClick={this.props.handleTicketCheck}><FontAwesome name='check'/></div>
          </div>
        </div>

          <div className='tPropsRow'>
            <div className='tProps ticketId'>{ this.props.skyBoxId }</div>
            <div className={ locationStyle }>{ location }{ this.props.row }</div>
            <div className='tProps tSeatList'>{ this.renderSeats(this.props.seats) }</div>
          </div>

          <div className='tPropsRow'>
            <div className={ broadcasting }><FontAwesome name='wifi'/></div>
            <div className='tProps'><FontAwesome name='ticket'/>x { this.props.quantity }</div>
            <div className='tProps'>{ "Seat Type: " + this.props.seatType }</div>
          </div>

          <div className='tPropsRow'>
            <div className='tPricing darkGrey grey_bkg'>{ "Cost: $" + Number(this.props.cost).toFixed(2) }</div>
            <div className='tPricing darkGreen green_bkg'>{ "List: $" + Number(this.props.listPrice).toFixed(2) }</div>
          </div>

            <div className='tProps tPropsSmall floatRight'>{ "Price Updated: " + Moment(dt).format('ddd MMM d, YYYY') }</div>


        </div>
      </div>
    )
  }
}
export default Event;
