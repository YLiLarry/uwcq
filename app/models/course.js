import DS from 'ember-data';

export default DS.Model.extend({
   subject: DS.attr('string'),
   title: DS.attr('string'),
   number: DS.attr('number'),
   instructor: DS.attr('string')
});
