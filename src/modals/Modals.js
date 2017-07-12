//Comment.js
import React, { Component } from 'react';
import Modal from 'react-modal';
import Moment from 'moment';
import FontAwesome from 'react-fontawesome';

import hFunc from '../funcLib/functions_helper';

let customStyles = {
        overlay : {
          position          : 'fixed',
          top               : 0,
          left              : 0,
          right             : 0,
          bottom            : 0,
          backgroundColor   : 'rgba(0,0,0, 0)',
          borderRadius      : '0px',
          opacity           : '1',
          transition : '.5s all ease',
        },
        content : {
          position                   : 'relative',
          margin                     : '0 auto',
          border                     : '1px solid #ccc',
          background                 : '#98a0ad',
          overflow                   : 'auto',
          WebkitOverflowScrolling    : 'touch',
          borderRadius               : '4px',
          outline                    : 'none',
          padding                    : '20px',
          width                      : '500px',
          opacity                    : '0',
          height                     : '500px',
          transition                 : '.5s all ease'
        }
      }


class ModalComponents extends Component {

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
    customStyles.overlay.opacity = 1
    customStyles.overlay.backgroundColor = 'rgba(0,0,0, 0.5)'
    customStyles.content.opacity = 1
  }

  fadeModal() {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
    customStyles.overlay.backgroundColor = 'rgba(0,0,0, 0)'
    customStyles.overlay.opacity = 0
    customStyles.content.opacity = 0
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

  renderTickets(tickets){

  }

  getPrice(type, tickets){
    if(tickets && tickets.length > 0){
      let high = 0, low = tickets[0].listPrice
      if(type === 'high'){
        tickets.forEach(t =>{
          high = t.listPrice > high ? t.listPrice : high
        })
        return high;
      } else {
        tickets.forEach(t =>{

          low = t.listPrice > 0 && t.listPrice < low ? t.listPrice : low
        })
        return low;
      }
    }
  }

  sanitize(e,type){
    if(type === 'stopLoss'){
      e.target.value = e.target.value + "%"
    }
  }

  render() {
    Moment.locale('en');
    let ticketNodes = [];
    if(this.props.selected && this.props.selected.length > 0){
      let checkStyle = 'tProps tCheckBox tCheckBoxChecked floatLeft'
      if(this.props.selected.length === 1){
        checkStyle = 'tProps tCheckBox tCheckBoxChecked floatLeft disabled'
      }
      ticketNodes = this.props.selected.map(t => {
        return(
          <div key={ t.skyboxId }>
          <div className={ checkStyle } onClick={() => this.props.handleTicketCheck(t.event.stubhubEventId, t)}><FontAwesome name='check'/></div>
          <div className='ruleTextNode ruleText'>{ t.event.name }</div>
          <div className='ruleTextNode ruleDate'>{ Moment(t.eventDate).format('MM/DD/YYYY') }</div>
          <div className='tProps tLocSection ruleSection'>sec: { t.section || 'n/a'}</div>
          {hFunc.renderIf(t.section !== t.row)(<div className='tProps tLocRow'>row: { t.row || 'n/a'}</div>)(null)}
          <div className='tProps tSeatNode'>qty: {t.quantity}</div>
          </div>
        )
      })
    } else {
      ticketNodes = (<div key='0'></div>)
    }
    return (
      <div>
        <Modal
          isOpen={this.props.modalOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={() => {this.fadeModal(); this.props.closeModal()}}
          style={customStyles}
          contentLabel="Pricing Modal">
          <div className='modalClose' onClick={this.props.closeModal}><FontAwesome name='times'/></div>
          <h2>Set Rule for selected tickets:</h2>
          <input className='modalRuleName' placeholder="Rule Name..."/>
          <br/>
          <div className="modalInputWrapper">
            <div className="modalInputLabel">Stop Loss %</div>
            <input className='modalStopLoss' onChange={ this.sanitize.bind(this,'stopLoss') }/>
          </div>
          <div className="modalInputWrapper">
            <div className="modalInputLabel">Step Value</div>
            <input className='modalIncrement'/>
          </div>
          <div className="modalInputWrapper">
            <div className="modalInputLabel">High Price</div>
            <input className='modalHigh' value={ "$" + this.getPrice('high',this.props.selected) } disabled/>
          </div>
          <div className="modalInputWrapper">
            <div className="modalInputLabel">Low Price</div>
            <input className='modalLow' value={ "$" + this.getPrice('low',this.props.selected) } disabled/>
          </div>
          <div>{ticketNodes}</div>
        </Modal>
      </div>
    );
  }
}
export default ModalComponents;
