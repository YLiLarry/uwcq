import Ember from 'ember';

export default Ember.Component.extend({
   looking: true,
   found: 0,
   message: Ember.computed('looking', 'found', function() {
      if (this.get('looking')) {
         return 'Computing all possible schedules for you';
      }
   }),
   plans: R.map((id)=>({id:id}), R.range(1,10))
});
