/*
 * A simple javascript implementation of a binary tree combined with a double
 * linked list.
 */

(function(win, undef) {
  /**
   * @class TTreeListNode
   * Here defined as a shorthand to be assigned with the proper name later on
   */
  var n = function() {
    // Call the constructor
    this.constructor();
  }
  /**
   * @function constructor
   */
  n.prototype.constructor = function() {
    // Reset all values
    this.parent = null;
    this.prev = null;
    this.left = null;
    this.payload = [];
    this.payloadIndex = -1;
    this.right = null;
    this.next = null;
  }
  /**
   * @function addPayload
   * @param {array or object} node The node to add as payload to this node
   */
  n.prototype.addPayload = function(node) {
    this.payload.push(node);
    this.payloadIndex = 0;
  }
  /**
   * @function getPayloadCount
   * @return {integer} Returns the number of payloads carried by this node
   */
  n.prototype.getPayloadCount = function() {
    return this.payload.length;
  }
  /**
   * @function setPayloadIndex Set the active payload
   * @param {integer} index
   */
  n.prototype.setPayloadIndex = function(index) {
    if(this.payload[index] != undef) {
      this.payloadIndex = index;
    }
  }
  /**
   * @function get Returns the index descripbed by key from then active payload
   * @param {string or integer} key
   * @returns {mixed}
   */
  n.prototype.get = function(key) {
    if(this.payloadIndex >= 0) {
      return this.payload[this.payloadIndex][key];
    }
    return null;
  }
  /**
   * Assign the class to the window object
   */
  win.TTreeListNode = n;
  
  /**
   * @class TTreeList
   * Here defined as a shorthand to be assigned with the proper name later on
   */
  var t = function() {
    this.constructor();
  }
  /**
   * @function constructor
   */
  t.prototype.constructor = function() {
    // Reset all values
    this.key = null;
    this.root = null;
    this.first = null;
    this.last = null;
    this.nodes = [];
    this.isDirty = false;
    this.treeCount = 0;
    this.buildFilters = [];
  }
  /**
   * @function add
   * @param {array or object} node
   */
  t.prototype.add = function(node) {
    // Add the node to the list
    this.nodes.push(node);
    // Set the dirty flag
    this.isDirty = true;
    // Reset the trees root node
    this.root = null;
    // Reset the trees first node
    this.first = null;
    // Reset the trees last node
    this.last = null;
    // Reset the trees count
    this.treeCount = 0;
  }
  /**
   * @function count Returns the number of nodes added to the TTreeList object
   * @returns {integer}
   */
  t.prototype.count = function() {
    return this.nodes.length;
  }
  /**
   * @function search
   * @param {mixed} value
   * @returns {TTreeListNode}
   */
  t.prototype.search = function(value) {
    if(this.isDirty === false) {
      var node = this.root;
      while(node) {
        var nodeValue = node.get(this.key);
        if(value < nodeValue) {
          // We are searching for a smaller value
          // Go left in the tree
          node = node.left;
        } else if(value > nodeValue) {
          // We are searching for a greater value
          // Go right in the tree
          node = node.right;
        } else {
          // Found the value we were searching for
          return node;
        }
      }
    }
    // No match found
    return null;
  }
  /**
   * @function addBuildFilter Add a build filter callback which is used when the
   * build function traverses the nodes
   * @param {callable} filterCallback
   */
  t.prototype.addBuildFilter = function(filterCallback) {
    this.buildFilters.push(filterCallback);
  }
  /**
   * @function clearBuildFilters Remove all build filters
   */
  t.prototype.clearBuildFilters = function() {
    this.buildFilters = [];
  }
  /**
   * @function build Builds a new tree based on the value of the index key
   * @param {mixed} key
   * @returns {TTreeListNode}
   */
  t.prototype.build = function(key) {
    this.key = key;
    var list = [];
    var keys = [];
    var parentList = [];
    this.treeCount = 0;
    // Loop through all nodes and sort out duplicate values
    for(var i in this.nodes) {
      var node = this.nodes[i];
      if(node[key] != undef) {
        var sortValue = node[key];
        if(list[sortValue] == undef) {
          list[sortValue] = new TTreeListNode();
          keys.push(sortValue);
          this.treeCount++;
        }
        list[sortValue].addPayload(node);
      }
    }
    // Sort the keys
    keys.sort();
    this.root = null;
    this.first = null;
    this.last = null;
    var prev = null;
    // Build the double linked list
    for(var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var node = list[key];
      parentList.push(node);
      if(this.first === null) {
        this.first = node;
      }
      node.prev = prev;
      if(prev !== null) {
        prev.next = node;
      }
      prev = node;
    }
    prev.next = null;
    // Build the tree
    // - the first node is left
    // - the second node is a parent
    // - the third node is right
    // - the fourth node is a parent
    // Then loop through until the parentList just has one node left, which
    // is the root
    var keepLooping = (parentList.length > 0);
    while(keepLooping) {
      var newParentList = [];
      while(parentList.length > 0) {
        var left = parentList.shift();
        var parent = null;
        var right = null;
        var leftover = null;
        if(parentList.length > 0) {
          parent = parentList.shift();
          newParentList.push(parent);
          if(parentList.length > 0) {
            right = parentList.shift();
            if(parentList.length > 0) {
              leftover = parentList.shift();
              newParentList.push(leftover);
            }
          } else {
            right = null;
          }
        } else {
          parent = null;
          right = null;
        }
        if(parent != null) {
          parent.left = left;
          left.parent = parent;
          parent.right = right;
          if(right != null) {
            right.parent = parent;
          }
        } else {
          newParentList.push(left);
          break;
        }
      }
      parentList = newParentList;
      if(parentList.length <= 1) {
        keepLooping = false;
      }
    }
    if(parentList.length == 0) {
      this.root = null;
    } else {
      this.root = parentList[0];
    }
    // Clean the dirty flag
    this.isDirty = false;
    return this.root;
  }
  /**
   * Assign the class to the window object
   */
  win.TTreeList = t;
  
})(window);