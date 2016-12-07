import DS from 'ember-data';

export default DS.Model.extend({
      subject: DS.attr("string")
    , number: DS.attr("string")
    , section: DS.attr("string")
    , instructor: DS.attr("string")
    , capacity: DS.attr("number")
    , enrolled: DS.attr("number")
    , weekdays: DS.attr()
    , start: DS.attr()
    , end: DS.attr()
    // , course: DS.belongsTo('course')
});
