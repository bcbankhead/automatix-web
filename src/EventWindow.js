//CommentBox.js
import React, { Component } from 'react';

import axios from 'axios';
import EventList from './EventList';
import TicketList from './TicketList';
import ModalComponents from './Modals';

//import CommentForm from './CommentForm';
//import { Router, Route } from 'react-router';

import Moment from 'moment';
import 'moment-timezone';

import dataLocal from './data'; //comment to use data from source

class EventWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allEvents : [],
      filteredEvents : [],
      ticketGroups : [],
      selectedEvent: '',
      selectedTickets: [],
      modalType: '',
      modalOpen: false
    };
    //local functions bound to this EventWindow
    this.loadDataFromServer = this.loadDataFromServer.bind(this);

  }

  parseData(inputData){
    let eventArray = {}, allTickets = [], allEvents = []
    inputData.forEach(e => {
      let r = e.ticketGroup,
          thisRow = {}
      for(var key in r){
          thisRow[key] = r[key]
          if(key === 'event'){
            thisRow.eventDate = Moment.tz(r.event.date, 'MM/DD/YYYY', r.event.venue.timezone).format()
          }
      }
      if(!eventArray[r.event.stubhubEventId]){
        eventArray[r.event.stubhubEventId] = {}
        eventArray[r.event.stubhubEventId].meta = {}
        eventArray[r.event.stubhubEventId].stubHubId = r.event.stubhubEventId
        eventArray[r.event.stubhubEventId].meta.date = Moment.tz(r.event.date, 'MM/DD/YYYY', r.event.venue.timezone).format()
        eventArray[r.event.stubhubEventId].meta.date_ISO = Moment.tz(r.event.date, 'MM/DD/YYYY', r.event.venue.timezone).format('ddd MMM D, YYYY')
        eventArray[r.event.stubhubEventId].meta.name = r.event.name
        eventArray[r.event.stubhubEventId].meta.venueCity  = r.event.venue.city
        eventArray[r.event.stubhubEventId].meta.venueState = r.event.venue.state
        eventArray[r.event.stubhubEventId].meta.venueName  = r.event.venue.name
        eventArray[r.event.stubhubEventId].meta.timeZone  = r.event.venue.timezone
        eventArray[r.event.stubhubEventId].rules = []
        eventArray[r.event.stubhubEventId].ticketsInSelection = []
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
        selectedEvent: ''
      }, () => {
        console.log(this.state)
      }
    )
  }

  loadDataFromServer() {
    //Data Manipulation Library
    // axios.get(this.props.url)
    // .then(res => {
    //   this.parseData(res.data.data)
    // })
      //Local Data:
      this.parseData(dataLocal)
  }

  changeEvent(stubHubId, tickets){
    this.setState({ ticketGroups: tickets,
                    selectedEvent: stubHubId
                  }, () => {
                    console.log(this.state)
                  })
  }

  quickEdit(stubHubId, ticket){
    let ticketArray = this.state.selectedTickets.slice(), ruleArray = []
    if(ticket && ticketArray.indexOf(ticket) < 0){
      ticketArray.push(ticket)
    }
    ticketArray.forEach(t => {
      let ruleObject = {}
      ruleObject.vivid_id = t.skyboxId
      ruleObject.stubhub_event_id = t.event.stubhubEventId
      ruleObject.event_date = t.eventDate
      ruleObject.section_name = t.section
      ruleObject.row = t.row
      ruleObject.seats = t.seats
      ruleObject.split = "2"
      ruleObject.starting_price = t.listPrice
      ruleObject.starting_quantity = t.quantity
      ruleArray.push(ruleObject)
    })
    console.log(ruleArray)

     /*[ {
        ruleObject.vivid_id: 9901072,
        ruleObject.stubhub_event_id: 9705206,
        ruleObject.event_date: "2017-04-05T19:00:00",
        ruleObject.section_name: "Reserve C Sides",
        ruleObject.row: "M",
        ruleObject.seats: "10, 12",
        ruleObject.split: "2",
        ruleObject.starting_price: 126.3,
        ruleObject.starting_quantity: 2
      } ]

      */
    axios.post('https://automatix.herokuapp.com/api/v1/ticket_groups/', { ticket_groups: ruleArray })
    .then(res => {
      console.log(res)
    })
    //can add options to show single ticket edit modal for quickedit or multi edit
    this.setState({
                    modalOpen: true,
                    selectedTickets: ticketArray
                  }, () => {
                    console.log(this.state)
                  })
  }

  updateArrays(array, thisTicketId, remove){
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
    console.log(stubHubId,ticket)
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
                  }, () => {
                    console.log(this.state)
                  })
  }

  handleDeselectAllTickets(){
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
                  }, () => {
                    console.log(this.state)
                  })
  }

  reSort(){
    let reversedArray = this.state.filteredEvents.slice().reverse()
    this.setState({
                    filteredEvents :  reversedArray
                  }, () => {
                    console.log(this.state)
                  })
  }

  //called from scope of this EventWindow, loads from this scope why not bound?
  componentDidMount() {
    this.loadDataFromServer();
    //removes setInterval timing
    //setInterval(this.loadDataFromServer, this.props.pollInterval);

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
              data={ this.state.ticketGroups } selected={ this.state.selectedTickets }
              globalEdit={ () => this.quickEdit(null, null) }
              quickEdit={ (stubHubId, ticket) => this.quickEdit(stubHubId, ticket) }
              handleTicketCheck={ (stubHubId, ticket) => this.handleTicketCheck(stubHubId, ticket) }
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
