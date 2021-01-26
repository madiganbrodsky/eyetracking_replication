function make_slides(f) {
  var slides = {};

  // slides.i0 = slide({
  //   name : "i0",
  //   start: function() {
  //   exp.startT = Date.now();
  //   }
  // });

  slides.i0 = slide({
    name: "i0",
    exp_start: function () {
      $("#img_instructions").hide();
      $("#scene_instructions").hide();
      $("#sound_test_err").hide();
      // exp.startT = Date.now();
    }
  });

  slides.startPage = slide({
    name: "startPage",
    exp_start: function () { },
    start: function () {
    },
    button: function () {
      exp.go()
    }
  });

  slides.training_and_calibration = slide({
    name: "training_and_calibration",
    start_camera: function (e) {
      $("#start_camera").hide();
      $("#start_calibration").show();
      init_webgazer();
    },
    finish_calibration_start_task: function (e) {
      if (precision_measurement >= PRECISION_CUTOFF) {
        // hide webgazer video feed and prediction points
        hideVideoElements();

        webgazer.pause();
        exp.trial_no = 0;
        exp.go();
      }
      else {
        exp.accuracy_attempts.push(precision_measurement);
        swal({
          title: "Calibration Fail",
          text: "Either you haven't performed the calibration yet, or your calibration score is too low. \
           Your calibration score must be 50% to begin the task. Please click Calibrate to try calibrating again. \
           Click Instructions to see tips for calibrating.",
          buttons: {
            cancel: false,
            confirm: true
          }
        })
      }
    }
  });

  slides.instructions = slide({
    name: "instructions",
    button: function () {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });


  slides.sound_test = slide({
    name: "sound_test",
    soundtest_OK: function (e) {
      exp.trial_no = 0;
      exp.go();
    }
  });

  slides.practice = slide({
    name: "practice",
    start: function () {
      $(".err").hide();
      console.log("in practice")
    },
    present: exp.practice,
    present_handle: function (stim) {
      exp.playing = false;
      this.stim = stim;
      $(".second_slide").hide();
      $(".grid_button").hide();
      $(".imgwrapper").hide();

      exp.objects = ["", "apples, pears, bananas and oranges.",
        "apples, pears, bananas and oranges.",
        "scissors, pencils, erasers and rulers.",
        "scissors, pencils, erasers and rulers.",
        "plates, forks, spoons and knives.",
        "plates, forks, spoons and knives."]

      if ((stim.displayID == 1) | (stim.displayID == 3) | (stim.displayID == 5)) {
        var init_sentence = "This is " + stim.figure + ". " + stim.figure + " gives out " + stim.setting + " to children every day."
        var init_image = '<img src="images/' + stim.figure + '.png" style="height:300px" class="center">';
        $(".sentence").html(init_sentence);
        $(".sentence").show();
        $(".image").html(init_image);
        $(".second_slide").show();

      }
      else if ((stim.displayID == 2) | (stim.displayID == 4) | (stim.displayID == 6)) {
        var second_sentence = "Here is what " + stim.figure + " has on Tuesday. " + stim.figure + " has " + exp.objects[stim.displayID]
        $(".sentence").html(second_sentence);
        $(".sentence").show();
        var second_image = '<img src="images/p.trial_' + stim.displayID + '.jpg" style="height:300px" class="center">';
        $(".image").html(second_image);
        $(".grid_button").show();
      }

    },

    second_slide: function () {
      $(".second_slide").hide();
      var second_sentence = "Here is what " + this.stim.figure + " has on Monday. " + this.stim.figure + " has " + exp.objects[this.stim.displayID] + " " + this.stim.pronoun + " always brings more than enough. The leftover " + this.stim.setting + " are put in the middle."
      $(".sentence").html(second_sentence);
      var second_image = '<img src="images/p.trial_' + this.stim.displayID + '.jpg" style="height:300px" class="center">';
      $(".image").html(second_image);
      $(".grid_button").show();
    },

    grid: function () {
      $(".err").hide();
      $(".image").html("  ");
      $(".sentence").hide();
      $(".grid_button").hide();

      exp.selection;
      exp.rt = 0;
      exp.trial_start = Date.now();

      // display images
      $(".loc1").attr('src', "images/" + this.stim.location1 + '.png');
      $(".loc2").attr('src', "images/" + this.stim.location2 + '.png');
      $(".loc3").attr('src', "images/" + this.stim.location3 + '.png');
      $(".loc4").attr('src', "images/" + this.stim.location4 + '.png');
      $(".loc5").attr('src', "images/" + this.stim.location5 + '.png');
      $(".loc6").attr('src', "images/" + this.stim.location6 + '.png');
      $(".loc7").attr('src', "images/boy.png");
      $(".loc8").attr('src', "images/boy.png");
      $(".loc9").attr('src', "images/girl.png");
      $(".loc10").attr('src', "images/girl.png");
      $(".imgwrapper").show();

      exp.prime = this.stim.prime
      setTimeout(function () {
        aud = document.getElementById("stim");
        aud.src = "audio/" + exp.prime + ".wav";
        aud.currentTime = 0;
        aud.play();
        console.log("Play audio")
        exp.audio_play_unix = Date.now();
        exp.playing = true;
        // when audio ends
        aud.addEventListener('ended', function () {
          exp.playing = false;
        }, false);
        // make images clickable
        $('img').bind("click", function (e) {
          e.preventDefault();
            if (exp.playing == false) {
              exp.selection = $(this).attr("id")
              exp.rt = (Date.now() - exp.trial_start);
              $('img').unbind('click')
              _s.button();
            }
        });
      }, 1000);
    },

    button: function () {
      // console.log("Selection: ", exp.selection)
      // console.log("Timer: ", exp.rt)
      this.log_responses();
      _stream.apply(this);
    },

    log_responses: function () {
      exp.data_trials.push({
        "slide_number": exp.phase,
        "displayID": this.stim.displayID,
        "trial_type": this.stim.ExpFiller,
        "setting": this.stim.setting,
        "figure": this.stim.figure,
        "display_type": this.stim.display_type,
        "audio": this.stim.prime,
        "location1": this.stim.location1,
        "location2": this.stim.location2,
        "location3": this.stim.location3,
        "location4": this.stim.location4,
        "location5": this.stim.location5,
        "location6": this.stim.location6,
        "location7": this.stim.location7,
        "location8": this.stim.location8,
        "location9": this.stim.location9,
        "location10": this.stim.location10,
        "condition": this.stim.condition1,
        "size": this.stim.size1,
        "determiner": this.stim.determiner1,
        "target1": this.stim.target1,
        "competitor1": this.stim.competitor1,
        "target_num_object": this.stim.target_object1,
        "target_figure": this.stim.target_figure1,
        "target_object": this.stim.object1,
        "correctAns1": this.stim.correctAns1,
        "correctAns2": this.stim.correctAns2,
        "response": exp.selection,
        "response_time": exp.rt,
      });
    }

  });

  slides.afterpractice = slide({
    name: "afterpractice",
    button: function () {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.trial = slide({
    name: "trial",
    present: exp.stims_shuffled, //every element in exp.stims is passed to present_handle one by one as 'stim'
    start: function () {
    },
    present_handle: function (stim) {
      $(".cross_center").hide();
      exp.selection;
      exp.rt = 0;
      exp.unix_rt = 0;
      exp.trial_start = Date.now();
      exp.playing = false;
      console.log("******************************")
      console.log("Trial start: ", exp.trial_start)

      $(".err").hide();
      
      this.stim = stim; // store this information in the slide so you can record it later
      $(".loc1").attr('src', "images/" + stim.location1 + '.png');
      $(".loc2").attr('src', "images/" + stim.location2 + '.png');
      $(".loc3").attr('src', "images/" + stim.location3 + '.png');
      $(".loc4").attr('src', "images/" + stim.location4 + '.png');
      $(".loc5").attr('src', "images/" + stim.location5 + '.png');
      $(".loc6").attr('src', "images/" + stim.location6 + '.png');
      $(".loc7").attr('src', "images/boy.png");
      $(".loc8").attr('src', "images/boy.png");
      $(".loc9").attr('src', "images/girl.png");
      $(".loc10").attr('src', "images/girl.png");
      $(".imgwrapper").show();

      if (!exp.DUMMY_MODE) {
        hideVideoElements();
        startGazer();
        //console.log("started gazer")
        webgazer.setGazeListener(function (data, elapsedTime) {
          if (data == null) {
            return;
          }
          var xprediction = data.x;
          var yprediction = data.y;
          var unixtime = Date.now(); // unix timestamp - so you have absolute timestamps
          exp.tlist.push(elapsedTime); // this is the elapsed time since webgazer initialized
          exp.unixtlist.push(unixtime);
          exp.xlist.push(xprediction);
          exp.ylist.push(yprediction);
        });
      }

      console.log("Wait 1sec")
      exp.prime = this.stim.Prime

      // 1 sec preview before audio
      setTimeout(function () {
        aud = document.getElementById("stim");
        aud.src = "audio/" + exp.prime + ".wav";
        aud.currentTime = 0;
        aud.play();
        console.log("Play audio")
        exp.audio_play_unix = Date.now();
        exp.playing = true;
        // when audio ends
        aud.addEventListener('ended', function () {
          exp.playing = false;
        }, false);
        // make images clickable
        $('img').bind("click", function (e) {
          e.preventDefault();
            if (exp.playing == false) {
              exp.selection = $(this).attr("id")
              console.log("selection", exp.selection)
              exp.rt = (Date.now() - exp.trial_start);
              $('img').unbind('click')
              _s.button();
            }
        });

      }, 1000);
    },

    button: function () {
      webgazer.pause();
      exp.rt = exp.unix_rt - exp.trial_start;
      console.log("Trial start: ", exp.trial_start)
      console.log("Selection: ", exp.selection);
      console.log("RT: ", exp.rt);
      console.log("Unix RT: ", exp.unix_rt);
      console.log("Audio play unix: ", exp.audio_play_unix)
      this.log_responses();
      exp.tlist = [];
      exp.unixtlist = [];
      exp.xlist = [];
      exp.ylist = [];

      // fixation cross
      exp.this = this
      $(".imgwrapper").hide();
      $(".cross_center").show();
      setTimeout(function () {
        _stream.apply(exp.this);
      }, 1000);
    },
    log_responses: function () {
      exp.data_trials.push({
        "slide_number": exp.phase,
        "displayID": this.stim.displayID,
        "trial_type": this.stim.ExpFiller,
        "setting": this.stim.setting,
        "figure": this.stim.figure,
        "display_type": this.stim.display_type,
        "audio": this.stim.Prime,
        "list": this.stim.list,
        "location1": this.stim.location1,
        "location2": this.stim.location2,
        "location3": this.stim.location3,
        "location4": this.stim.location4,
        "location5": this.stim.location5,
        "location6": this.stim.location6,
        "location7": this.stim.location7,
        "location8": this.stim.location8,
        "location9": this.stim.location9,
        "location10": this.stim.location10,
        "condition": this.stim.condition,
        "size": this.stim.size,
        "determiner": this.stim.determiner,
        "target1": this.stim.target1,
        "target2": this.stim.target2,
        "competitor1": this.stim.competitor1,
        "competitor2": this.stim.competitor2,
        "target_num_object": this.stim.target_object3,
        "target_figure": this.stim.target_figure3,
        "target_object": this.stim.object3,
        "correctAns1": this.stim.correctAns1,
        "correctAns2": this.stim.correctAns2,
        "response": exp.selection,
        "response_time": exp.rt,
        "unix_time": exp.unix_rt,
        "audio_play_unix": exp.audio_play_unix,
        "webgazer_time": exp.tlist,
        'x': exp.xlist,
        'y': exp.ylist
      });
    }
  });

  slides.subj_info = slide({
    name: "subj_info",
    submit: function (e) {
      lg = $("#language").val();
      age = $("#participantage").val();
      gender = $("#gender").val();
      headphones = $("#headphones").val();
      eyesight = $("#eyesight").val();
      eyesight_task = $("#eyesight_task").val();
      payfair = $("#pay_fair").val();
      camblock = $("#camblock").val();
      if (lg == '' || age == '' || gender == '' || headphones == '' || eyesight == '-1' || eyesight_task == '-1' || payfair == '-1' || camblock == '-1') {
        $(".err_part2").show();
      } else {
        $(".err_part2").hide();
        exp.subj_data = {
          language: lg,
          age: age,
          gender: gender,
          headphones: headphones,
          eyesight: eyesight,
          eyesight_task: eyesight_task,
          pay_fair: payfair,
          camblock: camblock,
          //           whatstudy : $("#what_study").val(),
          comments: $("#comments").val(),
          accuracy: precision_measurement,
          previous_accuracy_attempts: exp.accuracy_attempts,
          time_in_minutes: (Date.now() - exp.startT) / 60000
        };
        exp.go(); //use exp.go() if and only if there is no "present" data.
      }
    }
  });

  slides.thanks = slide({
    name: "thanks",
    start: function () {
      exp.data = {
        "trials": exp.data_trials,
        "catch_trials": exp.catch_trials,
        "system": exp.system,
        "condition": exp.condition,
        "subject_information": exp.subj_data,
        "time_in_minutes": (Date.now() - exp.startT) / 60000
      };
      setTimeout(function () { turk.submit(exp.data); }, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  // exp.trials = [];
  // exp.catch_trials = [];

  function preload() {
    for (pos in exp.stims) {
      new Audio().src = "audio/" + exp.stims[pos].Prime + ".wav";
    };
    console.log("loaded all the audio");
    for (pos in exp.stims) {
      for (var i = 1; i <= 10; i++) {
        var locnum = "location" + i;
        new Image().src = "images/" + exp.stims[pos][locnum] + ".png";
      };
    };
    console.log("loaded all the images");
  };
  preload();

  //Experiment constants
  exp.DUMMY_MODE = false; // set to true if want to test without eyetracking
  exp.N_TRIALS = 54
  PRECISION_CUTOFF = 50;
  IMG_HEIGHT = 110   // size of imgs - just for your records -- TODO: change
  IMG_WIDTH = 110

  exp.system = {
    Browser: BrowserDetect.browser,
    OS: BrowserDetect.OS,
    screenH: screen.height,
    screenW: screen.width,
    windowH: window.innerHeight,
    windowW: window.innerWidth,
    imageH: IMG_HEIGHT,
    imageW: IMG_WIDTH
  };

  // min size the browser needs to be for current setup
  exp.minWindowWidth = 1280
  exp.minWindowHeight = 750

  //Initializing data frames
  exp.tlist = [];
  exp.unixtlist = [];
  exp.xlist = [];
  exp.ylist = [];
  exp.clicked = null
  exp.accuracy_attempts = []

  exp.stims_shuffled = _.shuffle(exp.stims);

  // exp.structure = ["i0", "training_and_calibration", "startPage","instructions"];

  if (!exp.DUMMY_MODE) {
    // exp.structure = ["i0", "training_and_calibration", "startPage", "instructions", "trial", 'subj_info', 'thanks'];
    exp.structure = ["i0", "training_and_calibration", "startPage", "instructions", "sound_test", "practice", "afterpractice", "trial", 'subj_info', 'thanks'];
  } else {
    exp.structure = ["i0", "startPage", "instructions", "sound_test", "practice", "afterpractice", "trial", 'subj_info', 'thanks'];
  }

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
  //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  $("#windowsize_err").hide();
  $("#sound_test_err").hide();

  $("#start_button").click(function () {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function () { $("#mustaccept").show(); });
      if (window.innerWidth >= exp.minWindowWidth & window.innerHeight >= exp.minWindowHeight) {
        exp.startT = Date.now();
        exp.go();
        if (!exp.DUMMY_MODE) {
          ClearCanvas();
          helpModalShow();
          $("#start_calibration").hide();
          $("#begin_task").hide();
        }
      }
      else {
        $("#windowsize_err").show();
      }
    }
  });

  $(".response_button").click(function () {
    var val = $(this).val();
    _s.continue_button(val);
  });

  exp.go(); //show first slide
}
