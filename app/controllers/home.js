import Ember from 'ember';
import S from 'npm:sprintf-js'

var course = {
   day: 'Mon',
   from: {h:8,m:0},
   to: {h:10,m:0},
   id: 1,
   subject: 'econ',
   instructor: 'MEMEMEMEM MEMEMEMEME',
   number: 101,
   title: 'Introduction to Micro Economics'
}
var course2 = {
   day: 'Tue',
   from: {h:8,m:0},
   to: {h:9,m:0},
   id: 2,
   subject: 'econ',
   instructor: 'MEMEMEMEM MEMEMEMEMEe',
   number: 101,
   title: 'Introduction to Micro Economics'
}


function sortFilterWith(f, arr) {
   var mapped = R.map((item) => [f(item), item], arr);
   var filtered = R.filter((pair) => pair[0] > 0, mapped);
   var sorted = R.sortBy((pair) => pair[0], filtered);
   var unmapped = R.map((pair) => pair[1], sorted);  
   return unmapped;    
}
console.assert(R.equals(sortFilterWith(R.identity, [3,2,1,-1]), [1,2,3]), 
               sortFilterWith(R.identity, [3,2,1,-1]));


function regexCountMatch(reg, str) {
   return R.match(reg, str).length;
}
console.assert(regexCountMatch(/(a)/gi, 'abaa') == 3, 
               R.match(/(a)/gi, 'abaa'));


export default Ember.Controller.extend({
   init: function() {
      this._super();
      var self = this;
      this.get('store').findAll('course').then(function(all) {
         self.set('allCourses', all);
      });
   },
   actions: {
      onSearch: function() {
         console.log("onSearch", this.get('searchText'));
      },
      onAddCourse: function(course) {
         this.set('state', 2);
         var added = this.get('added');
         if (! added) {
            this.set('added', []);
         }
         this.get('added').pushObject(course);
         // var newAdded = R.unionWith(idEq, added, [selected]);
         // this.set('added', newAdded);
         console.log('add course', course.id, this.get('added'));
      },
      onRemoveCourse: function(id) {
         var idx = R.findIndex((obj)=>(obj.id == id), this.get('added'));
         var removed = this.get('added')[idx];
         this.set('added', R.remove(idx));
      },
      onSearchClicked: function() {
         this.set("searchClicked", true);
         this.set("state", 1);
      },
      onExpandEntry: function(course) {
         var self = this;
         // find description
         var dp = this.get('store').findRecord('course', course.id, {reload: true});
         // find schedules
         var schd = this.get('store').query('class', {
              action: 'course-sched'
            , term: 1171
            , subject: course.get('subject')
            , number: course.get('number')
         });
         
         Ember.RSVP.all([dp, schd]).then(function(dp, sched) {
            course.setProperties(dp);
            self.set('expandedEntry', course.id);
            course.get('classes').pushObjects(schd);
         });
      }

   },
   searchText: "",
   added: [],
   coursesDisplayedMax: 100,
   coursesDisplayed: Ember.computed('added.length', 'allCourses', 'searchText', function() {
      var all = this.get('allCourses');
      if (! all) {return [];}
      var regs = R.map((key) => new RegExp('\\b'+key, 'ig'), R.without([''], R.split(' ', this.get('searchText'))));
      // var regex = new RegExp('\\b' + R.join('|\\b', R.without([''], R.split(' ', this.get('searchText')))), 'ig');
      var searched = R.filter((course) => {
         var context = R.join(' ', [   course.get('subject'), 
                                       course.get('number'), 
                                       course.get('subject') + course.get('number'), 
                                       course.get('title')  ]);
         return R.all((k) => R.test(k, context), regs);
         // return regexCountMatch(regex, context);
      }, all);
      searched = R.reverse(searched);
      var displayed = searched.slice(0,this.get('coursesDisplayedMax'));
      var added = this.get('added');
      var rmed = R.differenceWith(idEq, displayed, added);
      displayed = R.concat(added, rmed);
      if (rmed.length == 1) {
         this.actions.onExpandEntry.call(this, rmed[0]);
      }
      return displayed;
   }),
   searchClicked: false,
   addFirstCourse: true,
   state: 1,
   expandedEntry: 0,
   schedules: R.map((id) => {
         var arr = [course, course2];
         return Ember.Object.create({
                  id: id,
                  visible: false,
                  courses: arr,
                  serialized: encodeURIComponent(JSON.stringify(arr))
               });
      }, R.range(1,6))
});

function id(a) {
   return a.id;
}

function idEq(a,b) {
   return a.id == b.id;
}



