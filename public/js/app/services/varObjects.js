const MainContainer         = "MainContainer";
const ModalContainer        = "modal-container";
const DefaultModalListing   = "static-listing-modal";
const DefaultPanelListing   = "static-listing-panel";
const DefaultFormListing    = "static-listing-form";
const DefaultListingName    = "model-list";

window.Controller = function(){
    let AddProperty = function(name,f){
        Response[name] = f;
    };

    let AddMethod = function(name,f){
        AddProperty(name,f);
    };

    let Response = {
        AddProperty,
        AddMethod,
        FormSubmit: null,
        FileSelect: null,
        ModalSelect: null,
        PanelSelect: null
    };

    return Response;
}();

window.Service = function(){
    let LoadedModal         = null;
    let LoadedPanel         = null;
    let LoadedForm          = null;
    let SubmitButton        = null;
    let ActionButton        = null;
    let ModelData           = [];
    let MetaData            = [];
    let ContainerPanel      = null;
    let APIUrl              = null;
    let LoadingComplete     = false;

    let addProperty = function(name,f){
         Response[name] = f;
    };

    let addMethod = function(name,f){
        addProperty(name,f);
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
        Custom                              : null,
        Modification                        : null,
        SubmitTransformation                : null,
        Transformation                      : null,
        DomEvents                           : null,
        Data                                : null,
        Action                              : null,
        ErrorHandler                        : null,
        SuccessHandler                      : null,
        NotificationHandler                 : null,
        ServerRequest                       : null,
        LaunchModal                         : null,
        Bind                                : null,
        BindForm                            : null,
        GetProperty                         : null,
        ListUpdate                          : null,
        TriggerEvents                       : null,
        ImagePreview                        : null,
        FormSubmitSuccessHandler            : null,
        FormSubmitDataHandler               : null,
        LoadPanel                           : null,
        LoadLayout                          : null,
        SelectListBuilder                   : null,
        FindElement                         : null,
        Transform                           : null,
        ExecuteCustom                       : null,
        ExecuteSubmitTransformation         : null,
        ReloadPanel                         : null,
        ToasterNotification                 : null,
        AlertNotification                   : null,
        AddProperty                         : addProperty,
        AddMethod                           : addMethod,
        SYSTEM_ID                           : "id",
        SYSTEM_PROPERTY                     : "property",
        SYSTEM_TARGET                       : "target",
        SYSTEM_COMPLETE                     : "complete",
        SYSTEM_ACTION                       : "action",
        SYSTEM_CUSTOM                       : "custom",
        SYSTEM_URL                          : "href",
        SYSTEM_METHOD                       : "method",
        SYSTEM_FILE_UPLOAD_CONTAINER        : ".file-upload",
        SYSTEM_CLEAR_ERROR                  : "clear-error",
        SYSTEM_CLEAR_SUCCESS                : "clear-success",
        SYSTEM_CLOSE_ON_COMPLETE            : "close-on-complete",
        SYSTEM_DEFAULT_PANEL_DATA           : "static-listing-panel",
        SYSTEM_LIST                         : "list",
        SYSTEM_BIND                         : "bind",
        SYSTEM_BIND_VALUE                   : "bind-value",
        SYSTEM_BIND_META                    : "bind-meta",
        SYSTEM_LOOP                         : "loop",
        SYSTEM_BIND_LOOP                    : "bind-loop",
        SYSTEM_SUCCESS_HANDLER              : "success-handler",
        SYSTEM_ERROR_HANDLER                : "error-handler",
        SYSTEM_LOAD_TYPE                    : "load-type"
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

    let addMethod = function(name,f){
        Response[name] = f;
    };

    let Response = {
        AddMethod: addMethod
    };

    return Response;
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
