var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
final_span.contentEditable = 'true';
showInfo('info_start');
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    start_button.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = function() {
        recognizing = true;
        showInfo('info_speak_now');
        start_img.src = 'mic-animate.gif';
    };

    recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
            start_img.src = 'mic.gif';
            showInfo('info_no_speech');
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            start_img.src = 'mic.gif';
            showInfo('info_no_microphone');
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                showInfo('info_blocked');
            } else {
                showInfo('info_denied');
            }
            ignore_onend = true;
        }
    };

    recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        start_img.src = 'mic.gif';
        if (!final_transcript) {
            showInfo('info_start');
            return;
        }
        showInfo('info_start');
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById('final_span'));
            window.getSelection().addRange(range);
        }
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_transcript = capitalize(final_transcript);
        final_span.innerHTML = linebreak(final_span.innerHTML + ' ' + final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
    };
}

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;

function capitalize(s) {
    return s.replace(first_char, function(m) {
        return m.toUpperCase();
    });
}

function upgrade() {
    start_button.style.visibility = 'hidden';
    showInfo('info_upgrade');
}

function keyPressed(event) {
    if (event.ctrlKey && event.keyCode == 13) {
        startButton(event);
    }
}

function startButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = 'en-IN';
    recognition.start();
    ignore_onend = false;
    start_img.src = 'mic-slash.gif';
    showInfo('info_allow');
}


function showInfo(s) {
    if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id == s ? 'block' : 'none';
            }
        }
        info.style.visibility = 'visible';
    } else {
        info.style.visibility = 'hidden';
    }
}
