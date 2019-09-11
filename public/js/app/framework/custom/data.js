/**
 * -- Data --
 * Add a method to the data executor that has the same signature as a panel or modal and it will
 * be automatically called during the binding process. These methods are where the data is defined
 * that the panel or modal will use while binding takes place.
 */

window.Service.Data.AddMethod('Bootstrap', function(){
    window.Service.ModelData.List = {};
    window.Service.LoadingComplete = false;

    if(sessionStorage.getItem('GenderList') !== null){
        //window.Service.ModelData.List['Gender'] = JSON.parse(sessionStorage.getItem('GenderList'));
    }
    else{
        /*window.Service.ServerRequest('/list/gender',null,'GET',function(data){
            window.Service.ModelData.List['Gender'] = data.data;
            sessionStorage.setItem('GenderList',JSON.stringify(data.data));
        },window.Service.ErrorHandler);*/
    }
    window.Service.LoadingComplete = true;
});

window.Service.Data.AddMethod('static-listing-panel',function(component){
    if(typeof component.data("id") !== "undefined"){
        window.Service.Bind(component,window.Service.ModelData["listing-panel"][component.data("id")]);
    }
});

window.Service.Data.AddMethod('static-listing-modal',function(component){
    if(typeof component.data("id") !== "undefined"){
        window.Service.Bind(component,window.Service.ModelData["listing-modal"][component.data("id")]);
    }
});

window.Service.Data.AddMethod('static-listing-form', function(component){
    if(typeof component.data("id") !== "undefined"){
        window.Service.BindForm(component,window.Service.ModelData["listing-form"][component.data("id")]);
    }
});


