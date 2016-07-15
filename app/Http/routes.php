<?php

Route::get('/', function () {
    return view('app');
});

Route::get('/write-smart', function () {
    return view('write-smart');
});
