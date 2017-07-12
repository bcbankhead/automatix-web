//Comment.js
import React, { Component } from 'react';
import Moment from 'moment';
//import marked from 'marked';
import Func from './helperFunctions';

class Event extends Component {
  renderRules(rules){
    if(rules.length >0){
      let ruleNodes = rules.map(r => {
        return(
          <div className='tSeatNode' key={ r.id }>{ r.id }</div>
        )
      })
      return ruleNodes
    }
  }

  render() {
    Moment.locale('en');
    var selected = this.props.selected === this.props.stubHubId ? 'eventBox selected' : 'eventBox'
    return (
      <div className={ selected } onClick={this.props.onClick}>
        <div>
          <div className='eventVenue'>{ this.props.venue }</div>
          <div className='eventCount'>
            {Func.renderIf(this.props.venue !== "No Events Found")(<div className='eventCountTitle'>Tickets</div>)(null)}
            <div className='eventCountNumber'>{ this.props.count }</div>
          </div>
        </div>
        {Func.renderIf(this.props.venue !== "No Events Found")(<div className='eventDate'>{ Moment(this.props.date).format('ddd MMM D, YYYY') }</div>)(null)}

        { Func.renderIf(Number(this.props.ticketsInSelection) > 0)(<div className='basicNode darkGreen green_bkg'>{ this.props.ticketsInSelection }</div>)(<div className='basicNode'>&nbsp;</div>)}
      </div>
    )
    //<div className='eventId'>{ this.props.stubHubId }</div>
  }
}
export default Event;
