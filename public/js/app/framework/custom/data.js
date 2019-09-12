/**
 * -- Data --
 * Add a method to the data executor that has the same signature as a panel or modal and it will
 * be automatically called during the binding process. These methods are where the data is defined
 * that the panel or modal will use while binding takes place.
 */

Service.Data.Bootstrap = function(){
    Service.ModelData.List = {};
    Service.LoadingComplete = false;

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
    Service.LoadingComplete = true;
};

Service.Data.AddMethod('static-listing-panel',function(component){
    if(typeof component.data("id") !== "undefined"){
        Service.Bind(component,Service.ModelData["listing-panel"][component.data("id")]);
    }
});

Service.Data.AddMethod('static-listing-modal',function(component){
    if(typeof component.data("id") !== "undefined"){
        Service.Bind(component,Service.ModelData["listing-modal"][component.data("id")]);
    }
});

Service.Data.AddMethod('static-listing-form', function(component){
    if(typeof component.data("id") !== "undefined"){
        Service.BindForm(component,Service.ModelData["listing-form"][component.data("id")]);
    }
});


