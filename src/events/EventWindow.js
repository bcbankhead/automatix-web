//CommentBox.js
import React, { Component } from 'react';

import axios from 'axios';
import EventList from './EventList';
import TicketList from '../tickets/TicketList';
import ModalComponents from '../modals/Modals';

//import CommentForm from './CommentForm';
//import { Router, Route } from 'react-router';

import Moment from 'moment';
import 'moment-timezone';

import dataLocal from '../data/data-tickets'; //comment to use data from source
import dataRules from '../data/data-rules'; //comment to use data from source
import freshRule from '../data/data-freshRule'; //comment to use data from source

class EventWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allEvents : [],
      filteredEvents : [],
      ticketGroups : [],
      selectedEvent: '',
      selectedTickets: [],
      newRule:false,
      modalType: '',
      modalOpen: false
    };
    //local functions bound to this EventWindow
    this.loadDataFromServer = this.loadDataFromServer.bind(this);

  }
  componentDidMount() {
    this.loadDataFromServer();
    //removes setInterval timing
    //setInterval(this.loadDataFromServer, this.props.pollInterval);
  }

  changeEvent(stubHubId, tickets){
    this.setState({ ticketGroups: tickets,
                    selectedEvent: stubHubId
                  })
  }

  loadDataFromServer() {
    /*
      get data from endpoint, then parse data for use in application.
    */
    /*
    axios.get('http://automatix.herokuapp.com/api/v1/inventory')
    .then(dataInventory => {
     this.parseData(dataInventory.data.data)
    })
    */
    //Local Data:
    this.parseData(dataLocal)
  }

  parseData(inputData){
    /*
      Denormalize data:
      Find all unique events and store them in an object called eventArray
      event raw data is converted into a new model:
        meta data is the actual event data some of it re-formatted for front end use.
    */
    let eventArray = {}, allTickets = [], allEvents = []
    inputData.forEach(e => {
      let r = e.ticketGroup,
          thisRow = {};
      for(var key in r){
          thisRow[key] = r[key];
          if(key === 'event'){
            thisRow.eventDate = Moment.tz(r.event.date, 'MM/DD/YYYY', r.event.venue.timezone).format();
          }
          thisRow.selected = false;
          thisRow.rule = {}
      }
      if(!eventArray[r.event.stubhubEventId]){
        eventArray[r.event.stubhubEventId] = {}
        eventArray[r.event.stubhubEventId].meta = {}
        eventArray[r.event.stubhubEventId].meta.date = Moment.tz(r.event.date, 'MM/DD/YYYY', r.event.venue.timezone).format()
        eventArray[r.event.stubhubEventId].meta.date_ISO = Moment.tz(r.event.date, 'MM/DD/YYYY', r.event.venue.timezone).format('ddd MMM D, YYYY')
        eventArray[r.event.stubhubEventId].meta.name = r.event.name
        eventArray[r.event.stubhubEventId].meta.venueCity  = r.event.venue.city
        eventArray[r.event.stubhubEventId].meta.venueState = r.event.venue.state
        eventArray[r.event.stubhubEventId].meta.venueName  = r.event.venue.name
        eventArray[r.event.stubhubEventId].meta.timeZone  = r.event.venue.timezone
        eventArray[r.event.stubhubEventId].stubHubId = r.event.stubhubEventId
        //eventArray[r.event.stubhubEventId].rules = []
        eventArray[r.event.stubhubEventId].ticketsInSelection = []
        //eventArray[r.event.stubhubEventId].activeRules = []
        eventArray[r.event.stubhubEventId].ticketIDs = []
        eventArray[r.event.stubhubEventId].tickets = [thisRow]
        allTickets.push(thisRow)
      } else {
        eventArray[r.event.stubhubEventId].tickets.push(thisRow)
        allTickets.push(thisRow)
      }
    })
    for(var key in eventArray){
      let totalEventTickets = 0
      for(var i = 0; i < eventArray[key].tickets.length; i++){
        totalEventTickets += eventArray[key].tickets[i].quantity
      }

      eventArray[key].totalTickets = totalEventTickets
      allEvents.push(eventArray[key])
    }
    allEvents = allEvents.sort((a,b) => {return (a.meta.date > b.meta.date) ? 1 : ((b.meta.date > a.meta.date) ? -1 : 0); })
    allTickets = allTickets.sort((a,b) => { return (a.eventDate > b.eventDate) ? 1 : ((b.eventDate > a.eventDate) ? -1 : 0);})
    allEvents.forEach(e =>{
      e.tickets.forEach(t =>{
        e.ticketIDs.push(t.skyboxId)
      })
    })
    this.setState(
      {
        ticketGroups: [],
        allEvents: allEvents,
        filteredEvents: allEvents,
        selectedEvent: '',
        selectedTicket: ''
      }, () => {
        // axios.get('http://automatix.herokuapp.com/api/v1/getRules')
        // .then(dataRules => {
        this.parseRules(dataRules)
        //}
      }
    )
  }

  parseRules(rules, skyboxId){
    /*
      Loops through allEvents, and their ticket arrays, if there is a match
      to a rule via skyBoxId/vivd_id, then the ticket's rule is set.
      this also insures all tickets have either a blank rule, or an assigned rule.
    */
    let allEvents = this.state.allEvents.slice();
    allEvents.forEach(event=>{
      //event.rules =[] //initialize array, future: update only required rule.
      rules.forEach(rule =>{
        if(rule.stubhub_event_id === event.stubHubId){
          event.tickets.forEach(ticket => {
            ticket.rule = ticket.rule || {}
            if(ticket.skyboxId === rule.vivid_id){
              ticket.rule = rule
              // event.rules.push(
              //   {
              //     ruleId: rule.id,
              //     currPrice: rule.price_updates[rule.price_updates.length -1].current_price,
              //     startPrice: rule.starting_price,
              //     lastUpdate: rule.price_updates[rule.price_updates.length -1].updated_at,
              //     reprice_interval: rule.price_updates[rule.price_updates.length -1].reprice_interval,
              //     state: rule.price_updates[rule.price_updates.length -1].state,
              //   }
              // )
            }
          })
        }
      })
    })
    this.setState({
        allEvents: allEvents,
        filteredEvents: allEvents,
        selectedTicket: skyboxId || ''
    })
  }

  quickEdit(stubHubId, ticketGroup){
    /*
      quickEdit is triggered by the 'pencil' or 'plus' icon in the ticket list.
      If a rule exists, then we simply update the active ticket group,
      if a rule does not exist, then we make a post request to generate a new rule
      upon completion, we then update the state to include the rule in the associated
      ticket group.
    */
    let lastClickedTicket = this.state.selectedTicket
        lastClickedTicket = ticketGroup.skyboxId === lastClickedTicket ? '' : lastClickedTicket = ticketGroup.skyboxId
    console.log(stubHubId, ticketGroup)
    /*
      Sense we've initialized all ticketGroups to have an empty || existing rule,
      we simply check if there is an id, if there isn't we now know we need to
      make a new rule for the selected ticket.
    */
    if(!ticketGroup.rule.id){
      //first we define the POST payload.
      let ruleObject = {}
      ruleObject.vivid_id = ticketGroup.skyboxId
      ruleObject.stubhub_event_id = ticketGroup.event.stubhubEventId
      ruleObject.event_date = ticketGroup.eventDate
      ruleObject.section_name = ticketGroup.section
      ruleObject.row = ticketGroup.row
      ruleObject.seats = ticketGroup.seats
      ruleObject.split = "2"
      ruleObject.starting_price = ticketGroup.listPrice
      ruleObject.starting_quantity = ticketGroup.quantity

      //then we post to the ticket_groups endpoint
      /*
      axios.post('https://automatix.herokuapp.com/api/v1/ticket_groups/', { ticket_groups: ruleObject })
      .then(res => {
        console.log(res)
      */

      //this may be moved to an external function depending on
      //how the active toggle and refresh works.

      //create shallow copy of state allEvents and filteredEvents
      let allEvents = this.state.allEvents.slice(),
          filteredEvents = this.state.filteredEvents.slice();

      //first we update allEvents
      allEvents.forEach(e =>{
       if(e.stubHubId === stubHubId){
         e.tickets.forEach(t =>{
           if(t.skyboxId === ticketGroup.skyboxId){
             //this would be res.body.data or some such instead of freshRule[0]
             t.rule = freshRule[0]
           }
         })
       }
      })

      //then we update the filtered events
      filteredEvents.forEach(e =>{
       if(e.stubHubId === stubHubId){
         e.tickets.forEach(t =>{
           if(t.skyboxId === ticketGroup.skyboxId){
             t.rule = freshRule[0]
           }
         })
       }
      })

      //update the state with the new data.
      this.setState({
                      selectedTicket: lastClickedTicket,
                      allEvents: allEvents,
                      filteredEvents: filteredEvents,
                    }, () => {
                      console.log(this.state)
                    })
      /*
      })
      */


    } else {
      //otherwise, the user clicked on a ticket group with
      //an existing rule: update the selected ticket ID
      this.setState({
                      selectedTicket: lastClickedTicket,
                    }, () => {
                      console.log(this.state)
                    })
    }
  }

  handleRuleState(stubHubId, ticketGroup){

    if(ticketGroup.rule.price_updates){
      ticketGroup.rule.price_updates[ticketGroup.rule.price_updates.length - 1].state = ticketGroup.rule.price_updates[ticketGroup.rule.price_updates.length - 1].state === 'active' ? 'inactive' : 'active'
      //update database
      /*
      axios.post('https://automatix.herokuapp.com/api/v1/ticket_groups/', set new active state)
      .then(res => {
      axios.get('http://automatix.herokuapp.com/api/v1/getRules')
      .then(dataRules => {

      this.parseRules(dataRules, ticketGroup.skyboxId )
      */
        //update state (doing manually here, parseRules will update state)
        this.setState({
                        selectedTicket: ticketGroup.skyboxId
                      }, () => {
                        console.log(this.state)
                      })
      /*
        }
      })
      */
    } else {
      //create new ticket group rule
      //update database
      /*
      axios.post('https://automatix.herokuapp.com/api/v1/ticket_groups/', set new active state)
      .then(res => {
        console.log(res)
        //update state
        this.setState({
                        selectedTicket: ticketGroup
                      }, () => {
                        console.log(this.state)
                      })
      })
      */
    }
  }



  handleRuleRefresh(ticketGroup){
    /*
      when a user clicks 'update' on the selected ticket group
      this function will make the requisite POST or PATCH to update
      the needed ticket rule.
    */
    console.log('refresh a rule')
    console.log(ticketGroup)
  }

  filter(e, filterType){
    let dataSet = filterType === 'events' ? this.state.filteredEvents : this.state.selectedTickets,
        filteredSet = []
    if(e.target.value && e.target.value.length >= 2){
      let updatedList = dataSet.slice(),
          target = e.target.value.toLowerCase()

      updatedList.forEach(item => {
        for(var key in item.meta){
          if(item.meta[key].toLowerCase().indexOf(target) >= 0 ){
            if(filteredSet.indexOf(item) <0){
              filteredSet.push(item)
            }
          }
        }
      });
      this.setState({filteredEvents: filteredSet});
    } else {
      this.setState({filteredEvents: this.state.allEvents});
    }
  }

  /* Start: Unused Functions **************************************************************/

  updateArrays(array, thisTicketId, remove){
    /*
      Unused sub function to handle addition/removal of tickets in
      eventual multi-ticketGroup selections
    */
    array.forEach(e =>{
      if(e.ticketIDs.indexOf(thisTicketId) >= 0){
        if(e.ticketsInSelection.indexOf(thisTicketId)<0){
          e.ticketsInSelection.push(thisTicketId)
        }
      }
    })
    array.forEach(e =>{
      if(e.ticketIDs.indexOf(thisTicketId) >= 0 && remove){
        e.ticketsInSelection.splice(e.ticketsInSelection.indexOf(thisTicketId),1)
      }
    })
  }

  handleTicketCheck(stubHubId, ticket){
    /*
      currently, this function does it get called but will be used for
      handling multi-ticketGroup selections.
    */
    var remove = false
    let selectedTicketArray = this.state.selectedTickets.slice(),
        eventArray = this.state.allEvents.slice(),
        filteredArray = this.state.filteredEvents.slice(),
        thisTicketId = ticket.skyboxId

    if(selectedTicketArray.indexOf(ticket) < 0){
      selectedTicketArray.push(ticket)
    } else {
      selectedTicketArray.splice(selectedTicketArray.indexOf(ticket), 1)
      remove = true
    }

    this.updateArrays(eventArray, thisTicketId, remove)
    this.updateArrays(filteredArray, thisTicketId, remove)

    this.setState({
                    selectedTickets: selectedTicketArray,
                    allEvents: eventArray,
                    filteredEvents: filteredArray
                  })
  }

  handleDeselectAllTickets(){
    /*
      currently, this function does it get called but will be used for
      deselecting multi-ticketGroup selections.
    */
    let eventArray = this.state.allEvents.slice(),
        filteredArray = this.state.filteredEvents.slice()
    eventArray.forEach(e =>{
      e.ticketsInSelection = []
    })
    filteredArray.forEach(e =>{
      e.ticketsInSelection = []
    })
    this.setState({
                    selectedTickets: []
                  })
  }

  reSort(){
    /*
      reverses event list sorting by date.
    */
    let reversedArray = this.state.filteredEvents.slice().reverse()
    this.setState({
                    filteredEvents :  reversedArray
                  })
  }

//Modal Functions ========================================
  openModal() {
    this.setState({modalOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalOpen: false});
  }
//End Modal Functions ========================================


/* End: Unused Functions ***************************************************************/

  render() {
    //
    return (
      <div className='interface'>
        <div className="logoBar"><img src="./images/automatixLogo.png" alt="logo"/>
          <div className='logo'>AUTOMATIX</div>
          <div className='topMenu floatRight'>
            <div className="topMenuItemRow">
              <div className='topMenuItem'>Menu Item 1</div>
            </div>
          </div>
        </div>

          <div className='eventWindow'>
            <EventList
              data={ this.state.filteredEvents }
              reSort={() => this.reSort()}
              filter={(e,type) => this.filter(e,'events')}
              selected={ this.state.selectedEvent }
              onClick={(stubHubId, tickets) => this.changeEvent(stubHubId, tickets)}
            />
          </div>
          <div className='ticketWindow'>
            <TicketList
              data={ this.state.ticketGroups } selected={ this.state.selectedTicket }
              globalEdit={ () => this.quickEdit(null, null) }
              quickEdit={ (stubHubId, ticket) => this.quickEdit(stubHubId, ticket) }
              handleTicketCheck={ (stubHubId, ticket) => this.handleTicketCheck(stubHubId, ticket) }
              handleRuleState={ (stubHubId, ticket) => this.handleRuleState(stubHubId, ticket) }
              handleRuleRefresh={ this.handleRuleRefresh }
              handleDeselectAllTickets={ () => this.handleDeselectAllTickets() }
            />
          </div>
          <ModalComponents
            modalOpen={this.state.modalOpen}
            modalType={this.state.modalType}
            selected={ this.state.selectedTickets }
            handleTicketCheck={ (stubHubId, ticket) => this.handleTicketCheck(stubHubId, ticket) }
            closeModal={() => this.closeModal() }
          />
      </div>
    )
  }
}
export default EventWindow;
