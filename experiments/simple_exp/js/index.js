function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
    name : "i0",
    start: function() {
    exp.startT = Date.now();
    }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.trial = slide({
    name : "trial",
    present: exp.stims, //every element in exp.stims is passed to present_handle one by one as 'stim'
    
    present_handle : function(stim) {
      $(".err").hide();
    
      this.stim = stim; // store this information in the slide so you can record it later
      // $(".prompt").html(stim.sentence);

      var instruction = stim.instruction3;
      $(".instruction").html(instruction);
    
      var loc1_img = '<img src="images/'+stim.location1+'.png"style="height:100px" class="left">';
      $(".loc1").html(loc1_img);

      var loc2_img = '<img src="images/'+stim.location2+'.png" style="height:100px" class="center">';
      $(".loc2").html(loc2_img);

      var loc3_img = '<img src="images/'+stim.location3+'.png" style="height:100px" class="center">';
      $(".loc3").html(loc3_img);

      var loc4_img = '<img src="images/'+stim.location4+'.png" style="height:100px" class="center">';
      $(".loc4").html(loc4_img);

      var loc5_img = '<img src="images/'+stim.location5+'.png" style="height:90px" class="right">';
      $(".loc5").html(loc5_img);

      var loc6_img = '<img src="images/'+stim.location6+'.png" style="height:90px" class="left">';
      $(".loc6").html(loc6_img);
      
      
      var boy = '<img src="images/boy.png" style="height:200px" align="buttom">';
      var girl = '<img src="images/girl.png" style="height:200px" align="buttom">';
      $(".loc7").html(boy);
      $(".loc8").html(boy);
      $(".loc9").html(girl);
      $(".loc10").html(girl);
    },

    button : function() {
      this.log_responses();
      /* use _stream.apply(this); if and only if there is
      "present" data. (and only *after* responses are logged) */
      _stream.apply(this);
      
    },
    log_responses : function() {
    exp.data_trials.push({
        "displayID" : this.stim.displayID,
        "response" : exp.sliderPost
    });

    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  exp.trials = [];
  exp.catch_trials = [];

  //exp.condition = _.sample(["condition1", "condition2"]);

  // exp.stims =  [
  //   {sentence: "The horse raced past the barn fell."},
  //   {sentence: "The horse that raced past the barn fell."},
  // ];

  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };

  //blocks of the experiment:
  exp.structure=["trial", 'subj_info', 'thanks'];
  //exp.structure=["i0", "instructions", "trial", 'subj_info', 'thanks'];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
