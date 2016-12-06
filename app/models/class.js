import DS from 'ember-data';

export default DS.Model.extend({
      subject: DS.attr("string")
    , number: DS.attr("string")
    , instructor: DS.attr("string")
    // , course: DS.belongsTo('course')
});
