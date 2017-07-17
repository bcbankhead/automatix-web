//Comment.js
import React, { Component } from 'react';
//import marked from 'marked';
import Moment from 'moment';
import hFunc from '../funcLib/functions_helper';
import FontAwesome from 'react-fontawesome';
import AnimateHeight from 'react-animate-height';

import './style_TicketGroup.css';
import './style_switch.css';

class TicketGroup extends Component {
  constructor(props) {
    super(props);
    if(this.props.ticketObj.rule && this.props.ticketObj.rule.pricing_rule){
    this.state = {
        hasRules : true,
        ceiling_price: Number(this.props.ticketObj.rule.pricing_rule.ceiling_price).toFixed(2),
        floor_price: Number(this.props.ticketObj.rule.pricing_rule.floor_price).toFixed(2),
        increment_price: Number(this.props.ticketObj.rule.pricing_rule.lowest_by).toFixed(2),
        ceiling_valid: true,
        floor_valid: true,
        increment_valid: true,
        increment_direction: 'up', //eventually set to props.ticketObj.rule.pricing_rule.direction when added to model
      };
  } else {
    this.state = {
      hasRules : false,
      ceiling_price: '',
      floor_price: '',
      increment_price: '',
      ceiling_valid: false,
      floor_valid: false,
      increment_valid: false,
      increment_direction: 'up',
    };
  }
    this.ceilingChange = this.ceilingChange.bind(this);
    this.floorChange = this.floorChange.bind(this);
    this.incrementChange = this.incrementChange.bind(this);
    this.formatInput = this.formatInput.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this, this.props.ticketObj);
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

//called to determine if a rule exists within this instance of a ticket group
  hasRules(props){
    return props.ticketObj.rule && props.ticketObj.rule.pricing_rule ? true : false;
  }

  ceilingChange(event) {
    this.setState(this.checkValue(event.target.value, 'ceiling'), () => console.log(this.state));
  }

  floorChange(event) {
    this.setState(this.checkValue(event.target.value, 'floor'));
  }

  incrementChange(event) {
    this.setState(this.checkValue(event.target.value, 'increment'));
  }

  toggleSwitch(){
    let newDirection = this.state.increment_direction === 'up' ? 'down' : 'up';
    this.setState({
      increment_direction : newDirection
    });
  }

  ruleState(price_updates){
    let activeIndex = 0;
    price_updates.forEach((u,i)=>{
      if(u.state === 'active'){
        activeIndex = i;
      }
    })
    return price_updates[activeIndex].state;
  }

  formatInput(){
      let values = {}
      for(var key in this.state){
        if(key.indexOf('_price') > 0){
          values[key] = Number(this.state[key]).toFixed(2);
        }
      }
      this.setState(values,() =>{console.log(this.state)});
  }

  handleUpdate(ticketGroup) {
    if(this.state.ceiling_valid && this.state.floor_valid && this.state.increment_valid){
      ticketGroup.rule.pricing_rule.ceiling_price = Number(this.state.ceiling_price);
      ticketGroup.rule.pricing_rule.floor_price = Number(this.state.floor_price);
      ticketGroup.rule.pricing_rule.lowest_by = Number(this.state.increment_price);
      this.props.handleRuleRefresh(ticketGroup);
    }
  }

  activeIcon(ticketObj){
    if(this.hasRules(this.props)){
      if(this.ruleState(ticketObj.rule.price_updates) === 'active'){
        return (<FontAwesome name='circle-o'/>);
      } else {
        return (<FontAwesome name='power-off'/>);
      }
    } else {
      return (<FontAwesome name='power-off'/>);
    }
  }

  addOrEditIcon(rule, expanded){
    if(this.hasRules(this.props)){
      if(this.ruleState(rule.price_updates) === 'active'){
        return(<div className='tProps TicketGroup_QuickEdit active floatRight' onClick={this.props.quickEdit}><FontAwesome name='pencil'/></div>);
      } else {
        return(<div className='tProps TicketGroup_QuickEdit inactive floatRight' onClick={this.props.quickEdit}><FontAwesome name='pencil'/></div>);
      }
    } else {
      return(<div className='tProps TicketGroup_QuickEdit notCreated floatRight' onClick={this.props.quickEdit}><FontAwesome name='plus'/></div>);
    }
  }

  renderSeats(seats){
    if(seats && seats.split(',').length <= 10){
      let seatNodes = seats.split(',').map(s => {
        return(<div className='tSeatNode' key={ s }>{ s }</div>);
      })
      return seatNodes
    } else if(seats && seats.split(',').length > 10){
      let sArray = seats.split(',');
      return(
              <div>
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
            );
    } else {
      return (<div></div>);
    }
  }

  checkValue(input, field){
    let output = {},
        cleanValue = input.trim().replace(/[^.0-9]/g, '');
    if(!isNaN(Number(cleanValue))){
      if(Number(cleanValue) > 0){
        let valid = false;
        if(field === 'ceiling' && cleanValue >= Number(this.state.floor_price)){
          valid = true;
        }
        if(field === 'floor' && cleanValue <= Number(this.state.ceiling_price)){
          valid = true;
        }
        if(field === 'increment' && cleanValue > 0){
          valid = true;

        }
        output[field + '_price'] = cleanValue;
        output[field + '_valid'] = valid;
        return output;
      } else {
        input = input.indexOf('$') === 0 ? '' : input;
        output[field + '_price'] = input;
        output[field + '_valid'] = false;
        return output;
      }
    }
  }

  render() {
    Moment.locale('en');
    var dt = new Date(this.props.lastPriceUpdate),
        //selected = 'tProps TicketGroup_CheckBox floatRight',
        active          = 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_NotCreated',
        refresh         = 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_NotCreated',
        expanded        = (this.props.selected && this.props.selected === this.props.ticketObj.skyboxId) ? 70 : 0,
        broadcasting    = this.props.broadcast ? 'tProps brightGreen' : 'tProps darkGrey',
        costPerTicket   = 0,
        listPriceStyle  = 'tPricing darkGreen green_bkg',
        ceilingStyle    = this.state.ceiling_valid ? 'TicketGroup_Rule_High' : 'TicketGroup_Rule_High invalid',
        floorStyle      = this.state.floor_valid ? 'TicketGroup_Rule_Low' : 'TicketGroup_Rule_Low invalid',
        incrementStyle  = this.state.increment_valid ? 'TicketGroup_Rule_Increment' : 'TicketGroup_Rule_Increment invalid',
        switchStyle     = this.state.increment_direction === 'up' ? "switch up" : "switch down",
        switchToggleStyle = this.state.increment_direction === 'up' ? "switch_toggle up" : "switch_toggle down",
        formatter       = this.state.increment_direction === 'up' ? '+$' : '-$';

    if(this.props.seats){
      costPerTicket = this.props.cost / this.props.seats.split(',').length;
      if(costPerTicket > this.props.listPrice){
        listPriceStyle = 'tPricing darkOrange orange_bkg';
      }
    }

    if(this.props.ticketObj.rule && this.props.ticketObj.rule.pricing_rule){
      active = this.ruleState(this.props.ticketObj.rule.price_updates) === 'active'  ? 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_Active' : 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_Inactive';
      refresh = this.ruleState(this.props.ticketObj.rule.price_updates) === 'active' ? 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_RefreshRule' :'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_RefreshRule';
    } else {
      active = 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_NotCreated';
      refresh = 'TicketGroup_Rule_Active TicketGroup_CheckBox TicketGroup_NotCreated';
    }

    active = (this.state.ceiling_valid && this.state.floor_valid && this.state.increment_valid) ? active : active + ' disabled';
    refresh = (this.state.ceiling_valid && this.state.floor_valid && this.state.increment_valid) ? refresh : refresh + ' disabled';

    console.log(this.state)
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
            {hFunc.renderIf(!isNaN(Number(this.props.section)) || this.props.section !== this.props.row)(<div className='tProps tLocRow'>row: { this.props.row || 'n/a'}</div>)(null)}
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
                <div className="TicketGroup_Rule_InputLabel">Update</div>
                <div className={ refresh } onClick={this.handleUpdate}><FontAwesome name='undo'/></div>
              </div>
              <div className="TicketGroup_Rule_InputWrapper">
                <div className="TicketGroup_Rule_InputLabel">S/L%</div>
                <input className='TicketGroup_Rule_StopLoss'/>
              </div>
              <div className="TicketGroup_Rule_InputWrapper">
                <div className="TicketGroup_Rule_InputLabel">Step Value</div>
                <div className={ switchStyle } onClick={ this.toggleSwitch }><div className={ switchToggleStyle }></div></div>
                <input className={ incrementStyle } onChange={ this.incrementChange } value={ formatter + this.state.increment_price } onBlur={ this.formatInput }/>
              </div>
              <div className="TicketGroup_Rule_InputWrapper">
                <div className="TicketGroup_Rule_InputLabel">Ceiling</div>
                <input className={ ceilingStyle } onChange={ this.ceilingChange } value={ '$' + this.state.ceiling_price } onBlur={ this.formatInput }/>
              </div>
              <div className="TicketGroup_Rule_InputWrapper">
                <div className="TicketGroup_Rule_InputLabel">Floor</div>
                <input className={ floorStyle } onChange={ this.floorChange } value={ '$' + this.state.floor_price } onBlur={ this.formatInput }/>
              </div>
              </div>
          </AnimateHeight>
            <div className='tProps tPropsSmall floatLeft'>{ this.props.skyBoxId }</div>
            <div className='tProps tPropsSmall floatRight'>{ "Price Updated: " + Moment(dt).format('ddd MMM d, YYYY') }</div>
        </div>
      </div>
    );
  }
}

export default TicketGroup;
