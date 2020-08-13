Controller.Init = function () {
    Service.ModelData.Listing = {};
};

Controller.CustomSuccessHandler = function(result){
    alert("Custom success handler was fired");
    Service.SuccessHandler(result);
};

Controller.CustomErrorHandler = function(e){
    alert("Custom error handler was fired");
    Service.ErrorHandler(e);
};

Controller.PreFormSubmitEvent = function(formData){
  alert("Pre form execution event handler was fired");
};

jQuery(function(){
    window.Controller.Init();
});

