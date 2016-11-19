import Ember from 'ember';

export default Ember.Component.extend({
   actions: {
      expand: function() {
         var exp = this.get('expandedEntry') != this.course.key;
         if (exp) {
            this.set('expandedEntry', this.course.key);
            toggle(this.course.key, true);
         } else {
            this.set('expandedEntry', 0);
            toggle(this.course.key, false);
         }
      },
      onAddCourse: function(event) {
         this.onAddCourse(this.course.key);
         this.set('course.added', true);
      },
      onRemoveCourse: function() {
         this.onRemoveCourse(this.course.key);
         this.set('course.added', false);
      }
   },
   expanded: Ember.computed('expandedEntry', function() {
      var exp = this.expandedEntry == this.course.key;
      if (! exp) {
         toggle(this.course.key, false);
      }
      return exp;
   }),
   addFirstCourse: true
});

// toggle expand
function toggle(key, expand) {
   var body = $('.home-course-entry#'+key+' .body');
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
