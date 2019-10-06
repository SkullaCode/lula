/**
 * -- MainContainer --
 * Defines the main container for panel switching
 * @type {string}
 */
const MainContainer         = "MainContainer";

/**
 * -- ModalContainer --
 * Defines the container modals will be placed
 * in when launched
 * @type {string}
 */
const ModalContainer        = "modal-container";

/**
 * -- DefaultModalListing --
 * Defines the default action to execute during
 * data binding when launching a modal if none
 * is specified.
 * @type {string}
 */
const DefaultModalListing   = "static-listing-modal";

/**
 * -- DefaultPanelListing --
 * Defines the default action to execute during
 * data binding when launching a panel if none
 * is specified.
 * @type {string}
 */
const DefaultPanelListing   = "static-listing-panel";

/**
 * -- DefaultFormListing --
 * Defines the default action to execute during
 * data binding when launching a form if none
 * is specified.
 * @type {string}
 */
const DefaultFormListing    = "static-listing-form";

/**
 * -- DefaultListingName --
 * Defines the name of the default storage container
 * for loaded model properties retrieved from the
 * server.
 * @type {string}
 */
const DefaultListingName    = "model-list";

/**
 * -- Controller --
 * Contains all the custom logic for the current page
 * this is just the definition, the programmer will
 * add functionality from a script tag. NB. each page
 * should define its own set of controller functions.
 * if there is some functionality that needs to be global
 * it is best to put it in the Service.
 */
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

/**
 * -- Service --
 * Contains global functionality as well as
 * system helper functionality for common
 * tasks. This is just the definition. The
 * programmer can expand on it by adding
 * functionality using a script tag
 */
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
        FormSubmitSuccessHandler            : null,
        ErrorDataHandler                    : null,
        ServerRequest                       : null,
        LaunchModal                         : null,
        Bind                                : null,
        BindForm                            : null,
        GetProperty                         : null,
        ListUpdate                          : null,
        TriggerEvents                       : null,
        ImagePreview                        : null,
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
        SYSTEM_HEADERS                      : "headers",
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
        SYSTEM_LOAD_TYPE                    : "load-type",
        SYSTEM_NOTIFICATION_ON_SUCCESS      : "notif-on-success",
        SYSTEM_NOTIFICATION_ON_ERROR        : "notif-on-error"
    };

    return Response;
}();

/**
 * -- Custom --
 * Add a method to the custom executor if it will be used by an inline 'onclick' or 'onchange'
 * action. also if custom javascript events are defined, the implementation logic can be placed
 * in a custom executor as well.
 */
window.Service.AddProperty('Custom',function(){

    let addMethod = function(name,f){
        Response[name] = f;
    };

    let Response = {
        AddMethod: addMethod
    };

    return Response;
}());

/**
 * -- Modification --
 * Add a method to the modification executor if you want it to be called after a panel or modal has
 * been loaded. use the 'data-custom' attribute on the element triggering the action to add the method(s)
 * that should be executed after loading is complete. if there needs to be more than one method called,
 * use the pipe (|) character to separate them.
 */
window.Service.AddProperty('Modification',function(){

    let addMethod = function(name,f){
        Response[name] = f;
    };

    let Response = {
        AddMethod: addMethod
    };

    return Response;
}());

/**
 * -- SubmitTransformation --
 * Add a method to the submit transformation executor if you want to transform the value of a form
 * element before it is submitted to the server for processing. use the 'data-action' attribute on
 * the element triggering the submission to add the method(s) that should be executed. if there needs
 * to be more than one method called, use the pipe (|) character to separate them.
 */
window.Service.AddProperty('SubmitTransformation',function(){

    let addMethod = function(name,f){
        Response[name] = f;
    };

    let Response = {
        AddMethod: addMethod
    };

    return Response;
}());

/**
 * -- Transformation --
 * Add a method to the transformation executor if you want it to be called during data binding.
 * use the 'data-action' attribute on the element that should be transformed to add the method(s)
 * that should be executed. if there needs to be more than one method called, use the pipe (|)
 * them. note that during binding only elements with the class 'bind' or 'bind-loop' will be considered
 */
window.Service.AddProperty('Transformation',function(){

    let addMethod = function(name,f){
        Response[name] = f;
    };

    let Response = {
        AddMethod: addMethod
    };

    return Response;
}());

/**
 * -- Data --
 * Add a method to the data executor that has the same signature as the data-action property on a
 * panel or modal template and it will be automatically called during the binding process.
 * These methods are where the data is defined that the panel or modal will use while binding
 * takes place.
 */
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

/**
 * -- Action --
 * Add a method to the action executor if a form needs a non-standard way of sending the
 * request to the server and handling the response. methods can be triggered by inline
 * onclick and onchange events or by the data-action attribute on a submit button.
 */
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
