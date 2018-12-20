<?php

Route::get('/', function () {
    return view('app');
});

Route::get('/write-smart', function () {
    return view('write-smart');
});

Route::get('/quizz-bot', function () {
    return view('quizz-bot');
});

Route::post('/linguistic-analysis','LinguisticAnalysisController@analyse');
Route::get('/linguistic-analysis','LinguisticAnalysisController@analyse');

Route::get('/linguistic-analyzers','LinguisticAnalysisController@listAnalyzers');
