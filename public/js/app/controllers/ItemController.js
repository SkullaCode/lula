Controller.Init = function () {
    window.Service.Modification.AddMethod("ColorRed",function(component){
        let header = jQuery(component).find("h1");
        header.css("color","red");
    });
};

jQuery(function(){
    window.Controller.Init();
});

