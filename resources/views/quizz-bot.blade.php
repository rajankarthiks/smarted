@extends('layouts.base') @section('content')

<div class="mdl-grid ">

    <link rel=stylesheet href="/mic/microphone.min.css">

    <div class="mdl-cell mdl-cell--12-col">
        @include('layouts.speech-info')
    </div>

    <div class="mdl-cell mdl-cell--12-col">
<!--         <div class="right">
            <button id="start_button" onclick="startButton(event)">
                <img id="start_img" src="mic.gif" alt="Start"></button>
        </div>
        <div id="results">
            <span id="final_span" class="final"></span>
            <span id="interim_span" class="interim"></span>
            <p>
        </div> -->
            <center><div id="microphone"></div></center>
    <pre id="result"></pre>
    <div id="info"></div>
    <div id="error"></div>
    <p>Current state is <span id="current-state">none</span></p>
    <input id="state-input" type="text" placeholder="Type a state name" />
    <button id="state-foo">Go to state</button>
    </div>




    <script src="/mic/microphone.min.js"></script>

    <script>

    localStorage.setItem('wit_token','AKKV53ELKNHA72ROAG7HFZEWZK2KBIOU');
     var mic;
     document.addEventListener('DOMContentLoaded', function (e) {
       mic = new Wit.Microphone(document.getElementById("microphone"));
       var info = function (msg) {
         document.getElementById("info").innerHTML = msg;
       };
       var error = function (msg) {
         document.getElementById("error").innerHTML = msg;
       };
       info("Microphone is not ready yet");
       mic.onready = function () {
         info("Microphone is ready to record");
       };
       mic.onaudiostart = function () {
         info("Recording started");
         error("");
       };
       mic.onaudioend = function () {
         info("Recording stopped, processing started");
       };
       mic.onresult = function (intent, entities) {
         var r = kv("intent", intent);

         for (var k in entities) {
           var e = entities[k];

           if (!(e instanceof Array)) {
             r += kv(k, e.value);
           } else {
             for (var i = 0; i < e.length; i++) {
               r += kv(k, e[i].value);
             }
           }
         }

         document.getElementById("result").innerHTML = r;
       };
       mic.onerror = function (err) {
         error("Error: " + err);
       };
       mic.onconnecting = function () {
         info("Microphone is connecting");
       };
       mic.ondisconnected = function () {
         info("Microphone is not connected");
       };

       token = localStorage.getItem('wit_token');
       if (!token) {
         throw new Error("Could not find token!");
       }
       mic.connect(token);
       // mic.start();
       // mic.stop();

       function kv (k, v) {
         if (toString.call(v) !== "[object String]") {
           v = JSON.stringify(v);
         }
         return k + "=" + v + "\n";
       }
     });

     function changeState(s) {
       document.getElementById('current-state').textContent = s;
       mic.setContext({state: s});
     }
     document.getElementById('state-foo').addEventListener('click', function (e) {
       e.preventDefault();
       changeState(document.getElementById('state-input').value);
     });
    </script>    

</div>

@endsection
