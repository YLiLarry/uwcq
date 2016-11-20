import Ember from 'ember';
import S from 'npm:sprintf-js'

export default Ember.Component.extend({
   time: R.map((t)=>({h : t[0], 
                      m : S.sprintf('%02d',t[1]), 
                      hr : t[1] == 0}), 
               R.xprod(R.range(8,23), R.map(R.multiply(10),R.range(0,6)))),
   days: ['', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri'],
   willRender() {
      console.log("schedule-calendar willRender");
   },
   didRender() {
      console.log("schedule-calendar didRender");
      
      var self = this;
      
      var cal = $('.schedule-calendar.' + this.get('schedule.key'));
      var h = cal.innerWidth(); // 10% of container width
      cal.css('font-size', h * 0.015 + 'px');
      
      renderCourses(self.get('schedule'), cal);
   }
});

function renderCourses(schedule, cal) {
   var startT = new Date();
   console.log("rander cal", schedule.key);
   console.log(schedule);
   schedule.courses.forEach((c)=>{renderOneCourse(c,cal)});
   // html2canvas(cal, {
   //    onrendered: function(convas) {
   //       $(convas).css({
   //          height: '100%',
   //          width: '100%'
   //       });
   //       cal.html(convas);
   //    }
   // });
   var endT = new Date();
   console.log("rander cal ends", schedule.key, endT - startT);
}

function renderOneCourse(course, cal) {
   var baseFontSize = parseInt(cal.css('font-size'));
   var startBlock = cal.find(S.sprintf('.%s.%s.%02s', course.day, course.from.h, roundMin(course.from.m)));
   var endBlock = cal.find(S.sprintf('.%s.%s.%02s', course.day, course.to.h, roundMin(course.to.m)));
   var drawL = startBlock.position().left + 1;
   var drawT = startBlock.position().top;
   var drawW = startBlock.width();
   var drawH = endBlock.position().top - drawT;
   var width = startBlock.width();
   var fontSize = Math.min(drawH * 0.16, baseFontSize * 0.8);
   var lineHeight = drawH / 4;
   startBlock.css('background-color: green');
   endBlock.css('background-color: green');
   var convas = cal.children('.convas');
   var courseDOM = $($.parseHTML(S.sprintf('<div class="course %s"></div>', course.id))[0]);
   var courseTextDOM = $.parseHTML(S.sprintf('<div class="title">%s %s %s</div><div class="instructor">%s</div><div class="time">%d:%02d - %d:%02d</div>', 
                                 course.category, course.number, course.title, course.instructor, course.from.h, course.from.m, course.to.h, course.to.m));
   
   var courseTitleDOM = $(courseTextDOM[0]);
   var courseInstrDOM = $(courseTextDOM[1]);
   var courseTimeDOM = $(courseTextDOM[2]);
   
   if (fontSize < 10) {
      fontSize = Math.min(drawH * 0.3, baseFontSize * 0.8);
      lineHeight = drawH / 3;
      courseInstrDOM.css({display: 'inline-block', marginRight: fontSize + 'px'});
      courseTimeDOM.css({display: 'inline-block'});
   }
   
   courseDOM.append($(courseTextDOM));
   
   courseTitleDOM.css({
      marginTop: lineHeight / 2 + 2 + "px"
   });
   
   courseDOM.css({
      height: drawH,
      width: drawW,
      position: 'absolute',
      zIndex: 999,
      top: drawT,
      left: drawL,
      fontSize: fontSize,
      lineHeight: lineHeight + 'px',
   });
   
   convas.append(courseDOM);
}

function roundMin(min) {
   return 10 * Math.floor(min / 10);
}