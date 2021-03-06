/** @jsx React.DOM */
var React = require('react');
var m = require('mori');
var db = require('../state/db');
var DbMixin = require('../lib/DbMixin');
var UserActions = require('../actions/User');
var UserListItem = require('../elements/UserListItem');

var debug = require('bows')('Users');

var Users = React.createClass({
  mixins: [DbMixin(db)],
  stateFromDb: function() {
    return {
      users: 'users',
      fetchReq: ['reqs', 'users:fetch']
    };
  },

  componentDidMount: function() {
    debug('componentDidMount');
  },

  componentWillUnmount: function() {
    debug('componentWillUnmount');
  },

  render: function() {
    debug('render');
    return (
      <div>
        {this.renderRefresh()}
        {this.renderUserList()}
      </div>
    );
  },

  renderRefresh: function() {
    if (this.isLoading()) {
      return null;
    }

    if (this.isRefreshing()) {
      return <p>Refreshing...</p>;
    }

    return <p><a href="#" onClick={this.handleRefresh}>Refresh</a></p>;
  },

  isLoading: function() {
    return (
      m.get(this.state.fetchReq, 'status') === 'pending' &&
      m.count(this.state.users) === 0
    );
  },

  isRefreshing: function() {
    return (
      m.get(this.state.fetchReq, 'status') === 'pending' &&
      m.count(this.state.users) > 0
    );
  },

  handleRefresh: function(e) {
    e.preventDefault();
    UserActions.fetch();
  },

  renderUserList: function() {
    if (this.isLoading()) {
      return <p>Loading users...</p>;
    }

    if (m.count(this.state.users) === 0) {
      return <p>No users found.</p>;
    }

    var users = m.vals(this.state.users);
    users = m.sort(this.compareUsers, users);
    var nodes = m.map(function(user) {
      return m.hash_map(
        'key', m.get(user, 'userid'),
        'fullName', m.get_in(user, ['profile', 'fullName']),
        'href', '#/user/' + m.get(user, 'userid'),
        'permissions', m.keys(m.get(user, 'permissions'))
      );
    }, users);
    nodes = m.clj_to_js(nodes);
    nodes = nodes.map(function(node) {
      return (
        <UserListItem
          key={node.key}
          fullName={node.fullName}
          href={node.href}
          permissions={node.permissions} />
        );
    });

    return <ul>{nodes}</ul>;
  },

  compareUsers: function(user1, user2) {
    var name1 = m.get_in(user1, ['profile', 'fullName']);
    var name2 = m.get_in(user2, ['profile', 'fullName']);
    return name1 < name2;
  }
});

module.exports = Users;
