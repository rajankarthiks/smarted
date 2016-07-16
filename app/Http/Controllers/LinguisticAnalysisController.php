<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Microsoft\LinguisticApi;

class LinguisticAnalysisController extends Controller
{

    public function listAnalyzers()
    {
        return LinguisticApi::listAnalyzers();
    }

    public function analyse(Request $request)
    {
        $input = $request->input('text');
        $text = isset($input) ? $input : 'This is a Test Text';

        return LinguisticApi::analyze($text);
    }

}
