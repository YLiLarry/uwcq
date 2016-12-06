import DS from "ember-data";

export default DS.JSONAPIAdapter.extend({
    query(store, type, data) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON("api/v1/do?" + $.param(data)).then(function(data) {
                resolve(data);
            }, function(jqXHR) {
                reject(jqXHR);
            });
          });
    }
});
