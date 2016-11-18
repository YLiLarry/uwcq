import Ember from 'ember';

export default Ember.Component.extend({
   actions: {
      expand: function() {
         var exp = this.getParent('expandedEntry') != this.get('id');
         if (exp) {
            this.setParent('expandedEntry', this.id);
         } else {
            this.setParent('expandedEntry', 0);
         }
      },
      onAddCourse: function() {
         this.get('onAddCourse')();
      }
   },
   expanded: Ember.computed('expandedEntry', function() {
      return this.get('expandedEntry') == this.get('id');
   }),
   addFirstCourse: true
});
