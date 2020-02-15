/**
 * -- Custom --
 * Add methods that will be used by inline 'onclick' or 'onchange'
 * actions. If default implementations need to be overwritten, do that here
 * as well. A jQuery 'ready' function is defined where global bootstrapping
 * of the page can be placed.
 */

//defining a default alert notification handler
Service.AlertNotification = function(result){
    swal(result.message,result.data.Code,result.status);
};
Service.Bootstrap = function(){
    Service.ModelData.List = {};

    if(sessionStorage.getItem('GenderList') !== null){
        Service.ModelData.List['Gender'] = JSON.parse(sessionStorage.getItem('GenderList'));
    }
    else{
        const data = [
            { Value: 1, Text: "Male"},
            { Value: 2, Text: "Female"}
        ];
        Service.ModelData.List['Gender'] = data;
        sessionStorage.setItem('GenderList',JSON.stringify(data));
    }
    setTimeout(function(){
        Controller.PanelSelect(document.getElementById(`${MainContainer}`));
    },1000);
};

jQuery(function(){
    Service.Bootstrap();
});
