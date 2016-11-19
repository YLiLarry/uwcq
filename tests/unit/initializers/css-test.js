import Ember from 'ember';
import CssInitializer from 'uwcs/initializers/css';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | css', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  CssInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
