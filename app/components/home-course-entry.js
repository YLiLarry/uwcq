import Ember from 'ember';

export default Ember.Component.extend({
   actions: {
      expand: function() {
         var exp = ! this.get('expanded');
         this.set('expanded', exp);
         console.log(exp);
      },
      onAddCourse: function() {
         this.get('onAddCourse')();
      }
   },
   expanded: false,
   addFirstCourse: true
   
});
