import Ember from 'ember';

export default Ember.Component.extend({
   looking: false,
   found: 0,
   message: Ember.computed('looking', 'found', function() {
      if (this.get('looking')) {
         return 'Computing all possible schedules for you';
      }
      if (this.get('schedules').length == 0) {
         return "Couldn't find a schedule. You will have time conflicts taking these courses.";
      }
      return "Here's a list of schedules you can choose.";
   }),
   didRender() {
      var self = this;     
      var thumbnails = $('#home-search-results .thumbnail');
      function watchScroll(idx, thumbnail) {
         $(window).on('scroll', function(event) {
            if ($(thumbnail).visible()) {
               var schedules = self.get('schedules');
               schedules[idx].set('visible', true);
               $(window).off(event);
            } else {
               // cal.hide();
            }
         });
      }
      thumbnails.each(watchScroll);
   },
   more: 10
   
});
