/* this doesn't necessarily need to be in its own file -
previously there were several other functions here for setting up trials - DL */

// preload imgs and audio
function preloadmedia() {
	imgs = []
	audios = []
	resources = []
	for (i = 0; i < exp.current_exp_list.length; i++) {
		imgs.push('static/imgs/' + exp.current_exp_list[i].img_left);
		imgs.push('static/imgs/' + exp.current_exp_list[i].img_right);
		audios.push('static/audio/' + exp.current_exp_list[i].audio);
	}
	preload(imgs);
	preload(audios);

};
