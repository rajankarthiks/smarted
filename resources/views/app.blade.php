@extends('layouts.base') @section('content')

<div class="mdl-grid">
    <div class="dashboard display-animation" style="margin: 0 auto; width: 1130px;" ng-controller="AboutController">
        <a class="tile tile-lg tile-sqr tile-red ripple-effect" href="#" ng-click="showAbout();">
            <span class="content-wrapper">
                <span class="tile-content">
                    <span class="tile-holder tile-holder-sm">
                        <span class="title">About</span>
                    </span>
                </span>
            </span>
        </a>
        <a class="tile tile-lg tile-indigo ripple-effect" href="#" ng-click="showWriteSmart();">
            <span class="content-wrapper">
                <span class="tile-content">
                    <span class="tile-holder tile-holder-sm">
                        <span class="title">Write Smart</span>
                    </span>
                </span>
            </span>
        </a>
        <a class="tile tile-lg tile-sqr tile-green ripple-effect" href="#" ng-click="showQuizzBot();">
            <span class="content-wrapper">
                <span class="tile-content">
                    <span class="tile-img"></span>
                    <span class="tile-holder tile-holder-sm">
                        <span class="title">Quiz Bot </span>
                    </span>
                </span>
            </span>
        </a>
    </div>
</div>

@endsection
