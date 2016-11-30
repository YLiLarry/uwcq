import Ember from 'ember';

export default Ember.Component.extend({
   actions: {
      expand: function() {
         var exp = this.get('expandedEntry') != this.course.id;
         if (exp) {
            this.set('expandedEntry', this.course.id);
            toggle(this.course.id, true);
         } else {
            this.set('expandedEntry', 0);
            toggle(this.course.id, false);
         }
      },
      onAddCourse: function(event) {
         this.onAddCourse(this.course.id);
         this.set('course.added', true);
      },
      onRemoveCourse: function() {
         this.onRemoveCourse(this.course.id);
         this.set('course.added', false);
      }
   },
   expanded: Ember.computed('expandedEntry', function() {
      var exp = this.expandedEntry == this.course.id;
      if (! exp) {
         toggle(this.course.id, false);
      }
      return exp;
   }),
   addFirstCourse: true
});

// toggle expand
function toggle(id, expand) {
   var body = $('.home-course-entry#'+id+' .body');
   if (expand) {
      body.animate({
         height: body.children(".margin").outerHeight(true)
      });
   } else {
      body.animate({
         height: 0
      });
   }
}
