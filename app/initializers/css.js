import Ember from 'ember';

export function initialize(/* application */) {
   // application.inject('route', 'foo', 'service:foo');
   Ember.Controller.reopen({
      init() {
         this._super(...arguments);
         Ember.run.schedule("afterRender", this, function() {
            $(".watch-transition").on("transitionend",
               function() {
                  $(this).addClass("after-transition");
               }).on("transitionstart transitioncancel", function() {
                  $(this).removeClass("after-transition");
               });
            console.log("rendered");
         }); 
      }
   })
}

export default {
   name: 'css',
   initialize
};
