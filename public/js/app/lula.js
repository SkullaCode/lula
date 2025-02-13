class Result{
    Code = null;
    Status = null;
    Message = null;
    Data = null;
    ActionBtn = null;
    Component = null;
    NotificationType = null;
}

class Requirement{
    Site = "";
    Method = null;
    /** @deprecated*/ //always use METHOD!!!
    Request = "POST";
    Notification = "true";
    Headers = [];
    SuccessHandler = null;
    ErrorHandler = null;
    Component = null;
    ActionBtn = null;
    ResponseType = null;
    Params = new FormData();
    Complete = null;
}
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

const HARD_RELOAD_HEADER = "x-reload-app";
const HARD_REDIRECT_HEADER = "x-redirect-app";
const TOASTER_NOTIFICATION_TYPE = "toaster";
const ALERT_NOTIFICATION_TYPE = "alert";
const NONE_NOTIFICATION_TYPE = "none";

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
    let LoadedForm          = null;
    let ModalLoading        = null;
    let ActionLoading       = null;
    let ContainerPanel      = null;
    let ModelData           = {
        Lists: {},
        Listing: [],
        SelectedEntity: {},
    };
    let MetaData            = {};
    let PanelLoading        = [];
    let LoadedPanel         = {};
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
        AuthorizationHandler                : null,
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
        BindList                            : null,
        GetProperty                         : null,
        ListUpdate                          : null,
        TriggerEvents                       : null,
        ImagePreview                        : null,
        LoadPanel                           : null,
        LoadModal                           : null,
        LoadData                            : null,
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
        FindElementSync                     : null,
        FormData                            : null,
        Link                                : null,
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
        SYSTEM_HISTORY                      : "history",                //--------------------------------------
        SYSTEM_FILE_UPLOAD_CONTAINER        : ".file-upload",           //-------------------------------------- identifier for container holding file upload panel
        SYSTEM_CLEAR_ERROR                  : "clear-error",            //-------------------------------------- class that clears data in a form field if an error occurs
        SYSTEM_CLEAR_SUCCESS                : "clear-success",          //-------------------------------------- class that clears data in a form field if successfully submitted
        SYSTEM_LIST                         : "list",                   //-------------------------------------- identifier for building select lists on binding
        SYSTEM_BIND                         : "bind",                   //-------------------------------------- class that determines if the item should be considered while data binding
        SYSTEM_BIND_VALUE                   : "bind-value",             //-------------------------------------- class that determines if data should be bound to the value property
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
        SYSTEM_TITLE                        : "title",                  //--------------------------------------
        SYSTEM_DEFAULT                      : "default",                //-------------------------------------- determines what should be in the first option of a select list
        SYSTEM_HIDE                         : "hide"                    //-------------------------------------- determines action to run when a modal is hidden
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
// noinspection JSUnresolvedFunction,JSUnresolvedVariable

/**
 *  -- Authorization Handler --
 * This function is responsible for handling all requests
 * which return 401 and 403 status codes
 * @param {Result} result
 */
Service.AddProperty("AuthorizationHandler", function(result){
    result.NotificationType = ALERT_NOTIFICATION_TYPE;
    Service.NotificationHandler(result);
});



/**
 * -- Error Handler --
 * This function is responsible for handling all requests
 * which return 400 or 500 level status codes
 * @param {Result} result
 */
Service.AddProperty("ErrorHandler", function (result) {
    //manipulate form if present
    if (Service.LoadedForm !== null) {
        Service.LoadedForm.find('input,select,textarea,button')
            .each(function () {
                //find elements that have the class 'clear-error' which
                //indicates they should be cleared and clear them.
                let elem = jQuery(this);
                if (elem.hasClass(Service.SYSTEM_CLEAR_ERROR)) {
                    if (elem.prop("type") === "select-one") {
                        elem.prop("selectedIndex", 0);
                    }
                    else if (elem.is("input")) {
                        elem.val("");
                    }
                    else if (elem.is("textarea")) {
                        elem.val("");
                    }
                }
            });
    }
});

/**
 * -- Success Handler --
 * This function handles successful responses
 * from calls to the server by default.
 *
 * @param {Result} result Result containing success handler parameters
 */
Service.AddProperty("SuccessHandler", function (result) {
    //manipulate form if present
    if (Service.LoadedForm !== null) {
        Service.LoadedForm.find('input,select,textarea,button')
            .each(function () {
                //find elements that have the class 'clear-success' which
                //indicates they should be cleared and clear them.
                let elem = jQuery(this);
                if (elem.hasClass(Service.SYSTEM_CLEAR_SUCCESS)) {
                    if (elem.prop("type") === "select-one") {
                        elem.prop("selectedIndex", 0);
                    }
                    else if (elem.is("input")) {
                        elem.val("");
                    }
                    else if (elem.is("textarea")) {
                        elem.val("");
                    }
                }
            });
    }
});

/**
 * -- Notification Handler --
 * This function handles the default implementation for notifications
 *
 * @param {Result} result
 */
Service.AddProperty("NotificationHandler", function (result) {
    switch (result.NotificationType) {
        case ALERT_NOTIFICATION_TYPE: {
            if (typeof Service.AlertNotification === "function") {
                Service.AlertNotification(result);
            }
            else {
                alert(result.Message)
            }
            break;
        }
        case TOASTER_NOTIFICATION_TYPE: {
            if (typeof Service.ToasterNotification === "function") {
                Service.ToasterNotification(result);
            }
            else {
                alert(result.Message);
            }
            break;
        }
        case NONE_NOTIFICATION_TYPE: {
            break;
        }
        default: {
            if (result.Status === "success") {
                if (typeof Service.ToasterNotification === "function") {
                    Service.ToasterNotification(result);
                }
                else {
                    alert(result.Message);
                }
            }
            else {
                if (typeof Service.AlertNotification === "function") {
                    Service.AlertNotification(result);
                }
                else {
                    alert(result.Message)
                }
            }
        }
    }
});

/**
 * -- Default Element Handler --
 * This function handles the default implementation for elements not
 * found or having rendering issues
 *
 * @param actionBtn object triggering action
 */
Service.AddProperty("DefaultElementHandler", function (actionBtn) {
    const elem = jQuery("<div></div>", { class: "alert alert-danger" });
    const type = (typeof actionBtn.data(Service.SYSTEM_LOAD_TYPE) !== "undefined")
        ?  actionBtn.data(Service.SYSTEM_LOAD_TYPE)
        : "panel";
    elem.append(`<p>The ${type} you are trying to load experienced an error while rendering....</p>`);
    return elem;
});

/**
 * -- Default Modal Handler --
 * This function handles the default implementation of handling
 * modal elements that are not formatted properly
 *
 * @param modal modal element as was retrieved
 * @param actionBtn object triggering action
 */
Service.AddProperty("DefaultModalHandler", function (modal, actionBtn) {
    if (!modal.hasClass("modal")) {
        const modalContent = modal.find(".modal");
        if (modalContent.length === 1) {
            return modalContent;
        } else {
            let act = modal.data(Service.SYSTEM_ACTION);
            if (typeof act !== "string")
                act = "";
            const modalData = modal.html();
            return jQuery(
                `<div class="modal fade" role="dialog" data-action="${act}">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title"></h4>
                            </div>
                            <div class="modal-body">
                                ${modalData}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>`
            );
        }
    }
});

/**
 * -- Error Message Handler --
 * This function handles default transformation of error
 * data from server into a error message
 *
 * @param request object that represents data returned from server
 */
Service.AddProperty("ErrorMessageHandler", function(request,error,actionBtn){
    let message = request.getResponseHeader("x-error-message");
    if(typeof message !== "undefined" && message !== null && message.length > 0)
        return message;
    if(typeof error !== "undefined") {
        message = error;
        if(typeof message !== "undefined" && message !== null && message.length > 0)
            return message;
    }
    if(typeof request.responseJSON !== "undefined" && typeof request.responseJSON.message !== "undefined"){
        message = request.responseJSON.message;
        if(typeof message !== "undefined" && message !== null && message.length > 0)
            return message;
    }
    if (typeof request.responseText !== "undefined" && request.responseText.length > 0){
        try {
            message = JSON.parse(request.responseText).message;
        }
        catch (e) {
            message = null;
        }
        if(typeof message !== "undefined" && message !== null && message.length > 0)
            return message;
    }
    message = request.statusText;
    if(typeof message !== "undefined" && message !== null && message.length > 0)
        return message;
    return "Internal Server Error!";
});

/**
 * -- Error Data Handler --
 * This function handles default transformation of error
 * data from server
 *
 * @param request object that represents data returned from server
 */
Service.AddProperty("ErrorDataHandler", function (request,error,actionBtn) {
    let data = {};
    if(typeof request.responseJSON !== "undefined"){
        data = request.responseJSON;
    }
    else if (typeof request.responseText !== "undefined" && request.responseText.length > 0) {
        try {
            data = JSON.parse(request.responseText);
        }
        catch (e) {
        }
    }
    return data;
});

/**
 * -- Success Message Handler --
 * This function handles default transformation of success
 * data from server into a success message
 *
 * @param data data as returned from the server
 * @param request object that represents data returned from server
 */
Service.AddProperty("SuccessMessageHandler", function (request,data,actionBtn) {
    let message = request.getResponseHeader("x-success-message");
    if(typeof message !== "undefined" && message !== null && message.length > 0)
        return message;
    message = request.statusText;
    if(typeof message !== "undefined" && message !== null && message.length > 0)
        return message;
    if(typeof data.message !== "undefined") {
        message = data.message;
        if(typeof message !== "undefined" && message !== null && message.length > 0)
            return message;
    }
    return "Task completed!";
});

/**
 * -- Success Data Handler --
 * This function handles the default transformation of success
 * data from the server into a usable format
 *
 * @param data data as returned from the server
 * @param request object that represents data returned from server
 */
Service.AddProperty("SuccessDataHandler", function(request,data,actionBtn){
    return data;
});

/**
 * -- Server Request --
 * This function handles ajax requests
 *
 * @param {Requirement} requirements object containing request parameters
 */
Service.AddProperty("ServerRequest", function (requirements) {
    //ensure there is a request type
    //Request was the default but Method is a better name
    //Request kept for backward compatibility
    //Will be removed in the future
    if(typeof requirements.Method !== "undefined" && requirements.Method !== null){
        requirements.Request = requirements.Method;
    }

    //ensure there are request headers
    if (typeof requirements.Headers === "undefined" || requirements.Headers === null) {
        requirements.Headers = [];
    }

    //ensure there are handlers for success and error results
    if (typeof requirements.SuccessHandler === "undefined" || requirements.SuccessHandler === null) {
        requirements.SuccessHandler = Service.SuccessHandler;
    }

    if (typeof requirements.ErrorHandler === "undefined" || requirements.ErrorHandler === null) {
        requirements.ErrorHandler = Service.ErrorHandler;
    }

    if (typeof requirements.Component === "undefined" || requirements.Component === null) {
        requirements.Component = jQuery("<div></div>");
    }

    if (typeof requirements.ResponseType === "undefined" || requirements.ResponseType === null) {
        requirements.ResponseType = "json";
    }

    if (typeof requirements.ActionBtn === "undefined" || requirements.ActionBtn === null) {
        requirements.ActionBtn = jQuery("<button></button>", { type: "button" });
        if(typeof requirements.Notification === "undefined" || requirements.Notification.length === 0){
            //requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION,"true");
            requirements.Notification = "true"
        }
    }else{
        if((typeof requirements.Notification === "undefined" || requirements.Notification.length === 0) && typeof requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION) !== "undefined"){
            requirements.Notification = requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION)
        }else{
            requirements.Notification = "true";
        }
    }

    // fix: throws an exception if a POST request is sent
    //without a body
    if (requirements.Params === null) {
        requirements.Params = new FormData();
    }

    //disable form input and controls while request is
    //processed by the server
    Service.LoadingStateOn(requirements.ActionBtn);

    const successFunction = function (data, status, jqXHR) {
        //enable disabled form controls
        Service.LoadingStateOff(requirements.ActionBtn);
        //check if reload header is set and reload the page
        //if it is
        if (jqXHR.getResponseHeader(HARD_RELOAD_HEADER)) {
            location.reload();
            return;
        }
        //check if the redirect header is set and redirect
        //the page if it is
        if (jqXHR.getResponseHeader(HARD_REDIRECT_HEADER)) {
            location.href = jqXHR.getResponseHeader(HARD_REDIRECT_HEADER);
            return;
        }
        let res = new Result();
        res.Code = jqXHR.statusCode;
        res.Status = status;
        res.Data = Service.SuccessDataHandler(jqXHR,data,requirements.ActionBtn);
        res.Message = Service.SuccessMessageHandler(jqXHR,data,requirements.ActionBtn);
        res.ActionBtn = requirements.ActionBtn;
        res.Component = requirements.Component;

        //trigger notification event
        if (requirements.Notification === "true" || requirements.Notification === "success") {
            //determine default notification handling mechanism
            res.NotificationType = requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION_ON_SUCCESS) || TOASTER_NOTIFICATION_TYPE;
            Service.NotificationHandler(res);
        }

        //execute the success callback with results received.
        requirements.SuccessHandler(res);
        if(typeof requirements.Complete !== "undefined" && requirements.Complete !== null){
            Service.ExecuteCustom(requirements.Complete, requirements.Component, requirements.ActionBtn, res).then(() => {
                Service.ActionLoading = false;
            });
        }else if(typeof requirements.ActionBtn.data(Service.SYSTEM_COMPLETE) !== "undefined" && requirements.ActionBtn.data(Service.SYSTEM_COMPLETE) !== null){
            Service.ExecuteCustom(requirements.ActionBtn.data(Service.SYSTEM_COMPLETE), requirements.Component, requirements.ActionBtn, res).then(() => {
                Service.ActionLoading = false;
            });
        }else{
            Service.ActionLoading = false;
        }
    };
    const errorFunction = function (request, status, error) {
        //jQuery sometimes throws a parse error but the response is successful
        if (request.status === 200) {
            successFunction({}, "success", request);
            return;
        }

        const res = new Result();
        res.Code = request.status;
        res.Status = status;
        res.ActionBtn = requirements.ActionBtn;
        res.Component = requirements.Component;

        //redirect to log-in if access error


        //enable disabled elements
        Service.LoadingStateOff(requirements.ActionBtn);

        res.Data = Service.ErrorDataHandler(request,error,requirements.ActionBtn);
        res.Message = Service.ErrorMessageHandler(request,error,requirements.ActionBtn);
        if(request.status === 401 || request.status === 403){
            Service.AuthorizationHandler(res);
            Service.ActionLoading = false;
            return;
        }
        //execute error handler
        requirements.ErrorHandler(res);
        if(typeof requirements.Complete !== "undefined" && requirements.Complete !== null){
            Service.ExecuteCustom(requirements.Complete, requirements.Component, requirements.ActionBtn, res).then(() => {
                //add status codes and how they should be treated here
                if (requirements.Notification === "true" || requirements.Notification === "error") {
                    res.NotificationType = requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION_ON_ERROR) || ALERT_NOTIFICATION_TYPE;
                    Service.NotificationHandler(res);
                }
                Service.ActionLoading = false;
            });
        }else{
            if (requirements.Notification === "true" || requirements.Notification === "error") {
                res.NotificationType = requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION_ON_ERROR) || ALERT_NOTIFICATION_TYPE;
                Service.NotificationHandler(res);
            }
            Service.ActionLoading = false;
        }
    };

    const ajax_params = {
        url: requirements.Site,
        type: requirements.Request,
        success: successFunction,
        error: errorFunction,
        //execute specified actions before request is sent
        beforeSend: function (xhr) {
            //todo make this optional
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (requirements.Headers.length > 0) {
                jQuery.each(requirements.Headers, function () {
                    xhr.setRequestHeader(this.Name, this.Value);
                });
            }
        }
    };
    //list request types that require message body
    //and determine if the current request is in
    //the list.
    let requestTypes = ['POST', 'PUT', 'HEAD', 'DELETE'];
    if (requestTypes.indexOf(requirements.Request.toUpperCase()) >= 0) {
        ajax_params.data = requirements.Params;
    }
    ajax_params.dataType = requirements.ResponseType;
    ajax_params.processData = false;
    ajax_params.contentType = false;
    ajax_params.global = false;
    jQuery.ajax(ajax_params);
});

/**
 * -- LaunchModal --
 * This function handles default implementation for
 * launching a modal.
 *
 * @param modal element to be launched as modal
 * @param actionBtn current action button selected
 * @return boolean
 */
Service.AddProperty("LaunchModal", function (modal, actionBtn) {
    return new Promise(function(resolve){
        modal.on('hide.bs.modal', function (e) {
            Service.ExecuteCustom(actionBtn.data(Service.SYSTEM_HIDE),this,actionBtn,e);
        });
        modal.on('hidden.bs.modal', function () {
            Service.LoadedModal.remove();
            Service.LoadedModal = null;
            jQuery(`.${ModalContainer}`).empty();
        });
        modal.modal();
        resolve(true);
    });
});

/**
 * -- Bind --
 * This function is responsible for binding the data
 * provided to the elements of the desired
 * component. only components with the class 'bind'
 * or 'bind-loop' are handled by this function.
 * Binding is done using the id attribute or
 * data-property data attribute.
 *
 * @param component element that will have its elements bound
 * @param data data set from which values will be used in binding
 * @param actionBtn current action button selected
 * @return void
 */
Service.AddProperty("Bind", function (component, data, actionBtn = null) {
    let elems = [];
    if(component.hasClass(`${Service.SYSTEM_BIND}`)){
        elems.push(component);
    }else{
        elems = component.find(`.${Service.SYSTEM_BIND}`);
    }
    jQuery.each(elems, function () {
        let elem = jQuery(this);

        //determine if global transformation should take place
        if (elem.hasClass(Service.SYSTEM_BIND_GLOBAL)) {
            //if custom function absent nothing happens
            if (typeof elem.data(Service.SYSTEM_CUSTOM) !== "undefined") {
                const action = elem.data(Service.SYSTEM_CUSTOM).split("|");
                action.forEach(function (item) {
                    if (Service.Transformation.hasOwnProperty(item)) {
                        Service.Transformation[item](elem, data, actionBtn);
                    }
                    else if (Controller.hasOwnProperty(item)) {
                        Controller[item](elem, data, actionBtn);
                    }
                });
            }
            return;
        }
        // if the element is an image bind the value to image source
        else if (elem.prop("tagName") === "IMG") {
            if (typeof elem.data(Service.SYSTEM_PROPERTY) !== "undefined") {
                elem.prop("src", Service.GetProperty(elem.data(Service.SYSTEM_PROPERTY), data));
            }
            else if (typeof elem.prop("id") !== "undefined") {
                elem.prop("src", Service.GetProperty(elem.prop("id"), data));
            }
        }
        else {
            if (typeof elem.data(Service.SYSTEM_PROPERTY) !== "undefined") {
                Service.BindProperty(elem,elem.data(Service.SYSTEM_PROPERTY),data,actionBtn);
            }
            else if (typeof elem.data(Service.SYSTEM_LOOP) !== "undefined") {
                let property = Service.GetProperty(elem.data(Service.SYSTEM_LOOP), data);
                //if the element found does not have any associated data we exit!!
                if(typeof property === "undefined") return;
                //get the looped element
                let child = elem.children();
                elem.empty();
                if (typeof property === "object" && property !== null && property.length > 0) {
                    property.forEach(function (item) {
                        //make copy of the looped element....
                        //we do not use the original
                        let childClone = child.clone();
                        //find all the elements that should be bound
                        let childElems = childClone.find(`.${Service.SYSTEM_BIND_LOOP}`);
                        if(childClone.hasClass(`${Service.SYSTEM_BIND_LOOP}`)){
                            if (childClone.hasClass(Service.SYSTEM_BIND_GLOBAL)) {
                                Service.BindProperty(childClone, null, property, actionBtn);
                            }
                            else if (typeof childClone.data(Service.SYSTEM_PROPERTY) !== "undefined") {
                                Service.BindProperty(childClone, childClone.data(Service.SYSTEM_PROPERTY), item, actionBtn);
                            }else{
                                Service.BindProperty(childClone, childClone.prop("id"), item, actionBtn);
                            }
                        }
                        if(childElems.length > 0){
                            $.each(childElems, function () {
                                let childElem = jQuery(this);
                                if (childElem.hasClass(Service.SYSTEM_BIND_GLOBAL)) {
                                    Service.BindProperty(childElem, null, property, actionBtn);
                                }
                                else if (typeof childElem.data(Service.SYSTEM_PROPERTY) !== "undefined") {
                                    Service.BindProperty(childElem, childElem.data(Service.SYSTEM_PROPERTY), item, actionBtn);
                                }
                                else {
                                    Service.BindProperty(childElem, childElem.prop("id"), item, actionBtn);
                                }
                            });
                        }
                        // add the element with the bindings to the parent
                        elem.append(childClone);
                    });
                }

                if (typeof elem.data(Service.SYSTEM_CUSTOM) !== "undefined") {
                    elem = Service.Transform(elem.data(Service.SYSTEM_CUSTOM), elem, actionBtn);
                }
            }
            else {
                if(elem.prop("id").length > 0){
                    Service.BindProperty(elem, elem.prop("id"), data, actionBtn);
                }
            }
        }
    });
});

/**
 * -- Bind Form --
 * this function binds data to the supplied form.
 * data is bound to input,select, and textarea
 * elements.
 *
 * @param form the form element
 * @param ds data set from which values will be used in binding
 */
Service.AddProperty("BindForm", function (form, ds) {
    if (ds === null) return;
    if (typeof form === "undefined") return;
    //get input elements located on the form
    let els = jQuery(form).find('input,select,textarea');
    if (els.length <= 0) return;

    for (let x = 0; x < els.length; x++) {
        let el = null;
        let elem = jQuery(els[x]);
        //get data property to bind
        el = Service.GetProperty(elem.prop("id"), ds);
        if (
            el === null ||
            typeof el === "undefined" ||
            typeof el === "object"
        )
            el = Service.GetProperty(elem.prop("name"), ds);

        if (
            el === null ||
            typeof el === "undefined" ||
            typeof el === "object"
        )
            continue;

        switch (elem[0].type) {
            case 'checkbox':
                elem.prop('checked', (el == elem.val()));
                break;
            case 'radio':
                elem.prop('checked', (el == elem.val()));
                break;
            case 'date':
            {
                if (!el) {
                    elem.val("");
                } else {
                    let dob = new Date(el);
                    let day = ("0" + dob.getDate()).slice(-2);
                    let month = ("0" + (dob.getMonth() + 1)).slice(-2);
                    dob = dob.getFullYear() + "-" + (month) + "-" + (day);
                    elem.data("value", dob);
                    elem.val(dob);
                }
                break;
            }
            case 'select-one':
            {
                elem.data("value", el);
                let options = elem.find("option");
                elem.prop("selectedIndex", 0);
                options.each(function (i) {
                    if (this.value == el) {
                        elem.prop("selectedIndex", i);
                    }
                });
                break;
            }
            case 'select-multiple':
                break;
            default:
                elem.data("value", el);
                elem.val(el);
                break;
        }
    }
    for (let x = 0; (els && x < els.length); x++) {
        Service.TriggerEvents(jQuery(els[x]));
    }
});

/**
 * -- Bind List --
 * this function is responsible for binding the lists
 * provided to the select elements of the desired
 * component.
 *
 * @param component element that will have its elements bound
 * @param data data set from which values will be used in binding
 * @param actionBtn button that was used in chain execution
 */
Service.AddProperty("BindList", function (component, data = [],  actionBtn = null){
    if(
        typeof data !== "undefined" &&
        typeof data !== "string" &&
        data !== null &&
        typeof data === "object" &&
        data.length > 0
    ){
        Service.SelectListBuilder(component, data);
    }else{
        const selectElems = component.find("select");
        jQuery.each(selectElems,function(){
            let elem = jQuery(this);
            let list = elem.data(Service.SYSTEM_LIST);
            if (typeof list !== "undefined") {
                let listData = Service.GetProperty(list,Service.ModelData.Lists);
                if(typeof listData === "undefined" || listData === null || listData.length <= 0){
                    if(Controller.hasOwnProperty(list)){
                        listData = Controller[list](actionBtn);
                    }
                }
                if (typeof listData !== "undefined" && listData !== null && listData.length > 0) {
                    Service.SelectListBuilder(elem, listData);
                }else{
                    if(elem.data(Service.SYSTEM_DEFAULT)){
                        Service.SelectListBuilder(elem, []);
                    }
                }
            }else{
                Service.SelectListBuilder(elem, []);
            }
        });
    }
});

/**
 * -- Bind Property --
 * This function is responsible for binding data values
 * to the DOM element provided.
 *
 * @param elem the DOM element to which the data values will be bound
 * @param propertyName name of the data value identifier in the data collection provided
 * @param data data collection provided
 * @param actionBtn current action button selected
 * @return void
 */
Service.AddProperty("BindProperty" , function(elem, propertyName, data, actionBtn){
    //element for transformation only will not have property name
    if(typeof propertyName === "undefined" || propertyName === null || propertyName.length <= 0){
        if (
            typeof elem.data(Service.SYSTEM_CUSTOM) !== "undefined" &&
            (elem.hasClass(Service.SYSTEM_BIND_ELEM) || elem.hasClass(Service.SYSTEM_BIND_GLOBAL))
        ) {
            Service.Transform(elem.data(Service.SYSTEM_CUSTOM), elem, data, actionBtn);
        }
        return;
    }
    let property = Service.GetProperty(propertyName, data);
    //if the element found does not have any associated data we exit!!
    if(typeof property === "undefined") return;
    //determine if a transformation method is present on the element
    if (typeof elem.data(Service.SYSTEM_CUSTOM) !== "undefined") {
        if (!elem.hasClass(Service.SYSTEM_BIND_ELEM)) {
            property = Service.Transform(elem.data(Service.SYSTEM_CUSTOM), null, property, actionBtn);
        }
    }
    //transform element instead of data provided
    if (elem.hasClass(Service.SYSTEM_BIND_ELEM)) {
        Service.Transform(elem.data(Service.SYSTEM_CUSTOM), elem, property, actionBtn);
    }
    //bind property to element as valid HTML
    else if (elem.hasClass(Service.SYSTEM_BIND_VALUE)) {
        if (elem.is('input,select,textarea')) {
            elem.val(property);
        }
        elem.attr('data-value', property);
        //elem.data("value", property);
        if (elem.prop("tagName") === "SELECT") {
            let options = elem.find("option");
            elem.prop("selectedIndex", 0);
            options.each(function (i) {
                if (this.value == property) {
                    elem.prop("selectedIndex", i);
                }
            });
        }
    }
    else {
        elem.html(property);
    }
});

/**
 * -- Get Property --
 * this function is used to get a specific data property
 * form the data provided.
 *
 * @param id name of the property to retrieve
 * @param data data set from which the property will be retrieved
 */
Service.AddProperty("GetProperty", function (id, data) {
    if (id === null) return data;
    if (typeof id === 'undefined') return data;
    id = id.split(".");
    let property = data;
    if (typeof property === "undefined") return null;
    for (let i = 0; i < id.length; i++) {
        if (id[i].length <= 0)
            break;
        property = property[id[i]];
        if (property === null) {
            break;
        }
        if (typeof property === 'undefined')
            break;
        if (typeof property === 'object')
            continue;
        return property;
    }
    return property;
});

/**
 * -- List Update --
 * this function is used for creating a secondary dropdown
 * list from a primary one (e.g. Selecting a country and
 * retrieving associated states)
 *
 * @param elem the element selected
 * @param target the element to update with created select list
 */
/*Service.AddProperty("ListUpdate", function (elem, target) {
    elem = jQuery(elem);
    if (elem.val()) {
        elem.data(Service.SYSTEM_NOTIFICATION,false);
        const dataList = elem.data(Service.SYSTEM_ACTION);
        if(typeof dataList !== "undefined"){
            let data = Service.ModelData.List[dataList];
            if(typeof data !== "undefined"){
                data = data[elem.val()];
                if(typeof data !== "undefined"){
                    Service.SelectListBuilder(jQuery(target), data, elem)
                }
            }else{
                if(Service.Data.hasOwnProperty(dataList)){
                    Service.Data[dataList](elem, elem).then((data) => {
                        if(typeof data !== "undefined"){
                            Service.SelectListBuilder(jQuery(target), data, elem)
                        }
                    });
                }
            }
        }
        /!*if(typeof url !== "undefined"){
            const site = `${url}/${elem.val()}`;
            const method = "GET";
            const params = {};
            const complete = elem.data(Service.SYSTEM_COMPLETE) || null;
            const success = function (result) { Service.SelectListBuilder(jQuery(target), result.data, result.actionBtn); };
            let serverObject = {
                site, method, params, success
            };
            serverObject.actionBtn = elem;
            serverObject.complete = complete;
            Service.ServerRequest(serverObject);
        }*!/
    }
});*/

/**
 * -- Trigger Events --
 * this function triggers onclick and onchange events if
 * present on the element passed to it
 *
 * @param elem element on which to trigger events
 */
Service.AddProperty("TriggerEvents", function (elem) {
    let click = elem.prop("onclick");
    let change = elem.prop("onchange");
    let blur = elem.prop("onblur");
    if (click !== null) elem.click();
    if (change !== null) elem.change();
    if (blur !== null) elem.blur();
});

/**
 * -- Image Preview --
 * this function allows an image preview when a file
 * is selected
 *
 * @param input the file input element
 * @param target the img element to show the preview
 */
Service.AddProperty("ImagePreview", function (input, target) {
    if (input.length === 1 && input[0].files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
            //todo determine file type and handle preview accordingly
            target.prop("src", e.target.result);
        };

        reader.readAsDataURL(input[0].files[0]);
    }
});

/**
 * -- Load Panel --
 * This function is responsible for loading html templates
 * into the panel location specified. if no location
 * is specified the default is used.
 *
 * @param elem the panel selected to be loaded
 * @param actionBtn current action button selected
 * @param target location where it should be placed
 * @return Promise
 */
Service.AddProperty("LoadPanel", function (elem, actionBtn, target) {
    return new Promise((resolve) => {
        const tContainer = jQuery("<div></div>");
        // we have to place panel on the DOM before we load it.....
        // idk if its a javascript thing or jQuery thing
        Service.ContainerPanel = jQuery(`#${TemplateContainer}`);

        //if template container not found....just build one
        if (Service.ContainerPanel.length <= 0) {
            jQuery("<body>").append(tContainer);
            Service.ContainerPanel = tContainer;
        }
        Service.ContainerPanel.empty().append(elem);
        //elem_id is the DOM container that will hold the panel
        //if for some reason it does not exist the panel will not display
        let elem_id = (
            typeof target !== "undefined" &&
            target !== null &&
            target.length > 0
        ) ? jQuery(`#${target}`) : jQuery(`#${MainContainer}`);
        Service.LoadPanelTransition(elem_id, elem);
        //empty and remove temp container
        Service.ContainerPanel.empty();
        Service.ContainerPanel = null;
        tContainer.empty().remove();
        return resolve(elem);
    });
});

/**
 * -- Load Modal --
 * This function is responsible for sanitizing data
 * attributes associated with the element, placing
 *  the element in the modal container, and loading
 *  the element on the DOM as a modal.
 *
 *  @param elem the element selected to be modal
 *  @param actionBtn current action button selected
 *  @return Promise
 */
Service.AddProperty("LoadModal", function(elem, actionBtn){
    return new Promise((resolve) => {
        let modal = elem;
        //format modal... has to be structured a specific way
        //to work
        if (!modal.hasClass("modal")) {
            modal = Service.DefaultModalHandler(elem,actionBtn);
        }
        //place modal on the DOM
        const modalContainer = jQuery(`#${ModalContainer}`);
        modalContainer.empty().append(modal);
        //update modal attributes
        const dataAttributes = actionBtn.data();
        const filterList = [Service.SYSTEM_ACTION,Service.SYSTEM_COMPLETE];
        jQuery.each(dataAttributes,function(key,value){
            //filter out action and custom attribute
            // these are defined on the modal
            if(jQuery.inArray(key,filterList) === -1){
                modal.data(key,value);
            }
        });
        resolve(modal);
    });
});

/**
 * -- Load Data --
 * This function is responsible for loading data
 * into the element specified from the action attribute
 * or determined by element name convention.
 *
 * @param elem the element selected to load data into
 * @param actionBtn current action button selected
 * @return Promise
 */
Service.AddProperty("LoadData", function(elem, actionBtn) {
    return new Promise(function(resolve){
        let action = elem.data(Service.SYSTEM_ACTION);
        //check if a data function is defined by convention
        //todo run multiple checks for all possible ways action can be set
        if(!Service.Data.hasOwnProperty(action)){
            action = `${actionBtn.data(Service.SYSTEM_ACTION)}-data`;
        }
        if (Service.Data.hasOwnProperty(action)) {
            Service.Data[action](elem, actionBtn).then(function(success){
                resolve(success);
            });
        }else{
            resolve(true)
        }
    });
});

/**
 * -- Select List Builder --
 * this function is responsible for building the options
 * for a select element passed to it. data for each
 * option is retrieved from a list provided.
 *
 * @param elem select list element
 * @param list array of objects to construct options
 */
Service.AddProperty("SelectListBuilder", function (elem, list, actionBtn, emptyList = true) {
    if(typeof elem === "string"){
        if (elem.substring(0, 1) !== "#") elem = `#${elem}`;
        elem = jQuery(elem);
    }
    if (emptyList) elem.empty();
    const defaultOption = elem.data("default");
    if(defaultOption){
        elem.append(`<option data-value="" value=""> ${defaultOption} </option>`);
    }
    jQuery.each(list, function () {
        let val = '';
        let txt = '';
        if(typeof this.value !== "undefined") val = this.value;
        if(val.length === 0 && typeof this.Value !== "undefined") val = this.Value;
        if(val.length === 0 && typeof this.VALUE !== "undefined") val = this.VALUE;
        if(typeof this.text !== "undefined") txt = this.text;
        if(txt.length === 0 && typeof this.Text !== "undefined") txt = this.Text;
        if(txt.length === 0 && typeof this.TEXT !== "undefined") txt = this.TEXT;
        elem.append(`<option data-value="${val}" value="${val}"> ${txt} </option>`);
    });
});

/**
 * -- Find Element --
 * this function retrieves templates from the
 * template tag or from a server side call and
 * ensures they are recognized by the DOM
 *
 * @param name name of the element to retrieve
 * @param actionBtn object triggering action
 */
Service.AddProperty("FindElement", function (name, actionBtn = null) {
    return new Promise((resolve) => {
        let templateContent = jQuery('template').prop('content');
        templateContent = jQuery(templateContent);
        let item = "";
        if(typeof name !== "undefined" && name.length > 0){
            //add hashtag if not present. element lookup is always by id
            if (name.substring(0, 1) !== "#") name = `#${name}`;
            item = templateContent.find(name);
        }
        if (item.length > 0) {
            /**
             * todo cloning the first item in the list... need to ensure
             * that highest order divs are selected
             **/
            let clone = jQuery(item[0]).clone();
            const action = clone.data(Service.SYSTEM_ACTION);
            let element = jQuery(clone.html());
            //ensure we have one root element
            if (element.length !== 1) {
                element = jQuery("<div></div>").append(clone.html())
            }
            //add system actions as data properties
            //if no data action is provided default to element name
            if (typeof action !== "undefined")
                element.data(Service.SYSTEM_ACTION, action);
            else
                element.data(Service.SYSTEM_ACTION, name.substring(1));
            //bind Select Lists
            Service.BindList(element,[],actionBtn);
            resolve(element);
        } else {
            //todo determine if name is a url and use server request to fetch it
            const container = jQuery("<div></div>");
            container.append(Service.DefaultElementHandler(actionBtn));
            resolve(container);
        }
    });
});

/**
 * -- Find Element Sync --
 * this function retrieves templates from the
 * template tag or from a server side call and
 * ensures they are recognized by the DOM
 *
 * @param name name of the element to retrieve
 * @param actionBtn object triggering action
 */
Service.AddProperty("FindElementSync", function (name, actionBtn = null) {
    let templateContent = jQuery('template').prop('content');
    templateContent = jQuery(templateContent);
    let item = "";
    if(typeof name !== "undefined" && name.length > 0){
        //add hashtag if not present. element lookup is always by id
        if (name.substring(0, 1) !== "#") name = `#${name}`;
        item = templateContent.find(name);
    }
    if (item.length > 0) {
        /**
         * todo cloning the first item in the list... need to ensure
         * that highest order divs are selected
         **/
        let clone = jQuery(item[0]).clone();
        const action = clone.data(Service.SYSTEM_ACTION);
        let element = jQuery(clone.html());
        //ensure we have one root element
        if (element.length !== 1) {
            element = jQuery("<div></div>").append(clone.html())
        }
        //add system actions as data properties
        if (typeof action !== "undefined") element.data(Service.SYSTEM_ACTION, action);
        //bind Select Lists
        Service.BindList(element,[],actionBtn);
        return element;
    } else {
        //todo determine if name is a url and use server request to fetch it
        const container = jQuery("<div></div>");
        container.append(Service.DefaultElementHandler(actionBtn));
        return container;
    }
});

/**
 * -- Execute Custom --
 * this function automates the execution of modifications to
 * panels or modals that have been loaded
 *
 * @param action names of the custom actions to execute
 * @param component panel or modal on which to apply custom actions
 */
Service.AddProperty("ExecuteCustom", function (action, component, actionBtn, result = null) {
    return new Promise(function(resolve){
        if(typeof action !== "undefined" && action !== null && action.length > 0){
            action = action.split("|");
            action.forEach(function (item) {
                if (Service.Modification.hasOwnProperty(item)) {
                    Service.Modification[item](component, actionBtn, result);
                }
                else if (Controller.hasOwnProperty(item)) {
                    Controller[item](component, actionBtn, result);
                }
            });
            return resolve(true);
        }
        resolve(false);
    });
});

/**
 * -- Transform --
 * this function automates the execution of modifications to
 * elements during binding.
 *
 * @param action names of the custom actions to execute
 * @param component element on which to apply custom actions
 */
Service.AddProperty("Transform", function (action, elem, property, actionBtn) {
    if(typeof action === "string" && action.length > 0){
        action = action.split("|");
        action.forEach(function (item) {
            if (elem === null) {
                if (Service.Transformation.hasOwnProperty(item)) {
                    property = Service.Transformation[item](property, null, actionBtn);
                } else if (Controller.hasOwnProperty(item)) {
                    property = Controller[item](property, null, actionBtn);
                }
            } else {
                if (Service.Transformation.hasOwnProperty(item)) {
                    Service.Transformation[item](elem, property, actionBtn);
                } else if (Controller.hasOwnProperty(item)) {
                    Controller[item](elem, property, actionBtn);
                }
            }
        });
    }
    return property;
});

/**
 * -- Execute Submit Transformation --
 * this function automates the execution of modification to
 * form elements before they are sent to the server
 *
 * @param action names of the custom actions to execute
 * @param component element on which to apply custom actions
 * @param params current form fields in the request
 */
Service.AddProperty("ExecuteSubmitTransformation", function (action, component, params, actionBtn) {
    action = action.split("|");
    action.forEach(function (item) {
        if (Service.SubmitTransformation.hasOwnProperty(item)) {
            params = Service.SubmitTransformation[item](component, params, actionBtn);
        }
        else if (Controller.hasOwnProperty(item)) {
            component = Controller[item](component, params, actionBtn);
        }
    });
    return params;
});

/**
 * -- Loading State On --
 * this function defines what happens when a request
 * is being sent to the server. It should be primarily
 * used to disable controls so that multiple requests
 * cannot be sent at the same time
 */
Service.AddProperty("LoadingStateOn", function (ActionButton) {
    //disable form fields so that they cannot be edited
    //while submission is taking place
    if (Service.LoadedForm !== null) {
        Service.LoadedForm.find('input,select,textarea').prop("disabled", true);
    }
    //disable the button that triggered the action so that request cannot
    //be duplicated.
    ActionButton.prop("disabled", true);
});

/**
 * -- Loading State Off --
 * this function defines what should happen when
 * a request is executed by the server and a response
 * received
 */
Service.AddProperty("LoadingStateOff", function (ActionButton) {
    //enable disabled elements
    if (Service.LoadedForm !== null) {
        Service.LoadedForm.find('input,select,textarea').prop("disabled", false);
    }
    ActionButton.prop("disabled", false);
});

/**
 * -- Load Panel Transition --
 * this function defines the process of placing the panel
 * within the specified container
 */
Service.AddProperty("LoadPanelTransition", function (container, panel, actionBtn = null) {
    container.css("display", "none");
    container.empty();
    container.html(panel).fadeIn("slow");
});

/**
 * -- FormData --
 * This function converts a regular JavaScript
 * object to a FormData one.
 *
 * @param data javascript object with parameters
 * @return FormData
 */
Service.AddProperty("FormData",function(data){
    const params = new FormData();
    if(jQuery.isArray(data)){
        jQuery.each(data,function(){
            params.append(this.name,this.value);
        });
    }else{
        jQuery.each(data,function(e){
            if (data.hasOwnProperty(e)) {
                params.append(e,data[e]);
            }
        });
    }
    return params;
});

/**
 * -- Link --
 * This function creates an element that can
 * be used to trigger Controller functions
 * (PanelSelect, ModelSelect, etc...).
 *
 * @param action template item to target
 * @param target container to place element
 * @param complete actions to run when loading complete
 * @param notification determines how notification is shown
 * @return Element
 */
Service.AddProperty("Link", function(action, target = null, complete = "", notification = "error", params = {}){
    const link = jQuery("<a></a>");
    if(typeof action === "object" && action !== null && action.length > 0) {
        jQuery.each(action,function(e){
            if (action.hasOwnProperty(e)) {
                link.attr(`data-${e}`,action[e]);
            }
        });
        return link[0];
    }

    link.attr("data-action",action);
    if(target !== null){
        link.attr("data-target",target);
    }
    link.attr("data-complete",complete);
    link.attr("data-notification",notification);
    if(typeof params === "object" && params !== null && params.length > 0) {
        jQuery.each(params,function(e){
            if (params.hasOwnProperty(e)) {
                link.attr(`data-${e}`,params[e]);
            }
        });
    }
    return link[0];
});
/**
 * -- Form Submit --
 * Handles form submission triggered by the element placed on.
 * It will only execute if there is no other submission
 * in progress. Behavior is to locate the form for submission,
 * serialize form fields (including files), execute submit transformation
 * function on form fields if present, and send the result to
 * Service.ServerRequest to be processed.
 */
Controller.AddProperty("FormSubmit",function(elem){
    //exit if another submission is in progress
    if(Service.ActionLoading) return false;
    const ActionButton = jQuery(elem);
    Service.ActionLoading = true;
    Service.CanSubmitForm = true;
    let target = ActionButton.data(Service.SYSTEM_TARGET);
    //fallback to action if target not defined
    if(typeof target === "undefined"){
        target = ActionButton.data(Service.SYSTEM_ACTION);
    }
    let custom = ActionButton.data(Service.SYSTEM_CUSTOM);
    let complete = ActionButton.data(Service.SYSTEM_COMPLETE);
    let requestHeaders = ActionButton.data(Service.SYSTEM_HEADERS);
    let form = [];
    let site_url = ActionButton.data(Service.SYSTEM_URL);
    let method = "post";
    let params = new FormData();
    let headers = [];
    let data = [];

    //load the form from target specified. if not
    //load the parent form element
    if(typeof target === "undefined"){
        Service.LoadedForm = jQuery(ActionButton.parents('form'));
        if(typeof Service.LoadedForm.attr("action") !== "undefined"){
            site_url = Service.LoadedForm.attr("action");
        }
        if(typeof Service.LoadedForm.attr("method") !== "undefined"){
            method = Service.LoadedForm.attr("method");
        }
        //retrieve form fields and submission data from loaded form
        //exclude file input from search...handled separately below
        data = Service.LoadedForm.serializeArray();
    }
    else{
        if (target.substring(0, 1) !== "#") target = `#${target}`;
        const targetContainer = jQuery(document).find(target);
        form = (targetContainer.is("form")) ? targetContainer : targetContainer.find("form");
        if (form.length > 0) {
            Service.LoadedForm = form;
            site_url = form.prop("action");
            method = form.prop("method");
            if(typeof form.data(Service.SYSTEM_URL) !== "undefined"){
                site_url = form.data(Service.SYSTEM_URL);
            }
            if(typeof form.data(Service.SYSTEM_METHOD) !== "undefined"){
                method = form.data(Service.SYSTEM_METHOD);
            }
            //retrieve form fields and submission data from loaded form
            //exclude file input from search...handled separately below
            data = form.serializeArray();
        } else {
            //No form detected......lets build one.
            const formContent = targetContainer.clone();
            form = jQuery("<form></form>");
            form.append(formContent.children());
            //jQuery does not clone selects.....say its to expensive
            const selects = targetContainer.find("select");
            jQuery(selects).each(function (i) {
                form.find("select").eq(i).val(jQuery(this).val());
            });
            if(typeof targetContainer.data(Service.SYSTEM_URL) !== "undefined"){
                site_url = targetContainer.data(Service.SYSTEM_URL);
            }
            if(typeof targetContainer.data(Service.SYSTEM_METHOD) !== "undefined"){
                method = targetContainer.data(Service.SYSTEM_METHOD);
            }
            //we use the target as the loaded form.
            //Form object used to retrieve data
            Service.LoadedForm = targetContainer;
            //retrieve form fields and submission data from loaded form
            //exclude file input from search...handled separately below
            data = form.serializeArray();
        }
    }

    // if LoadedForm is not specified, terminate the action
    if(Service.LoadedForm.length <= 0){
        Service.ActionLoading = false;
        return false;
    }

    //if headers function is defined execute it and get headers for request
    if(typeof requestHeaders !== "undefined"){
        if(Controller.hasOwnProperty(requestHeaders)){
            headers = Controller[requestHeaders]();
        }
    }

    //create FormData object from form values
    params = Service.FormData(data);

    if(typeof site_url === "undefined" || site_url.length <= 0){
        Service.ActionLoading = false;
        return false;
    }
    method = method.toUpperCase();

    //determine if the form has a file, and if so serialize
    //using FormData object, or just use an object
    const file = Service.LoadedForm.find("input[type='file']");
    if(file.length > 0){
        jQuery(file).each(function(e){
            //determine if multiple files are selected and add
            //each of them to the payload
            if(file[e].files.length > 1){
                let fileName = file[e].name;
                //determine if file name is array or not
                if(fileName.substring(fileName.length -1,fileName.length) !== "]"){
                    fileName = `${file[e].name}[]`;
                }
                for(let i=0; i<file[e].files.length; i++){
                    params.append(fileName,file[e].files[i]);
                }
            }
            else{
                params.append(file[e].name,file[e].files[0]);
            }
        });
    }

    //determine if there are submit transformations and execute them
    if(typeof custom !== "undefined")
        params = Service.ExecuteSubmitTransformation(custom,Service.LoadedForm,params,ActionButton);

    //determine if we should send form to server for processing or not
    if(Service.CanSubmitForm === false){
        Service.ActionLoading = false;
        return false;
    }

    //determine the response handlers to use for success and error
    //defaults are chosen by default obviously
    let success = Service.SuccessHandler;
    let error = Service.ErrorHandler;
    let successHandler = ActionButton.data(Service.SYSTEM_SUCCESS_HANDLER);
    let errorHandler = ActionButton.data(Service.SYSTEM_ERROR_HANDLER);
    if(typeof successHandler !== "undefined" && Controller.hasOwnProperty(successHandler)){
        success = Controller[successHandler];
    }
    if(typeof errorHandler !== "undefined" && Controller.hasOwnProperty(errorHandler)){
        error = Controller[errorHandler];
    }
    const requestData = new Requirement();
    requestData.Params = params;
    requestData.SuccessHandler = success;
    requestData.ErrorHandler = error;
    requestData.Complete = complete;
    requestData.Site = site_url;
    requestData.Request = method;
    requestData.ActionBtn = ActionButton;
    requestData.Component = Service.LoadedForm;
    requestData.Headers = headers;
    Service.ServerRequest(requestData);
});

/**
 * -- File Select --
 * Handles file selection and preview. It will only execute if
 * there is no other action in progress. Behaviour is to
 * locate the container with the file input and image,
 * execute click function on file input to launch dialog,
 * and set up the preview for showing when selected.
 */
Controller.AddProperty("FileSelect",function(elem){
    //if there is a triggered action do not execute
    if(Service.ActionLoading) return false;
    const ActionButton = jQuery(elem);
    Service.ActionLoading = true;
    let target = ActionButton.data(Service.SYSTEM_TARGET);
    let custom = ActionButton.data(Service.SYSTEM_COMPLETE);
    //load the form associated with the file
    const form = (typeof target === "undefined")
        ? jQuery(ActionButton.parents(Service.SYSTEM_FILE_UPLOAD_CONTAINER))
        : jQuery(document).find(`#${target}`);
    // find the file input element
    let input = form.find("input[type=file]");
    // find the image element that displays preview
    let img = form.find("img");
    // trigger click event that opens upload file dialog
    input.click();
    // update preview image when file is changed
    input.change(function() {
        Service.ImagePreview(input, img);
    });
    input.change();
    // execute custom code on the form
    if(typeof custom !== "undefined"){
        Service.ExecuteCustom(custom,form,ActionButton);
    }
    Service.ActionLoading = false;
});

/**
 * -- Modal Select --
 * Handles launching modals. It will only execute if
 * there is no other action in progress. Behaviour is to
 * Find the element specified and update the loaded modal
 * property with it, place it on the DOM in the modal
 * container (this is just an empty div with the specified
 * class that MUST be in the layout), execute any custom
 * modifications, and launch.
 */
Controller.AddProperty("ModalSelect",function(elem){
    //if there is a triggered action do not execute
    if(Service.ModalLoading) return false;
    const ActionButton = jQuery(elem);
    Service.ModalLoading = true;
    //make action button aware of loaded type
    ActionButton.data(Service.SYSTEM_LOAD_TYPE,"modal");
    //if a modal is already loaded do not execute
    if(Service.LoadedModal === null){
        let action = ActionButton.data(Service.SYSTEM_ACTION);
        Service.FindElement(action, ActionButton).then((elem) => {
            Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_CUSTOM),elem,ActionButton).then(() => {
                Service.LoadData(elem, ActionButton).then((success) => {
                    if(!success) {
                        elem = Service.DefaultModalHandler(Service.DefaultElementHandler(ActionButton),ActionButton);
                        Service.LoadModal(elem, ActionButton).then((modal) => {
                            Service.LaunchModal(modal,ActionButton).then(() => {
                                modal.find(".modal-title").empty().text("Modal Launch Error")
                                Service.LoadedModal = modal;
                                Service.ModalLoading = false;
                            });
                        })
                    }else{
                        Service.LoadModal(elem, ActionButton).then((modal) => {
                            Service.LaunchModal(modal,ActionButton).then(() => {
                                //execute complete modifications
                                Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_COMPLETE),modal,ActionButton).then(() => {
                                    Service.LoadedModal = modal;
                                    Service.ModalLoading = false;
                                });
                            });
                        })
                    }
                })
            });
        });
    }
    else{
        Service.ModalLoading = false;
    }
});

/**
 * -- Panel Select --
 * Handles loading new panels unto the DOM. It will only
 * execute if there is no other action in progress.
 * Behaviour is to Find the element specified and update
 * the loaded panel property with it, determine the target
 * where the panel should be placed, load panel unto
 * the DOM, and execute custom modifications if specified
 */
Controller.AddProperty("PanelSelect",function(elem){
    const ActionButton = jQuery(elem);
    const action = ActionButton.data(Service.SYSTEM_ACTION);
    //determine if current action is already being loaded
    //if so exit............
    if(jQuery.inArray(action,Service.PanelLoading) !== -1){
        return false;
    }
    Service.PanelLoading.push(ActionButton.data(Service.SYSTEM_ACTION));

    //make action button aware of loaded type
    ActionButton.data(Service.SYSTEM_LOAD_TYPE,"panel");
    //get history url if defined
    const history = ActionButton.data(Service.SYSTEM_HISTORY);
    //define properties to store on history
    const historyData = {};
    //attributes that should be persisted if present on the action button
    const filterList = [
        Service.SYSTEM_ACTION,
        Service.SYSTEM_COMPLETE,
        Service.SYSTEM_TARGET,
        Service.SYSTEM_CUSTOM,
        Service.SYSTEM_HISTORY,
        Service.SYSTEM_NOTIFICATION_ON_SUCCESS,
        Service.SYSTEM_NOTIFICATION_ON_ERROR,
        Service.SYSTEM_NOTIFICATION,
        Service.SYSTEM_TITLE
    ];
    //add them to history data if present
    jQuery.each(ActionButton.data(),function(key,value){
        if(jQuery.inArray(key,filterList) !== -1) {
            historyData[key] = value;
        }
        //add values that are strings....other types will cause errors
        else if(typeof value === "string"){
            historyData[key] = value;
        }
    });

    //add history record
    if(typeof history === "undefined"){
        window.history.pushState({
            data: historyData,
            panelSelect: true
        },"");
    }

    //determine and set page title
    const title = (typeof ActionButton.data(Service.SYSTEM_TITLE) !== "undefined")
        ? ActionButton.data(Service.SYSTEM_TITLE)
        : ActionButton.data(Service.SYSTEM_ACTION);
    window.document.title = `${Service.Title} - ${title}`;

    //locate panel
    Service.FindElement(ActionButton.data(Service.SYSTEM_ACTION), ActionButton).then((panel) =>{
        //execute custom modifications
        Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_CUSTOM),panel,ActionButton).then(() => {
            Service.LoadData(panel, ActionButton).then((success) => {
                const target =
                    (
                        typeof ActionButton.data(Service.SYSTEM_TARGET) !== "undefined" &&
                        ActionButton.data(Service.SYSTEM_TARGET) !== null &&
                        ActionButton.data(Service.SYSTEM_TARGET).length > 0
                    ) ? ActionButton.data(Service.SYSTEM_TARGET) : MainContainer;
                if(success){
                    //load panel unto the DOM
                    Service.LoadPanel(panel,ActionButton,ActionButton.data(Service.SYSTEM_TARGET)).then((loadedPanel) =>{
                        //execute complete modifications
                        Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_COMPLETE),loadedPanel,ActionButton).then(() => {
                            Service.LoadedPanel[target] = { ActionButton, LoadedPanel: loadedPanel };
                        });
                    });
                }else{
                    const container = jQuery("<div></div>");
                    container.append(Service.DefaultElementHandler(ActionButton));
                    Service.LoadPanel(container,ActionButton,ActionButton.data(Service.SYSTEM_TARGET)).then((loadedPanel) =>{
                        Service.LoadedPanel[target] = { ActionButton, LoadedPanel: loadedPanel };
                    });
                }
                //remove action from loading list.......
                const index = Service.PanelLoading.indexOf(action);
                Service.PanelLoading.splice(index,1);
            });
        });
    });
});

/**
 * -- Reload Panel --
 * this function reloads the current panel
 */
Controller.AddProperty("ReloadPanel",function(target = null){
    if(target === null){
        target = MainContainer;
    }
    else if(typeof target !== "string"){
        target = jQuery(target).data("action");
    }

    if(typeof Service.LoadedPanel[target] === "undefined") return;
    const panel = Service.LoadedPanel[target].LoadedPanel;
    const btn = Service.LoadedPanel[target].ActionButton;
    Service.LoadData(panel, btn).then((success) => {
        if(success){
            Service.LoadPanel(panel, btn, target).then((loadedPanel) => {
                Service.ExecuteCustom(btn.data(Service.SYSTEM_COMPLETE),loadedPanel,btn).then(() => {
                    Service.LoadedPanel[target].LoadedPanel = loadedPanel;
                });
            });
        }else{
            const container = jQuery("<div></div>");
            container.append(Service.DefaultElementHandler(btn));
            Service.LoadPanel(container, btn, target).then((loadedPanel) =>{
                Service.LoadedPanel[target].LoadedPanel = loadedPanel;
            });
        }
    });
});

window.onpopstate = function(event){
    //get page state
    const state = event.state;
    if(state !== null){
        if(state.panelSelect){
            //create a action link to fire the controller action
            const link = jQuery("<a>");
            //add the data attributes recorded in the state
            jQuery.each(state.data,function(i,e){
                link.attr(`data-${i}`,e);
            });
            //add a history data attribute so the panel
            //ignores the entry for pushState
            link.attr("data-history",true);
            //fire controller action with created anchor tag
            Controller.PanelSelect(link[0]);
        }
    }
};