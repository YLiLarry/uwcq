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
      
      var cal = $('.schedule-calendar.' + this.get('schedule.id'));
      
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
   console.log("rander cal", schedule.id);
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
   console.log("rander cal ends", schedule.id, endT - startT);
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
   var courseTextDOM = $.parseHTML(S.sprintf('<div class="textbox"><div class="title">%s %s %s</div><div class="instructor">%s</div><div class="time">%d:%02d - %d:%02d</div></div>', 
                                 course.catalog, course.number, course.title, course.instructor, course.from.h, course.from.m, course.to.h, course.to.m));
   
   var textboxDOM = $(courseTextDOM[0]);
   var courseTitleDOM = textboxDOM.children('.title');
   var courseInstrDOM = textboxDOM.children('.instructor');
   var courseTimeDOM = textboxDOM.children('.time');
   
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
   
   textboxDOM.css({
      position: 'relative',
      height: 'auto'
   })
   
   courseTitleDOM.css({
      paddingTop: courseDOM.height() * 0.1,
      paddingBottom: courseDOM.height() * 0.1,
      paddingLeft: courseDOM.width() * 0.05,
      paddingRight: courseDOM.width() * 0.05,
   });  
   courseInstrDOM.css({
      paddingBottom: courseDOM.height() * 0.1,
      paddingLeft: courseDOM.width() * 0.05,
      paddingRight: courseDOM.width() * 0.05,
   });
   courseTimeDOM.css({
      paddingLeft: courseDOM.width() * 0.05,
      paddingRight: courseDOM.width() * 0.05,
      paddingBottom: courseDOM.height() * 0.1,
   })
   

   var attmpt = 0;
   
   function textFit() {
      var bh = courseDOM.height() - textboxDOM.outerHeight(true);
      return bh > 0;
   }
   
   do {
      if (fontSize < 11) {
         if (attmpt >= 0) {
            courseDOM.css({
               padding: 0,
               wordWrap: 'break-word',            
            });              
            courseTimeDOM.css({fontSize: fontSize - 1 + 'px'});
         } 
         if (attmpt >= 1) {
            courseInstrDOM.css({padding: 0});
            courseTimeDOM.css({paddingTop: 0});
         }
         if (attmpt >= 2) {
            courseTitleDOM.css({padding: 0});  
            courseTimeDOM.css({padding: 0});
         }
         if (attmpt >= 3) {
            courseInstrDOM.css({display: 'inline-block', padding: '0 3px'});  
            courseTimeDOM.css({display: 'inline-block', padding: '0 3px'});  
            textboxDOM.css({padding: '2px'});
         }
         if (attmpt <= 4) {
            fontSize++;
            attmpt++;
         }    
      }
      courseDOM.css({
         fontSize: fontSize + 'px'
      });
      fontSize -= 1;
   } while (! textFit());
   
   var targetMid = courseDOM.height()/2;
   function mid() {
      return textboxDOM.position().top + textboxDOM.outerHeight(true) / 2;
   }
   var i = 0;
   while (mid() < targetMid) {
      console.log(targetMid, mid(), textboxDOM.position().top)
      i += 1;
      textboxDOM.css({top: i + 'px'});
   }
}

function roundMin(min) {
   return 10 * Math.floor(min / 10);
}

