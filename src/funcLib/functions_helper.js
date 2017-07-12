module.exports = {
  renderIf : condition => element => elseElement => {
    if (condition) return element;
    return elseElement;
  }
}
