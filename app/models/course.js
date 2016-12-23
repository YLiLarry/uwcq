import DS from 'ember-data';

export default DS.Model.extend({
      subject     : DS.attr('string')
    , title       : DS.attr('string')
    , number      : DS.attr('string')
    , description : DS.attr('string')
    , instructor  : DS.attr('string')
    , classes     : DS.hasMany('class')
});
