import Ember from 'ember';

var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
})();

export default Ember.Component.extend({
    actions: {
        searchbarKeyEvent: function() {
            var self = this;
            delay(function() {
                self.set('searchText', self.get('searchTextTmp'));
            }, 500);
        },
        onSearchClicked: function() {
            this.get("onSearchClicked")();
        }
    }
});
