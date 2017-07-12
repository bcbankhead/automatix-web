//Comment.js
import React, { Component } from 'react';
//import marked from 'marked';
import FontAwesome from 'react-fontawesome';

class EventMenu extends Component {

  render() {
    return (
      <div className='subMenu firstSubMenu'>
        <div className='base-title'>Events:</div>
        <div className="menuItemRow floatRight">
          <div className={'eDateSort'} onClick={this.props.reSort}>Date: <FontAwesome name='sort'/></div>
          <input className={'eSearchBar'} onChange={this.props.filter} placeholder="Search..."/>
        </div>
      </div>
    )
  }
}
export default EventMenu;
