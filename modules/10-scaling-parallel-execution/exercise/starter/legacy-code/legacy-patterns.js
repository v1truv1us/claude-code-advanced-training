// Sample legacy JavaScript files for batch modernization exercise
// These files contain patterns that should be modernized to TypeScript/ES6+

// File 1: Callback hell
function getUserData(userId, callback) {
  db.query('SELECT * FROM users WHERE id = ?', [userId], function(err, user) {
    if (err) return callback(err);
    
    db.query('SELECT * FROM posts WHERE user_id = ?', [userId], function(err, posts) {
      if (err) return callback(err);
      
      db.query('SELECT * FROM comments WHERE user_id = ?', [userId], function(err, comments) {
        if (err) return callback(err);
        
        callback(null, {
          user: user[0],
          posts: posts,
          comments: comments
        });
      });
    });
  });
}

// File 2: Var everywhere, no arrow functions
var utils = {
  processData: function(data) {
    var results = [];
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      results.push(item.value * 2);
    }
    return results;
  },
  
  filterActive: function(items) {
    return items.filter(function(item) {
      return item.active === true;
    });
  }
};

// File 3: Constructor functions (pre-class syntax)
function User(name, email) {
  this.name = name;
  this.email = email;
  this.createdAt = new Date();
}

User.prototype.getInfo = function() {
  return this.name + ' (' + this.email + ')';
};

User.prototype.save = function(callback) {
  var self = this;
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', 
    [this.name, this.email], 
    function(err, result) {
      if (err) return callback(err);
      self.id = result.insertId;
      callback(null, self);
    }
  );
};

// File 4: Manual promise creation
function fetchData(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = function() {
      reject(new Error('Network request failed'));
    };
    xhr.send();
  });
}

// File 5: Mixed patterns
var api = {
  getUsers: function() {
    return fetch('/api/users').then(function(res) {
      return res.json();
    }).then(function(data) {
      return data.users;
    }).catch(function(err) {
      console.error('Error fetching users:', err);
      throw err;
    });
  },
  
  createUser: function(userData) {
    var self = this;
    return new Promise(function(resolve, reject) {
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }).then(function(res) {
        return res.json();
      }).then(function(data) {
        resolve(data);
      }).catch(function(err) {
        reject(err);
      });
    });
  }
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getUserData, utils, User, fetchData, api };
}
