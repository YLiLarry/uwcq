import Ember from 'ember';

export default Ember.Component.extend({
   looking: false,
   found: 0,
   message: Ember.computed('looking', 'found', function() {
      if (this.get('looking')) {
         return 'Computing all possible schedules for you';
      }
      if (this.get('plans').length == 0) {
         return "Couldn't find a schedule. You will have time conflicts taking these courses.";
      }
      return "Here's a list of schedules you can choose.";
   }),
   plans: R.map((id)=>({id:id}), R.range(1,10))
});
