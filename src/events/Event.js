//Comment.js
import React, { Component } from 'react';
import Moment from 'moment';
//import marked from 'marked';
import hFunc from '../funcLib/functions_helper';

class Event extends Component {
  renderRules(rules){
    if(rules && rules.length >0){
      let ruleNodes = rules.map((r,i) => {
        let active = 'basicNode inactive'
        if(r.state === 'active'){
          active = 'basicNode active darkGreen'
        }
        return(
          <div className='ruleContainer' key={ r.ruleId }>
            <div className={ active } >{ i + 1 }</div>
          </div>
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
            {hFunc.renderIf(this.props.venue !== "No Events Found")(<div className='eventCountTitle'>Tickets</div>)(null)}
            <div className='eventCountNumber'>{ this.props.count }</div>
          </div>
        </div>
        {hFunc.renderIf(this.props.venue !== "No Events Found")(<div className='eventDate'>{ Moment(this.props.date).format('ddd MMM D, YYYY') }</div>)(null)}
        { this.renderRules(this.props.rules) }
      </div>
    )
    //<div className='eventId'>{ this.props.stubHubId }</div>
  }
}
export default Event;
