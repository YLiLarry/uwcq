import Ember from 'ember';

export default Ember.Component.extend({
   actions: {
      onExpand: function() {
         var course = this.get('course');
         if (this.get('expandedEntry') != course.id) {
            // on expand
            this.get('onExpandEntry')(course);
         } else {
            this.set('expandedEntry', false);
         }
      },
      onAddCourse: function(event) {
         this.onAddCourse(this.course);
         this.set('course.added', true);
      },
      onRemoveCourse: function() {
         this.onRemoveCourse(this.course.id);
         this.set('course.added', false);
      },
   },
   expanded: Ember.computed('expandedEntry', function() {
      var course = this.get('course');
      var exp = this.expandedEntry == course.id;
      var body = $('.home-course-entry#'+course.id+' .body');
      if (exp) {
         body.find('.description').html(course.get('description'));
         body.animate({
            height: body.children('.margin').outerHeight(true)
         });
      } else {
         body.animate({
            height: 0
         });
      }
      return exp;
   }),
   addFirstCourse: true
});
