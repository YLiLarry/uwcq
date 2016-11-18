import Ember from 'ember';

export default Ember.Controller.extend({
   actions: {
      onSearch: function() {
         console.log("onSearch");
      },
      onAddCourse: function() {
         if (this.get('addFirstCourse')) {
            this.set('addFirstCourse', false);
            $("#home-body-right").animate({
               left: "25vw",
               width: "75vw"
            });
            $("#home-body-left").animate({
               left: "0"
            });
         }
      },
      onSearchClicked: function() {
         this.set("searchClicked", true);
         this.set("state", 2);
      },
      onExpand: function(id) {
         this.set('expanedEntry', id);
      }
   },
   courses: R.map((id) => ({id:id}),R.range(0,10)),
   searchClicked: false,
   addFirstCourse: true,
   state: 1,
   expanedEntry: 0
});
