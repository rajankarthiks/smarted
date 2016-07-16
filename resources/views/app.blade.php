@extends('layouts.base') @section('content')

<div class="mdl-grid">
    <div class="dashboard display-animation" style="margin: 0 auto; width: 1130px;">
        <a class="tile tile-lg tile-indigo ripple-effect" href="/write-smart">
            <span class="content-wrapper">
      <span class="tile-content">
        <span class="tile-holder tile-holder-sm">
          <span class="title">Write Smart</span>
            </span>
            </span>
            </span>
        </a>
        <a class="tile tile-lg tile-sqr tile-green ripple-effect" href="#">
            <span class="content-wrapper">
      <span class="tile-content">
        <span class="tile-img" style="background-image: url(http://www.google.com/design/images/materialreel.png);"></span>
            <span class="tile-holder tile-holder-sm">
          <span class="title">Quiz Bot </span>
            </span>
            </span>
            </span>
        </a>
        <a class="tile tile-lg tile-sqr tile-red ripple-effect" href="#">
            <span class="content-wrapper">
      <span class="tile-content">
        <span class="tile-img" style="background-image: url(http://www.google.com/design/images/principles.png);"></span>
            <span class="tile-holder tile-holder-sm">
          <span class="title">Automated Essay Review</span>
            </span>
            </span>
            </span>
        </a>
    </div>
</div>

@endsection
