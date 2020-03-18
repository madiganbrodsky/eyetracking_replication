function make_slides(f) {
  var slides = {};

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

  slides.practice = slide({
    name : "practice",
    start: function(){
      exp.counter = 0;
    },
    present: exp.practice,
    present_handle : function(stim) {
      
      exp.selection_array=[];    
      this.stim = stim; 
      $(".grid_button").hide();

      var objects = ["","apples, pears, bananas and oranges.",
                        "apples, pears, bananas and oranges.",
                        "plates, forks, spoons and knives.",
                        "plates, forks, spoons and knives.",
                        "scissors, pencils, erasers and rulers.",
                        "scissors, pencils, erasers and rulers."]
      var images = [ 

      ]
      if ((stim.displayID == 1)| (stim.displayID == 3)| (stim.displayID == 5)) {
        var init_sentence = "This is " + stim.figure + ". " + stim.pronoun + " gives out fruit to children every day."
        var init_image = '<img src="images/'+ stim.figure + '.png" style="height:300px" class="center">';
        $(".sentence").html(init_sentence);
        $(".image").html(init_image);

        setTimeout(function(){ 
          var second_sentence = "Here is what " + stim.pronoun.toLowerCase() + " has on Monday. " + stim.pronoun + " has " +objects[stim.displayID]
          $(".sentence").html(second_sentence);
          $(".grid_button").show();
        }, 3000);
      
      }
      else if ((stim.displayID == 2)| (stim.displayID == 4)| (stim.displayID == 6)) {
        var init_sentence = "Here is what " + stim.pronoun.toLowerCase() + " has on Tuesday. " + stim.pronoun + " has " +objects[stim.displayID]

        $(".sentence").html(second_sentence);
        $(".grid_button").show();
      }

    },

    grid: function(){
      $(".image").html("  ");
      $(".grid_button").hide();

      var instruction = this.stim.instruction1;
      words = instruction.split(" ")
      init_instruction = words[0]+ " " + words[1] + " " + words[2]; // click on the
      instruction1 = init_instruction + " " + words[3] + " " + words[4] + " " + words[5]; // click on the boy that has
      instruction2 = instruction1 + " " + words[6] + " " + words[7] + " " + words[8] // click on the boy that has two of Susan's
      instruction3 = instruction2 + " " + words[9]  // click on the boy that has two of Susan's pears

      const instruction_array=[instruction1,instruction2,instruction3]

      $(".sentence").html(init_instruction);
  
      var loc1_img = '<img src="images/'+this.stim.location1+'.png"style="height:100px" class="left">';
      $(".loc1").html(loc1_img);
      var loc2_img = '<img src="images/'+this.stim.location2+'.png" style="height:100px" class="center">';
      $(".loc2").html(loc2_img);
      var loc3_img = '<img src="images/'+this.stim.location3+'.png" style="height:100px" class="center">';
      $(".loc3").html(loc3_img);
      var loc4_img = '<img src="images/'+this.stim.location4+'.png" style="height:100px" class="center">';
      $(".loc4").html(loc4_img);
      var loc5_img = '<img src="images/'+this.stim.location5+'.png" style="height:90px" class="right">';
      $(".loc5").html(loc5_img);
      var loc6_img = '<img src="images/'+this.stim.location6+'.png" style="height:90px" class="left">';
      $(".loc6").html(loc6_img);

      //make the boys and girls clickable too
      var boy = '<img src="images/boy.png" style="height:200px" align="buttom">';
      var girl = '<img src="images/girl.png" style="height:200px" align="buttom">';
      $(".loc7").html(boy);
      $(".loc8").html(boy);
      $(".loc9").html(girl);
      $(".loc10").html(girl);

      $(".loc").bind("click",function(e){
        e.preventDefault();
        console.log(exp.counter);
        if (exp.counter>2){
          exp.selection_array.push($(this).data().loc)
          exp.counter = 0;
          $(".loc").unbind('click')
          _s.button();
        } else {
          exp.selection_array.push($(this).data().loc)
          $(".sentence").html(instruction_array[exp.counter])
          exp.counter++;
        }
       });
    },

    button : function() {
      console.log("Location array => ",exp.selection_array)
      this.log_responses();
      _stream.apply(this); /* use _stream.apply(this); if and only if there is
      "present" data. (and only *after* responses are logged) */
    },
    
    log_responses : function() {
      exp.data_trials.push({
          "displayID" : this.stim.displayID,
          "setting" : this.stim.setting, 
          "figure" : this.stim.figure, 
          "display_type" : this.stim.display_type, 
          "location1" : this.stim.location1,
          "location2" : this.stim.location2,
          "location3" : this.stim.location3, 
          "location4" : this.stim.location4, 
          "location5" : this.stim.location5, 
          "location6" : this.stim.location6, 
          "location7" : this.stim.location7, 
          "location8" : this.stim.location8, 
          "location9" : this.stim.location9, 
          "location10" : this.stim.location10, 
          "Prime" : this.stim.Prime, 
          "target1" : this.stim.target1, 
          "target2" : this.stim.target2, 
          "competitor1" : this.stim.competitor1, 
          "competitor2" : this.stim.competitor2, 
          "condition" : this.stim.condition, 
          "determiner" : this.stim.determiner, 
          "size" : this.stim.size, 
          "ExpFiller" : this.stim.ExpFiller, 
          "correctAns1" : this.stim.correctAns1, 
          "correctAns2" : this.stim.correctAns2, 
          "list" : this.stim.list, 
          "target_object3" :this.stim.target_object3, 
          "target_figure3" :this.stim.target_figure3, 
          "instruction3" : this.stim.instruction3,
          "response" : exp.selection_array, 
        });
      }
  
  });

  slides.afterpractice = slide({
    name : "afterpractice",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.trial = slide({
    name : "trial",
    present: exp.stims, //every element in exp.stims is passed to present_handle one by one as 'stim'
    start: function(){
      exp.counter = 0;
    },
    present_handle : function(stim) {
      exp.selection_array=[];
      $(".err").hide();
    
      this.stim = stim; // store this information in the slide so you can record it later

      var instruction = stim.instruction3;
      words = instruction.split(" ")
      init_instruction = words[0]+ " " + words[1] + " " + words[2]; // click on the
      instruction1 = init_instruction + " " + words[3] + " " + words[4] + " " + words[5]; // click on the boy that has
      instruction2 = instruction1 + " " + words[6] + " " + words[7] + " " + words[8] // click on the boy that has two of Susan's
      instruction3 = instruction2 + " " + words[9]  // click on the boy that has two of Susan's pears

      const instruction_array=[instruction1,instruction2,instruction3]

      $(".instruction").html(init_instruction);
  
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

      //make the boys and girls clickable too
      var boy = '<img src="images/boy.png" style="height:200px" align="buttom">';
      var girl = '<img src="images/girl.png" style="height:200px" align="buttom">';
      $(".loc7").html(boy);
      $(".loc8").html(boy);
      $(".loc9").html(girl);
      $(".loc10").html(girl);

      
      $(".loc").bind("click",function(e){
        e.preventDefault();
        console.log(exp.counter);
        if (exp.counter>2){
          exp.selection_array.push($(this).data().loc)
          exp.counter = 0;
          $(".loc").unbind('click')
          _s.button();
        } else {
          exp.selection_array.push($(this).data().loc)
          $(".instruction").html(instruction_array[exp.counter])
          exp.counter++;
        }
       });

    },

    button : function() {
      console.log("Location array => ",exp.selection_array)
      this.log_responses();
      _stream.apply(this); /* use _stream.apply(this); if and only if there is
      "present" data. (and only *after* responses are logged) */
      
    },
    log_responses : function() {
    exp.data_trials.push({
        "displayID" : this.stim.displayID,
        "setting" : this.stim.setting, 
        "figure" : this.stim.figure, 
        "display_type" : this.stim.display_type, 
        "location1" : this.stim.location1,
        "location2" : this.stim.location2,
        "location3" : this.stim.location3, 
        "location4" : this.stim.location4, 
        "location5" : this.stim.location5, 
        "location6" : this.stim.location6, 
        "location7" : this.stim.location7, 
        "location8" : this.stim.location8, 
        "location9" : this.stim.location9, 
        "location10" : this.stim.location10, 
        "Prime" : this.stim.Prime, 
        "target1" : this.stim.target1, 
        "target2" : this.stim.target2, 
        "competitor1" : this.stim.competitor1, 
        "competitor2" : this.stim.competitor2, 
        "condition" : this.stim.condition, 
        "determiner" : this.stim.determiner, 
        "size" : this.stim.size, 
        "ExpFiller" : this.stim.ExpFiller, 
        "correctAns1" : this.stim.correctAns1, 
        "correctAns2" : this.stim.correctAns2, 
        "list" : this.stim.list, 
        "target_object3" :this.stim.target_object3, 
        "target_figure3" :this.stim.target_figure3, 
        "instruction3" : this.stim.instruction3,
        "response" : exp.selection_array, 
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

  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };

  //blocks of the experiment:
  exp.structure=["i0", "instructions", "practice", "afterpractice", "trial", 'subj_info', 'thanks'];
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
