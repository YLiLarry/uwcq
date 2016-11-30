import Ember from 'ember';

var course = {
   day: 'Mon',
   from: {h:8,m:0},
   to: {h:10,m:0},
   id: 1,
   catalog: 'econ',
   instructor: 'MEMEMEMEM MEMEMEMEME',
   number: 101,
   title: 'Introduction to Micro Economics'
}
var course2 = {
   day: 'Tue',
   from: {h:8,m:0},
   to: {h:9,m:0},
   id: 2,
   catalog: 'econ',
   instructor: 'MEMEMEMEM MEMEMEMEMEe',
   number: 101,
   title: 'Introduction to Micro Economics'
}


export default Ember.Controller.extend({
   actions: {
      onSearch: function() {
         console.log("onSearch");
      },
      onAddCourse: function(id) {
         this.set('state', 2);
         var selected = R.find((obj)=>(obj.id == id), this.get('courses'));
         console.log('add course', id, selected);
         this.set('added', R.unionWith(keyEq, this.added, [selected]));
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
      onExpand: function(id) {
         this.set('expandedEntry', id);
      }
   },
   added: [],
   courses: Ember.computed('added', function() {
      var all = R.map((id)=>({
         id:id,
         catalog: "ECON" ,
         number: "101",
         title: "Introduction to Micro economics"
      }), R.range(1,20));
      var rmed = R.differenceWith(keyEq, all, this.added);
      var newls = R.concat(this.added, rmed);
      return newls;
   }),
   searchClicked: false,
   addFirstCourse: true,
   state: 0,
   expandedEntry: 0,
   schedules: R.map((id) => {
         var arr = [course, course2];
         return Ember.Object.create({
                  id: id,
                  visible: true,
                  courses: arr,
                  serialized: encodeURIComponent(JSON.stringify(arr))
               });
      }, R.range(1,6))
});

function id(a) {
   return a.id;
}

function keyEq(a,b) {
   return a.id == b.id;
}



