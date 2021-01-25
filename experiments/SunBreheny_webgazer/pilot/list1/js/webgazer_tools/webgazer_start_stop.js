function hideVideoElements() {
  webgazer.showVideoPreview(false);
  webgazer.showPredictionPoints(false);
  webgazer.showVideo(false);
  webgazer.showFaceOverlay(false);
  webgazer.showFaceFeedbackBox(false);
  document.getElementById('webgazerVideoFeed').style.visibility = 'hidden'
}

function startGazer() {
  window.onload = async function(){
    document.getElementById('webgazerVideoFeed').style.visibility = 'hidden'
  };
  webgazer.resume();
}
