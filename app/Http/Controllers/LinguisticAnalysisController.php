<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Microsoft\LinguisticApi;

class LinguisticAnalysisController extends Controller
{

    public function analyse()
    {
        $text = 'Hi This is Karthik Rajan';

        return LinguisticApi::analyze($text);
    }

}
