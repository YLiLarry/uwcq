import Ember from 'ember';
import S from 'npm:sprintf-js'

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
         function showWeekDays(arr) {
            var s = '';
            s += arr[0] ? 'M'  : '';
            s += arr[1] ? 'T'  : '';
            s += arr[2] ? 'W'  : '';
            s += arr[3] ? 'Th' : '';
            s += arr[4] ? 'F'  : '';
            return s;
         }             
         function showTime(time) {
            return S.sprintf("%02d:%02d", time.hour, time.minute);
         }   
         function rmMidName(name) {
            var ls = R.split(' ', name);
            return R.join(' ', [R.head(ls), R.last(ls)]);
         }                                                               
         course.get('classes').forEach(function(c) {
            var trHTML = '                                                                          \
               <tr>                                                                                 \
                  <td>'+c.get('section')+'</td>                                                     \
                  <td>'+showWeekDays(c.get('weekdays'))+'</td>                                      \
                  <td>'+showTime(c.get('start'))+'-'+showTime(c.get('end'))+'</td>          \
                  <td>'+rmMidName(c.get('instructor'))+'</td>                                                  \
                  <td>'+c.get('enrolled')+'</td>                                                    \
                  <td>'+c.get('capacity')+'</td>                                                    \
                  <td><a>Prefer this section</a></td>  \
               </tr>                                                                                \
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
