//Comment.js
import React, { Component } from 'react';
//import marked from 'marked';
import Moment from 'moment';
import hFunc from '../funcLib/functions_helper';
import FontAwesome from 'react-fontawesome';
import AnimateHeight from 'react-animate-height';

import './style_TicketGroup.css';

let updateObject = {}

class TicketGroup extends Component {
  constructor(props) {
    super(props);
    if(this.props.ticketObj.rule.pricing_rule){
    this.state = {
        ceiling_price: Number(this.props.ticketObj.rule.pricing_rule.ceiling_price).toFixed(2),
        floor_price: Number(this.props.ticketObj.rule.pricing_rule.floor_price).toFixed(2),
        increment_price_by: Number(this.props.ticketObj.rule.pricing_rule.lowest_by).toFixed(2)
      };
  } else {
    this.state = {
      ceiling_price: '',
      floor_price: '',
      increment_price_by: 0
    };
  }


    this.ceilingChange = this.ceilingChange.bind(this);
    this.floorChange = this.floorChange.bind(this);
    this.incrementChange = this.incrementChange.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this, this.props.ticketObj);
  }

  ceilingChange(event) {
    let cleanValue = event.target.value.trim().replace(/[^.0-9]/g, '');
    if(!isNaN(Number(cleanValue))){
      this.setState({ ceiling_price: cleanValue, ceiling_valid: true });
    } else {
      this.setState({ ceiling_price: event.target.value, ceiling_valid: false }, ()=>console.log(this.state));
    }

  }

  formatInput(){
      let values = {}
      for(var key in this.state){
        if(key.indexOf('_valid') < 0){
          values[key] = Number(this.state[key]).toFixed(2)
        }
      }
      this.setState(values,() =>{console.log(this.state)})
  }

  floorChange(event) {
    let cleanValue = event.target.value.trim().replace(/[^.0-9]/g, '')
    this.setState({floor_price: cleanValue || ''});
  }

  incrementChange(event) {
    let cleanValue = event.target.value.trim().replace(/[^.0-9]/g, '');
    this.setState({increment_price_by: cleanValue || ''});
  }

  handleSubmit(ticketGroup) {
    ticketGroup.rule.pricing_rule.ceiling_price = Number(this.state.ceiling_price)
    ticketGroup.rule.pricing_rule.floor_price = Number(this.state.floor_price)
    ticketGroup.rule.pricing_rule.lowest_by = Number(this.state.increment_price_by)
    this.props.handleRuleRefresh(ticketGroup)
  }


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

  sanitize(e,type){
    if(type === 'stopLoss'){
      e.target.value = e.target.value + "%"
    }
    if(type === 'numeric'){
      if(isNaN(Number(e.target.value))){

      }
    }
  }

  getPrice(type, ticket){
    let prices = ticket.rule.price_updates;
    if(prices && prices.length > 0){
      let high = 0, low = Number(prices[0].current_price) || Number(ticket.starting_price)
      if(type === 'high'){
        prices.forEach(t =>{
          let curPrice = Number(t.current_price);
          high = curPrice > high ? curPrice : high
        })
        return high;
      } else {
        prices.forEach(t =>{
          let curPrice = Number(t.current_price);
          low = curPrice > 0 && curPrice < low ? curPrice : low
        })
        return low;
      }
    } else {
      let high = Number(ticket.listPrice), low = high
      if(type === 'high'){
        return high;
      }
      if(type === 'low'){
        return low;
      }
    }
  }

  addOrEditIcon(rule, expanded){
    if(Object.keys(rule).length > 0){
      if(rule.price_updates[rule.price_updates.length -1].state === 'active'){
        return(
          <div className='tProps TicketGroup_QuickEdit active floatRight' onClick={this.props.quickEdit}><FontAwesome name='pencil'/></div>
        )
      } else {
        return(
          <div className='tProps TicketGroup_QuickEdit inactive floatRight' onClick={this.props.quickEdit}><FontAwesome name='pencil'/></div>
        )
      }
    } else {
      return(
        <div className='tProps TicketGroup_QuickEdit notCreated floatRight' onClick={this.props.quickEdit}><FontAwesome name='plus'/></div>
      )
    }
  }
  activeIcon(ticketObj){
    if(ticketObj.rule.price_updates){
      let active = ticketObj.rule.price_updates[ticketObj.rule.price_updates.length - 1].state
      if(active === 'active'){
        return (<FontAwesome name='circle-o'/>)
      } else {
        return (<FontAwesome name='power-off'/>)
      }
    } else {
      return (<FontAwesome name='power-off'/>)
    }
  }

  refreshIcon(ticketObj){
    let activeIndex = 0
    if(ticketObj.rule.price_updates){
      ticketObj.rule.price_updates.forEach((u,i)=>{
        if(u.state === 'active'){
          activeIndex = i
        }
      })
      let active = ticketObj.rule.price_updates[activeIndex].state
      if(active === 'active'){
        return (<FontAwesome name='undo'/>)
      } else {
        return (<FontAwesome name='undo'/>)
      }
    } else {
      return (<FontAwesome name='undo'/>)
    }
  }

  updateRule(element,type){
    console.log(element.target.value, type)
  }


  render() {
    Moment.locale('en');
    var dt = new Date(this.props.lastPriceUpdate),
        //selected = 'tProps TicketGroup_CheckBox floatRight',
        active = 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_NotCreated',
        refresh = 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_NotCreated',
        expanded = 0,
        broadcasting = 'tProps darkGrey',
        costPerTicket = 0,
        listPriceStyle = 'tPricing darkGreen green_bkg'

    if(this.props.seats){
      costPerTicket = this.props.cost / this.props.seats.split(',').length
      if(costPerTicket > this.props.listPrice){
        listPriceStyle = 'tPricing darkOrange orange_bkg'
      }
    }
    if(this.props.selected && this.props.selected === this.props.ticketObj.skyboxId){
      expanded = 70
      //selected = 'tProps TicketGroup_CheckBox TicketGroup_Checked floatRight'
    }

    if(this.props.ticketObj.rule.price_updates){
      let activeIndex = 0
      updateObject.ceiling = this.props.ticketObj.rule.pricing_rule.ceiling_price || '';
      updateObject.floor = this.props.ticketObj.rule.pricing_rule.floor_price || '';

      this.props.ticketObj.rule.price_updates.forEach((u,i)=>{
        if(u.state === 'active'){
          activeIndex = i
        }
      })
      let state = this.props.ticketObj.rule.price_updates[activeIndex].state
      active = state === 'active'  ? 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_Active' : 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_Inactive'
      refresh = state === 'active' ? 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_RefreshRule' :'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_RefreshRule'
    } else {
      active = 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_NotCreated'
      refresh = 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_NotCreated'
      updateObject.ceiling = ' '
      updateObject.floor = ' '
    }
    broadcasting = this.props.broadcast ? 'tProps brightGreen' : 'tProps darkGrey';
    //checkbox functionality for TicketGroup_
    //<div className={ selected } onClick={this.props.handleTicketCheck}><FontAwesome name='check'/></div>

    return (
      <div className='ticketBox'>
        <div>
          <div className='tPropsRow'>
            <div className='tProps tEventTitleBar'>
              <div className='tProps tEventDate'>{ Moment(this.props.eventDate).format('ddd MMM D, YYYY') }</div>
              <div className='tProps tEventTitle'>{ this.props.eventName }</div>
              { this.addOrEditIcon(this.props.rule, expanded) }
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
          <AnimateHeight
            duration={ 500 }
            height={ expanded }>
              <div className='tPropsRow'>
              <div className="TicketGroup_Rule_InputWrapper">
                <div className="TicketGroup_Rule_InputLabel">Active</div>
                <div className={ active } onClick={this.props.handleRuleState}>{ this.activeIcon(this.props.ticketObj) }</div>
              </div>
              <div className="TicketGroup_Rule_InputWrapper">
                <div className="TicketGroup_Rule_InputLabel">Refresh</div>
                <div className={ refresh } onClick={this.handleSubmit}>{ this.refreshIcon(this.props.ticketObj, updateObject) }</div>
              </div>
              <div className="TicketGroup_Rule_InputWrapper">
                <div className="TicketGroup_Rule_InputLabel">Stop Loss %</div>
                <input className='TicketGroup_Rule_StopLoss' onChange={ this.sanitize.bind(this,'stopLoss') }/>
              </div>
              <div className="TicketGroup_Rule_InputWrapper">
                <div className="TicketGroup_Rule_InputLabel">Step Value</div>
                <input className='TicketGroup_Rule_Increment' onChange={ this.incrementChange } value={ this.state.increment_price_by }/>
              </div>
              <div className="TicketGroup_Rule_InputWrapper">
                <div className="TicketGroup_Rule_InputLabel">High Price</div>
                <input className='TicketGroup_Rule_High' onChange={ this.ceilingChange } value={ this.state.ceiling_price } onBlur={ this.formatInput }/>
              </div>
              <div className="TicketGroup_Rule_InputWrapper">
                <div className="TicketGroup_Rule_InputLabel">Low Price</div>
                <input className='TicketGroup_Rule_Low' onChange={ this.floorChange } value={ this.state.floor_price }/>
              </div>
              </div>
          </AnimateHeight>
            <div className='tProps tPropsSmall floatLeft'>{ this.props.skyBoxId }</div>
            <div className='tProps tPropsSmall floatRight'>{ "Price Updated: " + Moment(dt).format('ddd MMM d, YYYY') }</div>
        </div>
      </div>
    )
  }
}
export default TicketGroup;
