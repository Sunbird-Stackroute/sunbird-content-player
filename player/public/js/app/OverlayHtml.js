OverlayHtml = {
    _rootScope: null,
	showNext: function() {
		this._updateNavigate("next");
	},
	showPrevious: function() {
		this._updateNavigate("previous");
	},
    _updateNavigate: function(type) {
        var search = "navigate[type=\"'"+ type+ "'\"]";
        var navigates = jQuery(search);
        if ("undefined" != typeof navigates && "undefined" != typeof angular) {
            var elements = angular.element(navigates);
            elements.trigger("navigateUpdate", {show: true});
            
            var rootScope = this._getRootScope(); 
            if (rootScope) {
                rootScope.$apply();
            }
        }
    },
	_setRootScope: function(key, value) {
		var rootScope = this._getRootScope();
		if (rootScope) {
            rootScope[key] = value;
            rootScope.$apply();
        }
	},
	_getRootScope: function() {
        if(_.isNull(this._rootScope)){
            var overlayDOMElement = document.getElementById('overlayHTML');
            if ("undefined" != typeof angular && "undefined" != typeof overlayDOMElement) {
                var scope = angular.element(overlayDOMElement).scope();
                if (scope) this._rootScope = scope.$root;
            }
        }
        return this._rootScope;            
    },
    isReadyToEvaluate: function(enableEval){
        this._setRootScope("enableEval", enableEval);
    },
    resetStage: function(){
        jQuery('#assessButton').hide();
    },
    sceneEnter: function() {
        this.resetStage();
        var isItemStage = this.isItemScene();
        if (isItemStage) {
            jQuery('#assessButton').show();
            this._setRootScope("isItemScene", true);
            var currentScene = Renderer.theme._currentScene;
            currentScene.on("correct_answer", function(event) {
                console.info("listener for ", event);
                jQuery("#goodJobPopup").show();
            });
            currentScene.on("wrong_answer", function(event) {
                console.info("listener for ", event);
                jQuery("#tryAgainPopup").show();
            });
        }
    },
    isItemScene: function() {
        var stageCtrl = Renderer.theme._currentScene._stageController;
        if(!_.isUndefined(stageCtrl) && ("items" == stageCtrl._type)){
            var modelItem = stageCtrl._model[stageCtrl._index];
            // If FTB item, enable submit button directly
            if(!_.isNull(this._rootScope)){
                this._rootScope.enableEval = (modelItem && modelItem.type == 'ftb') ? true : false
            }
            return true;
        }else{
            return false;
        }
    	//return ("undefined" != typeof Renderer.theme._currentScene._stageController && "items" == Renderer.theme._currentScene._stageController._type)? true : false;
    }
};