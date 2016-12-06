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
         // create description
         body.find('.description').html(course.get('description'));
         // create schedule table
         var tbodyHTML = "";                                                                                     
         course.get('classes').forEach(function(c) {
            var trHTML = '                                                                         \
               <tr>                                                                                \
                  <td>Section 01</td>                                                              \
                  <td>MWF</td>                                                                     \
                  <td>10:00pm-12:00pm</td>                                                         \
                  <td>'+c.get('instructor')+'</td>                                                 \
                  <td>70</td>                                                                      \
                  <td>100</td>                                                                     \
                  <td><button type="botton" class="btn btn-link">Prefer this section</button></td> \
               </tr>                                                                               \
            ';
            tbodyHTML += trHTML;
         })
         body.find('tbody').html(tbodyHTML);
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
