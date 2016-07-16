@extends('layouts.base') @section('content')

<div class="mdl-grid ">

    <div class="mdl-cell mdl-cell--12-col">
        @include('layouts.speech-info')
    </div>

    <div class="mdl-cell mdl-cell--12-col">
        <div class="right">
            <button id="start_button" onclick="startButton(event)">
                <img id="start_img" src="mic.gif" alt="Start"></button>
        </div>
        <div id="results">
            <span id="final_span" class="final"></span>
            <span id="interim_span" class="interim"></span>
            <p>
        </div>
    </div>

    <div class="mdl-cell mdl-cell--12-col">
        @include('partials.text-actions')
    </div>

    <script src="/js/speech.js"></script>

</div>

@endsection
