import Ember from 'ember';
import S from 'npm:sprintf-js'


var timeIntervals = R.map((t)=>({h : t[0], 
                             m : S.sprintf('%02d',t[1]), 
                             hr : t[1] == 0}), 
                  R.xprod(R.range(8,23), R.map(R.multiply(10),R.range(0,6))));
timeIntervals.push({h: '23', m:'00', hr: true});

export default Ember.Component.extend({
   time: timeIntervals,
   days: ['', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri'],
   willRender() {
      console.log("schedule-calendar willRender");
   },
   didRender() {
      console.log("schedule-calendar didRender");
      
      var self = this;
      
      var cal = $('.schedule-calendar.' + this.get('schedule.key'));
      
      function renderCal() {
         renderCourses(self.get('schedule'), cal);
      }
      renderCal();
      $(window).resize(renderCal);
      
      // renderCal();
      
      
   }
});

function renderCourses(schedule, cal) {
   var startT = new Date();
   console.log("rander cal", schedule.key);
   console.log(schedule);
   
   cal.children('.convas').html("");
   
   var grid = cal.children('.grid');
   var body = grid.children('.g-body');
   var h = grid.innerHeight();
   var w = grid.innerWidth();
   var hh = grid.children('.g-head').height();
   var bh = h - hh;
   var fontSize = parseInt(cal.css('font-size'));
   var lw = fontSize * 4;
   
   body.css({
      height: bh,
   }).children('.g-row').css({
      height: bh / timeIntervals.length + 'px'
   });
   
   grid.find('.g-cell').not(':first-child').css({
      width: (grid.width() - lw) / 5
   });
      
   
   grid.find('.g-cell:first-child').css({
      width: lw
   });
      
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
   var fontSize = parseInt(cal.css('font-size'));
   var startBlock = cal.find(S.sprintf('.%s.%s.%02s', course.day, course.from.h, roundMin(course.from.m)));
   var endBlock = cal.find(S.sprintf('.%s.%s.%02s', course.day, course.to.h, roundMin(course.to.m)));
   var drawL = startBlock.position().left;
   var drawT = startBlock.position().top;
   var drawW = startBlock.width();
   var drawH = endBlock.position().top - drawT;
   var width = startBlock.width();
   
   startBlock.css('background-color: green');
   endBlock.css('background-color: green');
   var convas = cal.children('.convas');
   var courseDOM = $($.parseHTML(S.sprintf('<div class="course %s"></div>', course.id))[0]);
   var courseTextDOM = $.parseHTML(S.sprintf('<div class="title">%s %s %s</div><div class="instructor">%s</div><div class="time">%d:%02d - %d:%02d</div>', 
                                 course.category, course.number, course.title, course.instructor, course.from.h, course.from.m, course.to.h, course.to.m));
   
   var courseTitleDOM = $(courseTextDOM[0]);
   var courseInstrDOM = $(courseTextDOM[1]);
   var courseTimeDOM = $(courseTextDOM[2]);
   
   courseDOM.append($(courseTextDOM));
   convas.append(courseDOM);
   
   courseDOM.css({
      height: drawH,
      width: drawW,
      position: 'absolute',
      zIndex: 999,
      top: drawT,
      left: drawL,
   });
   
   
   courseTitleDOM.css({
      position: 'relative',
      marginTop: courseDOM.height() * 0.1,
      marginBottom: courseDOM.height() * 0.1,
      marginLeft: courseDOM.width() * 0.05,
      marginRight: courseDOM.width() * 0.05,
   });  
   courseInstrDOM.css({
      position: 'relative',
      marginBottom: courseDOM.height() * 0.1,
      marginLeft: courseDOM.width() * 0.05,
      marginRight: courseDOM.width() * 0.05,
   });
   courseTimeDOM.css({
      position: 'relative',
      marginLeft: courseDOM.width() * 0.05,
      marginRight: courseDOM.width() * 0.05,
      marginBottom: courseDOM.height() * 0.1,
   })
   

   function textFit() {
      var padT = courseDOM.css('padding-top');
      var padB = courseDOM.css('padding-bottom');
      var bh = courseDOM.height() - courseTitleDOM.outerHeight(true) - courseInstrDOM.outerHeight(true) - courseTimeDOM.outerHeight(true);
      // var bw = courseDOM.width() - Math.max(courseTitleDOM.outerWidth(true), courseInstrDOM.outerWidth(true), courseTimeDOM.outerWidth(true));
      // console.log('textFit', bw)
      return bh > 0;
            
   }
   
   
   do {
      if (fontSize < 12) {
         courseDOM.css({
            padding: 0            
         });
         courseTitleDOM.css({
            position: 'relative',
            wordWrap: 'break-word',
            overflow: 'hidden',
            margin: 0
         });  
         courseInstrDOM.css({
            position: 'relative',
            margin: 0
         });
         courseTimeDOM.css({
            position: 'relative',
            margin: 0
         });
      }
      courseDOM.css({
         fontSize: fontSize + 'px'
      });
      fontSize -= 1;
   } while (! textFit());
   
   var targetMid = courseDOM.height()/2;
   function mid() {
      return courseTitleDOM.position().top + 
               (courseTitleDOM.outerHeight(true) 
                  + courseInstrDOM.outerHeight(true) 
                  + courseTimeDOM.outerHeight(true)) / 2;
   }
   var i = 0;
   while (mid() < targetMid) {
      console.log(targetMid, mid(), courseTitleDOM.position().top)
      i += 1;
      courseTitleDOM.css({top: i + 'px'});
      courseInstrDOM.css({top: i + 'px'});
      courseTimeDOM.css({top: i + 'px'});
   }
}

function roundMin(min) {
   return 10 * Math.floor(min / 10);
}

