window.Controller = {};
window.Controller.Default = {};

window.Service = function(){
    let LoadedModal = null;
    let LoadedPanel = null;
    let LoadedForm = null;
    let SubmitButton = null;
    let ActionButton = null;
    let ModelData = [];
    let MetaData = [];
    let ContainerPanel = null;
    let APIUrl = null;
    let LoadingComplete = false;

    let addProperty = function(name,f){
         Response[name] = f;
    };

    let Response = {
        LoadedModal,
        LoadedPanel,
        LoadedForm,
        SubmitButton,
        ActionButton,
        ModelData,
        MetaData,
        ContainerPanel,
        APIUrl,
        LoadingComplete,
        ErrorHandler: null,
        NotificationHandler: null,
        ServerRequest: null,
        LaunchModal: null,
        Bind: null,
        BindForm: null,
        GetProperty: null,
        ListUpdate: null,
        TriggerEvents: null,
        ImagePreview: null,
        FormSubmitSuccessHandler: null,
        FormSubmitDataHandler: null,
        LoadPanel: null,
        LoadLayout: null,
        SelectListBuilder: null,
        FindElement: null,
        Transform: null,
        ExecuteCustom: null,
        ExecuteSubmitTransformation: null,
        AddProperty: addProperty
    };

    return Response;
}();

window.Service.AddProperty('Custom',function(){

    let addMethod = function(name,f){
        Response[name] = f;
    };

    let Response = {
        AddMethod: addMethod
    };

    return Response;
}());

window.Service.AddProperty('Modification',function(){

    let addMethod = function(name,f){
        Response[name] = f;
    };

    let Response = {
        AddMethod: addMethod
    };

    return Response;
}());

window.Service.AddProperty('SubmitTransformation',function(){

    let addMethod = function(name,f){
        Response[name] = f;
    };

    let Response = {
        AddMethod: addMethod
    };

    return Response;
}());

window.Service.AddProperty('Transformation',function(){

    let addMethod = function(name,f){
        Response[name] = f;
    };

    let Response = {
        AddMethod: addMethod
    };

    return Response;
}());

window.Service.AddProperty('DomEvents',function(){

    let events = [];
    let addMethod = function(f){
        events.push(f);
    };

    return {
        AddMethod: addMethod,
        Events: events
    };
}());

window.Service.AddProperty('Data',function(){

    let store = {};

    let addMethod = function(name,f){
        Response[name] = f;
    };

    let Response = {
        AddMethod: addMethod,
        Store: store
    };

    return Response;
}());

window.Service.AddProperty('Action',function(){

    let store = {};

    let addMethod = function(name,f){
        Response[name] = f;
    };

    let Response = {
        AddMethod: addMethod,
        Store: store
    };

    return Response;
}());