import Ember from 'ember';

export default Ember.Component.extend({
   actions: {
      searchbarKeyDown: function(event) {
         if (event.keyIdentifier == 'Enter') {
            this.get("onSearch")();
         }
      },
      onSearchClicked: function(even) {
         this.get("onSearchClicked")();
      }
   }
});
