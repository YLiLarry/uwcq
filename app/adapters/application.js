import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
	  namespace: 'api/v1'
	, query(store, type, data) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON("api/v1/do?" + $.param(data)).then(function(data) {
                resolve(data);
            }, function(jqXHR) {
                reject(jqXHR);
            });
      	});
    }
	, queryRecord(store, type, data) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON("api/v1/do?" + $.param(data)).then(function(data) {
                resolve(data);
            }, function(jqXHR) {
                reject(jqXHR);
            });
      	});
    }
});
