import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('home-schedule-calendar', 'Integration | Component | home schedule calendar', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{home-schedule-calendar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#home-schedule-calendar}}
      template block text
    {{/home-schedule-calendar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
