//Comment.js
import React, { Component } from 'react';
//import marked from 'marked';
import Moment from 'moment';
import hFunc from './functions_helper';
import FontAwesome from 'react-fontawesome';

class Event extends Component {

  renderSeats(seats){
    if(seats && seats.split(',').length <= 10){
      let seatNodes = seats.split(',').map(s => {
        return(
          <div className='tSeatNode' key={ s }>{ s }</div>
        )
      })
      return seatNodes
    } else if(seats && seats.split(',').length > 10){
      let sArray = seats.split(',')
      if(sArray[0] === '2849' || sArray[0] === 2849){
        console.log(sArray, seats)
      }
      return( <div>
              <div className='tSeatNode' key={ sArray[0] }>{ sArray[0] }</div>
              <div className='tSeatNode' key={ sArray[1] }>{ sArray[1] }</div>
              <div className='tSeatNode' key={ sArray[2] }>{ sArray[2] }</div>
              <div className='tSeatNode' key={ sArray[3] }>{ sArray[3] }</div>
              <div className='tSeatNode' key={ sArray[4] }>{ sArray[4] }</div>
              <div className='tSeatNode' key={ sArray[5] }>{ sArray[5] }</div>
              <div className='tSeatNode' key={ sArray[6] }>{ sArray[6] }</div>
              <div className='tSeatNode' key={ sArray[7] }>{ sArray[7] }</div>
              <div className='tSeatNode' key={ sArray[8] }>...</div>
              <div className='tSeatNode' key={ sArray[sArray.length-1] }>{ sArray[sArray.length-1] }</div>
              </div>
            )
    } else {
      return (<div></div>)
    }
  }

  expand(element){
    console.log(this._reactInternalInstance._hostParent)
  }

  render() {
    Moment.locale('en');
    var dt = new Date(this.props.lastPriceUpdate),
        selected = 'tProps tCheckBox floatRight',
        broadcasting = 'tProps darkGrey',
        costPerTicket = 0,
        listPriceStyle = 'tPricing darkGreen green_bkg'

    if(this.props.seats){
      costPerTicket = this.props.cost / this.props.seats.split(',').length
      if(costPerTicket > this.props.listPrice){
        listPriceStyle = 'tPricing darkOrange orange_bkg'
      }
    }
    if(this.props.selected && this.props.selected.indexOf(this.props.ticketObj) >= 0){
      selected = 'tProps tCheckBox tCheckBoxChecked floatRight'
    }
    broadcasting = this.props.broadcast ? 'tProps brightGreen' : 'tProps darkGrey';

    return (
      <div className='ticketBox'>
        <div>
          <div className='tPropsRow'>
            <div className='tProps tEventTitleBar'>
              <div className='tProps tEventDate'>{ Moment(this.props.eventDate).format('ddd MMM D, YYYY') }</div>
              <div className='tProps tEventTitle'>{ this.props.eventName }</div>
              <div className='tProps tQuickEdit inactive floatRight' onClick={this.props.quickEdit}><FontAwesome name='pencil'/></div>
              <div className={ selected } onClick={this.props.handleTicketCheck}><FontAwesome name='check'/></div>
            </div>
          </div>
          <div className='tPropsRow'>
            <div className={ broadcasting }><FontAwesome name='wifi'/></div>
            <div className='tProps'><FontAwesome name='ticket'/>x { this.props.quantity }</div>
            <div className='tProps tLocSection'>sec: { this.props.section || 'n/a'}</div>
            {hFunc.renderIf(this.props.section !== this.props.row)(<div className='tProps tLocRow'>row: { this.props.row || 'n/a'}</div>)(null)}
            <div className='tProps tSeatList'>{ this.renderSeats(this.props.seats) }</div>
          </div>
          <div className='tPropsRow'>
            <div className='tPricing darkGrey grey_bkg'>{ "Cost: $" + Number(this.props.cost).toFixed(2) } ({ "$" + costPerTicket.toFixed(2) + '/ea' })</div>
            <div className={ listPriceStyle }>{ "List: $" + Number(this.props.listPrice).toFixed(2) }</div>
          </div>
            <div className='tProps tPropsSmall floatLeft'>{ this.props.skyBoxId }</div>
            <div className='tProps tPropsSmall floatRight'>{ "Price Updated: " + Moment(dt).format('ddd MMM d, YYYY') }</div>
        </div>
      </div>
    )
  }
}
export default Event;
