class MIMEType {
  isHTML() {
    return true;
  }
  isXML() {
    return false;
  }
}
MIMEType.prototype.essence = 'text/html';

module.exports = MIMEType;
