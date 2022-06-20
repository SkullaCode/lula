/**
 * -- MainContainer --
 * Defines the main container for panel switching
 * @type {string}
 */
let MainContainer         = "MainContainer";

/**
 * -- ModalContainer --
 * Defines the container modals will be placed
 * in when launched
 * @type {string}
 */
let ModalContainer        = "modal-container";

/**
 * -- TemplateContainer --
 * Defines the container used to temporarily
 * store templates before they are placed on
 * the DOM
 * @type {string}
 */
let TemplateContainer     = "container-panel";

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
    let ModalLoading        = null;
    let ActionLoading       = null;
    let ContainerPanel      = null;
    let ModelData           = {};
    let MetaData            = {};
    let PanelLoading        = [];
    let Title               = "Javascript UI";

    let addProperty = function(name,f){
         Response[name] = f;
    };

    let addMethod = function(name,f){
        addProperty(name,f);
    };

    let Response = {
        LoadedModal,    //-------------------------------------- Currently loaded modal component on the DOM
        LoadedPanel,    //-------------------------------------- Currently loaded panel component on the DOM
        LoadedForm,     //-------------------------------------- Currently loaded form when Controller.FormSubmit is called
        PanelLoading,   //-------------------------------------- Determines if the panel is finished loading or not
        ModalLoading,   //-------------------------------------- Determines if the modal is finished loading or not
        ActionLoading,  //-------------------------------------- Determines if an action (PanelSelect,FormSubmit,etc...) is executing or not
        ModelData,      //-------------------------------------- Container for storing data to be used in binding to panels or modals
        MetaData,       //-------------------------------------- Container for holding miscellaneous data
        ContainerPanel, //-------------------------------------- Container for temporarily loading templates on the DOM (loading them directly does not register events)
        Title,          //-------------------------------------- Container for app title (displayed in the title bar)
        Modification                        : null,
        SubmitTransformation                : null,
        Transformation                      : null,
        DomEvents                           : null,
        Data                                : null,
        Action                              : null,
        ErrorHandler                        : null,
        SuccessHandler                      : null,
        NotificationHandler                 : null,
        ErrorMessageHandler                 : null,
        ErrorDataHandler                    : null,
        SuccessMessageHandler               : null,
        SuccessDataHandler                  : null,
        DefaultModalHandler                 : null,
        DefaultElementHandler               : null,
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
        LoadPanelTransition                 : null,
        SelectListBuilder                   : null,
        FindElement                         : null,
        Transform                           : null,
        ExecuteCustom                       : null,
        ExecuteSubmitTransformation         : null,
        ReloadPanel                         : null,
        ToasterNotification                 : null,
        AlertNotification                   : null,
        LoadingStateOn                      : null,
        LoadingStateOff                     : null,
        CanSubmitForm                       : null,
        Bootstrap                           : null,
        AddProperty                         : addProperty,
        AddMethod                           : addMethod,
        SYSTEM_ID                           : "id",                     //-------------------------------------- identifier for elements
        SYSTEM_PROPERTY                     : "property",               //-------------------------------------- identifier for elements
        SYSTEM_TARGET                       : "target",                 //--------------------------------------
        SYSTEM_COMPLETE                     : "complete",               //-------------------------------------- identifier for actions that should run after an action has completed successfully
        SYSTEM_HEADERS                      : "headers",                //--------------------------------------
        SYSTEM_ACTION                       : "action",                 //-------------------------------------- identifier for template that should be loaded
        SYSTEM_CUSTOM                       : "custom",                 //-------------------------------------- identifier for custom functions that should be executed on a component
        SYSTEM_URL                          : "href",                   //-------------------------------------- identifier for url to use with manual form submit and List update
        SYSTEM_METHOD                       : "method",                 //-------------------------------------- identifier for method (post,put,etc..) to use with manual form submit
        SYSTEM_PRE_FORM_EXECUTION           : "pre",                    //-------------------------------------- identifier for submit transformations that should be executed before form submission
        SYSTEM_HISTORY                      : "history",                //--------------------------------------
        SYSTEM_FILE_UPLOAD_CONTAINER        : ".file-upload",           //-------------------------------------- identifier for container holding file upload panel
        SYSTEM_CLEAR_ERROR                  : "clear-error",            //-------------------------------------- class that clears data in a form field if an error occurs
        SYSTEM_CLEAR_SUCCESS                : "clear-success",          //-------------------------------------- class that clears data in a form field if successfully submitted
        SYSTEM_LIST                         : "list",                   //-------------------------------------- identifier for building select lists on binding
        SYSTEM_BIND                         : "bind",                   //-------------------------------------- class that determines if the item should be considered while data binding
        SYSTEM_BIND_VALUE                   : "bind-value",             //-------------------------------------- class that determines if data should be bound to the value property
        SYSTEM_BIND_META                    : "bind-meta",              //--------------------------------------
        SYSTEM_BIND_ELEM                    : "bind-element",           //-------------------------------------- class that allows data binding on the element to be manipulated
        SYSTEM_BIND_GLOBAL                  : "bind-global",            //-------------------------------------- class that allows data binding on the element with data in the current context being provided
        SYSTEM_LOOP                         : "loop",                   //-------------------------------------- class that determines if binding should occur in a loop
        SYSTEM_BIND_LOOP                    : "bind-loop",              //-------------------------------------- class that determines if the item should be considered when binding in a loop
        SYSTEM_SUCCESS_HANDLER              : "success-handler",        //--------------------------------------
        SYSTEM_ERROR_HANDLER                : "error-handler",          //-------------------------------------- determines which handler (alert or toaster) should be used on error
        SYSTEM_LOAD_TYPE                    : "load-type",              //--------------------------------------
        SYSTEM_NOTIFICATION_ON_SUCCESS      : "notification-success",   //-------------------------------------- determines which notification type (alert or toaster) should be used on success
        SYSTEM_NOTIFICATION_ON_ERROR        : "notification-error",     //-------------------------------------- determines which notification type (alert or toaster) should be used on error
        SYSTEM_NOTIFICATION                 : "notification",           //-------------------------------------- determines if notification should be executed
        SYSTEM_TITLE                        : "title"                   //--------------------------------------
    };

    return Response;
}();

/**
 * -- Modification --
 * Add a method to the modification executor if you want it to be called before or after a panel
 * or modal has been loaded. use the 'data-complete' attribute on the element triggering the action
 * to add the method(s) that should be executed after loading is complete. use the 'data-custom'
 * attribute on the element triggering the action to add the method(s) that should be executed before
 * loading is complete. if there needs to be more than one method called, use the pipe (|) character
 * to separate them. 'data-complete' can also be used to indicate method(s) that should be executed
 * after a form has been successfully submitted.
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
 * Add a method to the submit-transformation executor if you want to transform the value of a form
 * element before it is submitted to the server for processing. use the 'data-custom' attribute on
 * the element triggering the submission to add the method(s) that should be executed. if there needs
 * to be more than one method called, use the pipe (|) character to separate them. If for some reason
 * the form should not be submitted set the globally available Service.CanSubmitForm to false.
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
 * use the 'data-custom' attribute on the element that should be transformed to add the method(s)
 * that should be executed. if there needs to be more than one method called, use the pipe (|) character
 * to separate them. note that during binding only elements with the class 'bind' or 'bind-loop'
 * will be considered. Also, TRANSFORMATION WORKS TWO WAYS!!..... if 'bind-global' or 'bind-element'
 * is present the transformation will take place on the element and not the binding property. In other
 * words, normal transformation mutates the data property to be bounded to the element; 'bind-global'
 * transforms the element itself and provides the entire dataset; 'bind-element' transforms the
 * element itself but only provides the binding data property.
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
 * please note that the data-action is the same item that determines the location of  
 * the form if the submit button is not contained within it.
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
