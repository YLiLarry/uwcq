import Ember from 'ember';

export default Ember.Controller.extend({
   queryParams: ['courses'],
   courses: null,
   actions: {
      clicked: function() {
         console.log('clicked');
         this.set('courses','clicked');
      }
   },
   schedule: Ember.computed('courses', function() {
      var courses = this.get('courses');
      var obj = null;
      console.log('parse', courses);
      try {
         var s = decodeURIComponent(courses);
         obj = JSON.parse(s);
      } catch(e) {
         console.error(e, courses, s);
         return false;
      }
      return Ember.Object.create({
         id: 1,
         visible: true,
         courses: obj
      })
   })
});
