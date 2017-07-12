module.exports = {
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
                        //console.log(this.state)
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
}
