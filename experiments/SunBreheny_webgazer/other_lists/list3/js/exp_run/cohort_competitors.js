

function make_slides(f) {
  var slides = {};

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
          text: "Either you haven't performed the calibration yet, or your calibration score is too low. Your calibration score must be 50% to begin the task. Please click Recalibrate to try calibrating again.",
          buttons: {
            cancel: false,
            confirm: true
          }
        })
      }
    }
  });

  // include if u wanna have a sound test

  // slides.sound_test = slide({
  //   name: "sound_test",
  //   soundtest_verification : function(e){
  //     // check word
  //     sound_entry = $("#sound_test_entry").val().toUpperCase().trim();
  //     console.log(sound_entry)
  //     if (sound_entry == 'APPLE'){
  //       exp.trial_no = 0;
  //       exp.go();
  //     } else{
  //       $("#sound_test_entry").val(""); // clear text box
  //       $("#sound_test_err").show();
  //     }
  //   }
  // });

  slides.single_trial = slide({
    name: "single_trial",
    present: exp.current_exp_list, // every element in exp.current_exp_list is passed to present_handle one by one as 'trial'
    present_handle: function (trial) {
      this.trial_start = Date.now();

      if (exp.DUMMY_MODE) {
        exp.trial_no = 0
      }
      exp.trial_no += 1;
      //console.log("exp.trial_no:", exp.trial_no)

      $("#aud").hide();

      exp.trial_name = trial.audio.split('.')[0]
      exp.current_trial = trial

      $("#img_instructions").hide();
      if (exp.trial_no == 1 || exp.trial_no == 2) {
        $("#img_instructions").show();
      }
      //console.log("trial", trial)
      exp.display_imgs(exp.current_trial); // get imgs, show them

      if (!exp.DUMMY_MODE) {
        hideVideoElements();
        startGazer();
        //console.log("started gazer")
        webgazer.setGazeListener(function (data, elapsedTime) {
          if (data == null) {
            return;
          }
          //console.log("pushed gaze data")
          //console.log("elapsed time: ", elapsedTime)
          var xprediction = data.x;
          var yprediction = data.y;
          var unixtime = Date.now(); // unix timestamp - so you have absolute timestamps

          exp.tlist.push(elapsedTime); // this is the elapsed time since webgazer initialized
          exp.unixtlist.push(unixtime);
          exp.xlist.push(xprediction);
          exp.ylist.push(yprediction);
        });
      }

      $("#imgwrapper").show();
      $("#continue_button").hide();
      $("#next_button").hide();
      $(".err").hide();
      $(".err_part2").hide();
      $("#scene_instructions").hide();

    },

    next_trial: function (e) {
      //console.log("CLICKED NEXT TRIAL")
      if (exp.clicked == null) {
        $(".err").show();
      } else {
        $(".err").hide();
        //console.log("img clicked", exp.clicked)
        this.log_responses();
        _stream.apply(this); // go to next element in exp.current_exp_list
        exp.tlist = [];
        exp.unixtlist = [];
        exp.xlist = [];
        exp.ylist = [];
        exp.clicked = null;
        exp.endPreview = false;
      }
    },

    log_responses: function () {
      exp.data_trials.push({
        "trial": exp.trial_name,
        "selected_img": exp.clicked,
        'img_left': exp.current_trial.img_left,
        'img_right': exp.current_trial.img_right,
        'condition': exp.current_trial.condition,
        'criticality': exp.current_trial.criticality,
        'exp_list': exp.exp_list_no,
        "start_time": _s.trial_start,
        "rt": Date.now() - _s.trial_start,
        "img_selection_rt": exp.img_selection_rt,
        "current_windowW": window.innerWidth,
        "current_windowH": window.innerHeight,
        "endPreviewTime": exp.endPreviewTime,
        "aud_duration": aud_dur,
        "audio_loaded_time": exp.audloadedTime,
        "trial_no": exp.trial_no,
        "webgazer_time": exp.tlist,
        "unix_time": exp.unixtlist,
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
          //           pay_fair : payfair,
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
      if (!exp.DUMMY_MODE) {
        webgazer.end();
      }
      exp.data = {
        "trials": exp.data_trials,
        "system": exp.system,
        "subject_information": exp.subj_data,
      };
      //console.log(turk);
      proliferate.submit(exp.data)
    }
  });

  return slides;
}

/// init ///
function init_explogic() {

  //Experiment constants
  exp.DUMMY_MODE = false // set to true if want to test without eyetracking
  exp.N_TRIALS = 54
  PRECISION_CUTOFF = 50;
  // size of imgs - just for your records
  IMG_HEIGHT = 473
  IMG_WIDTH = 467

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
  exp.minWindowHeight = 650

  //Initializing data frames
  exp.tlist = [];
  exp.unixtlist = [];
  exp.xlist = [];
  exp.ylist = [];
  exp.clicked = null
  exp.accuracy_attempts = []

  // INITIALIZE EXP LIST

  // ppt is randomly assigned a list at init.
  var exp_list_nos = ['A1', 'A2', 'B1', 'B2']
  exp.exp_list_no = _.shuffle(exp_list_nos).pop(); // randomly pick a list
  exp.current_exp_list = exp_lists.filter(a => a.exp_list == exp.exp_list_no);
  exp.current_exp_list = _.shuffle(exp.current_exp_list);
  // exp.current_exp_list = exp.current_exp_list.slice(1, 3) // Use for testing that responses are getting logged correctly

  // Trial set up (see init_trial_detials.js)
  preloadmedia();

  exp.display_imgs = function (trial) {
    $("#imgwrapper").hide();
    $("#img_table").hide();

    // change the images
    $("#img_left").attr('src', "static/imgs/" + trial.img_left);
    $("#img_right").attr("src", "static/imgs/" + trial.img_right);
    //console.log("DISPLAYED IMAGES")

    // set onclick behaviour
    var images = document.querySelectorAll('.imgs');
    images.forEach(function (img) {
      $(img).css("border", "0px");
      img.addEventListener('click', function () {
        if (document.getElementById("aud").ended & exp.endPreview == true) {
          exp.img_selection_rt = Date.now() - _s.trial_start
          $(this).css("border", "2px solid red");
          if (img.id == 'img_left') {
            exp.clicked = trial.img_left
          } else {
            exp.clicked = trial.img_right
          }
          if (!exp.DUMMY_MODE) {
            webgazer.pause(); // pause once img has been selected as trial is over
          }
          setTimeout(function () {
            $("#imgwrapper").hide();
            $("#img_table").hide();
            $("#img_instructions").hide();
            $("#next_button").show();
          }, 1000);
        }
      });
    });
    // preview imgs before play button appears
    setTimeout(function () {
      $("#continue_button").show();
      exp.endPreview = true
      exp.endPreviewTime = Date.now()
      $("#imgwrapper").show();
      $("#continue_button").hide();
      $("#aud").attr("src", "static/audio/" + exp.trial_name + ".wav")[0];
      $("#aud")[0].play();
      aud.onloadedmetadata = function () {
        aud_dur = aud.duration;
        exp.audloadedTime = Date.now()
      };
    }, 500); // preview imgs for 500ms

    $("#imgwrapper").show();
    $("#img_table").show();
  };


  //blocks of the experiment:
  if (!exp.DUMMY_MODE) {
    exp.structure = ["i0", "training_and_calibration", "startPage", "single_trial", "subj_info", "thanks"];
  } else {
    exp.structure = ["i0", "startPage", "single_trial", "subj_info", "thanks"];
  }
  exp.data_trials = [];
  exp.slides = make_slides(exp);
  exp.nQs = utils.get_exp_length();

  // EXPERIMENT RUN
  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
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
