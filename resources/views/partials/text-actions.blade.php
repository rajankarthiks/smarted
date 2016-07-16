<div ng-controller="BottomSheetExample" class="md-padding" ng-cloak>
    <div class="bottom-sheet-demo inset" layout="row" layout-sm="column" layout-align="center">
        <md-button flex="50" class="md-primary md-raised" ng-click="showGridBottomSheet()">Smart Writing Insights <i class="material-icons" role="presentation">highlight</i></md-button>
    </div>
    <div ng-if="alert">
        <br/>
        <b layout="row" layout-align="center center" class="md-padding">
      @{{alert}}
    </b>
    </div>
</div>