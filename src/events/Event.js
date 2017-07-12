//Comment.js
import React, { Component } from 'react';
import Moment from 'moment';
//import marked from 'marked';
import hFunc from '../funcLib/functions_helper';

class Event extends Component {
  renderRules(tickets){
    let activeRules = {}, inActiveRules = {}, totalActive = 0, totalInActive = 0
    if(tickets){
      tickets.forEach(t =>{
        if(t.rule && t.rule.id){
          t.rule.price_updates.forEach(p =>{
            if(p.state === 'active'){
              activeRules[t.rule.id] = 1
            }
            if(p.state === 'inactive'){
              inActiveRules[t.rule.id] = 1
            }
          })
        }
        for(var key in activeRules){
          if(inActiveRules[key]){
            delete inActiveRules[key]
          }
        }
        totalActive = Object.keys(activeRules).length;
        totalInActive = Object.keys(inActiveRules).length;
      })

      if(totalActive > 0 && totalInActive > 0){
        return(
          <div>
          <div className='basicNode active darkGreen'>Active: { totalActive }</div>
          <div className='basicNode inactive'>Inactive: { totalInActive }</div>
          </div>
        )
      }
      if(totalActive > 0 && totalInActive === 0){
        return(
          <div>
          <div className='basicNode active darkGreen'>{ totalActive }</div>
          </div>
        )
      }
      if(totalActive === 0 && totalInActive > 0){
        return(
          <div>
          <div className='basicNode inactive '>{ totalInActive }</div>
          </div>
        )
      }
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
        { this.renderRules(this.props.tickets) }
      </div>
    )
    //<div className='eventId'>{ this.props.stubHubId }</div>
  }
}
export default Event;
