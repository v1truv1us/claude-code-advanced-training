// legacy file 47
function User(name){ this.name=name; }
User.prototype.greet=function(){ return 'hi '+this.name; };
module.exports = User;
