import Ember from 'ember';

export default Ember.Controller.extend({
   actions: {
      onSearch: function(event) {
         console.log("onSearch");
      },
      onAddCourse: function(event) {
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
      onSearchClicked: function(event) {
         this.set("searchClicked", true);
         this.set("state", 2);
      }
   },
   courses: R.range(0,5),
   searchClicked: false,
   addFirstCourse: true,
   state: 1
});
