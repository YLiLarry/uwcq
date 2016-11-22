import Ember from 'ember';

var course = {
   day: 'Mon',
   from: {h:8,m:0},
   to: {h:10,m:0},
   id: 1,
   category: 'econ',
   instructor: 'me',
   number: 101,
   title: 'xx'
}
var course2 = {
   day: 'Tue',
   from: {h:8,m:0},
   to: {h:9,m:0},
   id: 2,
   category: 'econ',
   instructor: 'me',
   number: 101,
   title: 'xx'
}


export default Ember.Controller.extend({
   actions: {
      onSearch: function() {
         console.log("onSearch");
      },
      onAddCourse: function(key) {
         this.set('state', 2);
         var selected = R.find((obj)=>(obj.key == key), this.get('courses'));
         console.log('add course', key, selected);
         this.set('added', R.unionWith(keyEq, this.added, [selected]));
      },
      onRemoveCourse: function(key) {
         var idx = R.findIndex((obj)=>(obj.key == key), this.get('added'));
         var removed = this.get('added')[idx];
         this.set('added', R.remove(idx));
      },
      onSearchClicked: function() {
         this.set("searchClicked", true);
         this.set("state", 1);
      },
      onExpand: function(key) {
         this.set('expandedEntry', key);
      }
   },
   added: [],
   courses: Ember.computed('added', function() {
      var all = R.map((key)=>({
         key:key,
         name: "ECON" ,
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
   schedules: R.map((key) => {
         var arr = [course, course2];
         return Ember.Object.create({
                  key: key,
                  visible: true,
                  courses: arr,
                  serialized: encodeURIComponent(JSON.stringify(arr))
               });
      }, R.range(1,6))
});

function key(a) {
   return a.key;
}

function keyEq(a,b) {
   return a.key == b.key;
}



