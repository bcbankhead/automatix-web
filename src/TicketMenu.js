//Comment.js
import React, { Component } from 'react';
//import marked from 'marked';

import FontAwesome from 'react-fontawesome';

class TicketMenu extends Component {

  render() {
    let ifDisabled = ' disabled'
    if(this.props.selected && this.props.selected.length > 0){
      ifDisabled = ' inactive'
    }
    return (
      <div className='subMenu'>
        <div className='base-title'>Tickets:</div>
        <div className="menuItemRow floatRight">
          <div className={'tGlobalEdit' + ifDisabled} onClick={this.props.globalEdit}><FontAwesome name='pencil'/></div>
          <div className={'tDeselectAll' + ifDisabled} onClick={this.props.handleDeselectAllTickets}><FontAwesome name='undo'/></div>
        </div>
      </div>
    )
  }
}
export default TicketMenu;
