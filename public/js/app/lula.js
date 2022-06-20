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

/**
 * -- Error Handler --
 * This function is responsible for handling all requests
 * which return 400 or 500 level status codes
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
 * @param result object containing success handler parameters
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
 * @param result object containing notification parameters
 */
Service.AddProperty("NotificationHandler", function (result) {
    switch (result.notificationType) {
        case "alert": {
            if (typeof Service.AlertNotification === "function") {
                Service.AlertNotification(result);
            }
            else {
                alert(result.message)
            }
            break;
        }
        case "toaster": {
            if (typeof Service.ToasterNotification === "function") {
                Service.ToasterNotification(result);
            }
            else {
                alert(result.message);
            }
            break;
        }
        case "none": {
            break;
        }
        default: {
            if (result.status === "success") {
                if (typeof Service.ToasterNotification === "function") {
                    Service.ToasterNotification(result);
                }
                else {
                    alert(result.message);
                }
            }
            else {
                if (typeof Service.AlertNotification === "function") {
                    Service.AlertNotification(result);
                }
                else {
                    alert(result.message)
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
    elem.append("<p>The panel you are trying to load experienced an error while rendering....</p>");
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
Service.AddProperty("ErrorMessageHandler", function(error, request){
    return error;
});

/**
 * -- Error Data Handler --
 * This function handles default transformation of error
 * data from server
 *
 * @param request object that represents data returned from server
 */
Service.AddProperty("ErrorDataHandler", function (request) {
    let data = {
        Code: request.statusText,
        Entity: "Application"
    };
    if (request.responseText.length > 0) {
        try {
            data = JSON.parse(request.responseText);
        }
        catch (e) {
            data.Code = "An error occurred on the server";
            data.Entity = "Application";
        }
    }
    return data;
});

/**
 * -- Success Message Handler --
 * This function handles default transformation of success
 * data from server into a success message
 *
 * @param request object that represents data returned from server
 */
Service.AddProperty("SuccessMessageHandler", function (request) {
    return request.statusText;
});

/**
 * -- Success Data Handler --
 * This function handles the default transformation of success
 * data from the server into a usable format
 *
 * @param data data as returned from the server
 * @param request object that represents data returned from server
 */
Service.AddProperty("SuccessDataHandler", function(data, request){
    const contentType = request.getResponseHeader("Content-Type");
    if(contentType === "application/json"){
        return request.responseJSON;
    }
    else if(contentType === "text/html" || contentType === "text/plain"){
        return request.responseText;
    }
    else{
        return null;
    }
});

/**
 * -- Server Request --
 * This function handles ajax requests
 *
 * @param requirements object containing request parameters
 */
Service.AddProperty("ServerRequest", function (requirements) {
    //backwards compatibility, method and request is the same thing
    if (typeof requirements.method !== "undefined") requirements.request = requirements.method;
    //ensure there is a request type
    requirements.request = (typeof requirements.request === "undefined" || requirements.request === null || !requirements.request)
        ? 'POST'
        : requirements.request.toUpperCase();

    //ensure there are request headers
    if (typeof requirements.headers === "undefined" || requirements.headers === null || !requirements.headers) {
        requirements.headers = [];
    }

    //ensure there are handlers for success and error results
    if (typeof requirements.success === "undefined" || requirements.success === null || !requirements.success) {
        requirements.success = Service.SuccessHandler;
    }

    if (typeof requirements.error === "undefined" || requirements.error === null || !requirements.error) {
        requirements.error = Service.ErrorHandler;
    }

    if (typeof requirements.component === "undefined" || requirements.component === null || !requirements.component) {
        requirements.component = jQuery("<div></div>");
    }

    if (typeof requirements.responseType === "undefined" || requirements.responseType === null || !requirements.responseType) {
        requirements.responseType = "json";
    }

    if (typeof requirements.actionBtn === "undefined" || requirements.actionBtn === null || !requirements.actionBtn) {
        requirements.actionBtn = jQuery("<button></button>", { type: "button" });
    }

    // fix: throws an exception if a POST request is sent
    //without a body
    if (requirements.params === null) {
        requirements.params = {};
    }

    //disable form input and controls while request is
    //processed by the server
    Service.LoadingStateOn(requirements.actionBtn);

    const successFunction = function (data, status, jqXHR) {
        //enable disabled form controls
        Service.LoadingStateOff(requirements.actionBtn);
        //check if reload header is set and reload the page
        //if it is
        if (jqXHR.getResponseHeader("X-Reload")) {
            location.reload();
            return;
        }
        //check if the redirect header is set and redirect
        //the page if it is
        if (jqXHR.getResponseHeader("X-Redirect")) {
            location.href = jqXHR.getResponseHeader("X-Redirect");
            return;
        }
        let res = {};
        res.status = status;
        res.message = Service.SuccessMessageHandler(jqXHR);
        res.data = Service.SuccessDataHandler(data,jqXHR);
        res.actionBtn = requirements.actionBtn;
        res.component = requirements.component;


        //determine default notification handling mechanism
        res.notificationType = requirements.actionBtn.data(Service.SYSTEM_NOTIFICATION_ON_SUCCESS) || "toaster";
        //trigger notification event
        if (typeof requirements.actionBtn.data(Service.SYSTEM_NOTIFICATION) === "undefined" ||
            requirements.actionBtn.data(Service.SYSTEM_NOTIFICATION) === "true" ||
            requirements.actionBtn.data(Service.SYSTEM_NOTIFICATION) === "success"
        ) {
            Service.NotificationHandler(res);
        }

        //execute the success callback with results received.
        requirements.success(res);
        Service.ExecuteCustom(requirements.complete, requirements.component, requirements.actionBtn, res).then(() => {
            Service.ActionLoading = false;
        });
    };

    const ajax_params = {
        url: requirements.site,
        type: requirements.request,
        success: successFunction,
        error: function (request, status, error) {
            //jQuery sometimes throws a parse error but the response is successful
            if (request.status === 200) {
                successFunction({}, "success", request);
                return;
            }

            //redirect to login if access error
            if(request.status === 401 || request.status === 403){
                location.href = location.origin;
                return;
            }

            //enable disabled elements
            Service.LoadingStateOff(requirements.actionBtn);
            const res = {
                status,
                actionBtn: requirements.actionBtn,
                component: requirements.component,
                notificationType: "alert"
            };

            //define and format message from server or use default implementation
            res.message = Service.ErrorMessageHandler(error, request);
            //define and format data from server or use default implementation
            res.data = Service.ErrorDataHandler(request);
            //execute error handler
            requirements.error(res);
            Service.ExecuteCustom(requirements.complete, requirements.component, requirements.actionBtn, res).then(() => {
                //add status codes and how they should be treated here
                if (typeof requirements.actionBtn.data(Service.SYSTEM_NOTIFICATION) === "undefined" ||
                    requirements.actionBtn.data(Service.SYSTEM_NOTIFICATION) === "true" ||
                    requirements.actionBtn.data(Service.SYSTEM_NOTIFICATION) === "error") {
                    //set custom notification type if present
                    if (typeof requirements.actionBtn.data(Service.SYSTEM_NOTIFICATION_ON_ERROR) !== "undefined") {
                        res.notificationType = requirements.actionBtn.data(Service.SYSTEM_NOTIFICATION_ON_ERROR);
                    }
                    switch (request.status) {
                        case 500: {
                            Service.NotificationHandler(res);
                            break;
                        }
                        case 404: {
                            res.status = "error";
                            res.message = "Oops!";
                            Service.NotificationHandler(res);
                            break;
                        }
                        default: {
                            res.status = "error";
                            res.message = "Oops!";
                            Service.NotificationHandler(res);
                        }
                    }
                }
                Service.ActionLoading = false;
            });
        },
        //execute specified actions before request is sent
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (requirements.headers.length > 0) {
                jQuery.each(requirements.headers, function () {
                    xhr.setRequestHeader(this.Name, this.Value);
                });
            }
        }
    };
    //list request types that require message body
    //and determine if the current request is in
    //the list.
    let requestTypes = ['POST', 'PUT', 'HEAD', 'DELETE'];
    if (requestTypes.indexOf(requirements.request.toUpperCase()) >= 0) {
        ajax_params.data = requirements.params;
    }
    ajax_params.dataType = requirements.responseType;
    ajax_params.processData = false;
    ajax_params.contentType = false;
    ajax_params.global = false;
    jQuery.ajax(ajax_params);
});

/**
 * -- LaunchModal --
 * This function handles default implementation for
 * launching a modal
 *
 */
Service.AddProperty("LaunchModal", function (modal, actionBtn) {
    return new Promise(function(resolve){
        modal.on('hide.bs.modal', function (e) {

        });
        modal.on('hidden.bs.modal', function () {
            Service.LoadedModal.remove();
            Service.LoadedModal = null;
            jQuery(`.${ModalContainer}`).empty();
        });
        const action = modal.data(Service.SYSTEM_ACTION);
        if (typeof action === "string") {
            let func = Service.Data[action];
            if (typeof func !== "undefined"){
                func(modal, actionBtn).then(() => {
                    modal.modal();
                    resolve(true);
                });
            }else{
                modal.modal();
                resolve(true);
            }
        }
        else{
            modal.modal();
            resolve(true);
        }
    });
});

/**
 * -- Bind --
 * this function is responsible for binding the data
 * provided to the elements of the desired
 * component. only components with the class 'bind'
 * or 'bind-loop' are handled by this function. Binding
 * is done using the id property.
 *
 * @param component element that will have its elements bound
 * @param data data set from which values will be used in binding
 */
Service.AddProperty("Bind", function (component, data, actionBtn = null) {
    let elems = component.find(`.${Service.SYSTEM_BIND}`);
    jQuery.each(elems, function () {
        let elem = jQuery(this);

        //determine if global transformation should take place
        if (elem.hasClass(Service.SYSTEM_BIND_GLOBAL)) {
            //if custom function not present nothing happens
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

        //if the element is a select list we build it out
        if (elem.prop("tagName") === "SELECT") {
            let list = elem.data(Service.SYSTEM_LIST);
            if (typeof list !== "undefined") {
                let listGroup = Service.ModelData.List[list];
                if (typeof listGroup !== "undefined") {
                    Service.SelectListBuilder(elem, listGroup);
                }
            }
        }
        // if the element is an image bind the value to image source
        if (elem.prop("tagName") === "IMG") {
            if (typeof elem.data(Service.SYSTEM_PROPERTY) !== "undefined") {
                elem.prop("src", Service.GetProperty(elem.data(Service.SYSTEM_PROPERTY), data));
            }
            else if (typeof elem.prop("id") !== "undefined") {
                elem.prop("src", Service.GetProperty(elem.prop("id"), data));
            }
        }
        else {
            if (typeof elem.data(Service.SYSTEM_PROPERTY) !== "undefined") {
                let property = Service.GetProperty(elem.data(Service.SYSTEM_PROPERTY), data);
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
                    elem.data("value", property);
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
            }
            else if (typeof elem.data(Service.SYSTEM_LOOP) !== "undefined") {
                let property = Service.GetProperty(elem.data(Service.SYSTEM_LOOP), data);

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
                        $.each(childElems, function () {
                            let childElem = jQuery(this);
                            if (typeof childElem.data(Service.SYSTEM_PROPERTY) !== "undefined") {
                                let property = Service.GetProperty(childElem.data(Service.SYSTEM_PROPERTY), item);
                                //determine if a transformation method is present on the element
                                if (typeof childElem.data(Service.SYSTEM_CUSTOM) !== "undefined") {
                                    if (!childElem.hasClass(Service.SYSTEM_BIND_ELEM)) {
                                        property = Service.Transform(childElem.data(Service.SYSTEM_CUSTOM), null, property, actionBtn);
                                    }
                                }
                                //transform element instead of data provided
                                if (childElem.hasClass(Service.SYSTEM_BIND_ELEM)) {
                                    Service.Transform(childElem.data(Service.SYSTEM_CUSTOM), childElem, property, actionBtn);
                                }
                                //bind property to element as valid HTML
                                else if (childElem.hasClass(Service.SYSTEM_BIND_VALUE)) {
                                    if (childElem.is('input,select,textarea')) {
                                        childElem.val(property);
                                    }
                                    childElem.attr('data-value', property);
                                    childElem.data("value", property);
                                    if (childElem.prop("tagName") === "SELECT") {
                                        let options = childElem.find("option");
                                        childElem.prop("selectedIndex", 0);
                                        options.each(function (i) {
                                            if (this.value == property) {
                                                childElem.prop("selectedIndex", i);
                                            }
                                        });
                                    }
                                }
                                else {
                                    childElem.html(property);
                                }
                            }
                            else {
                                let property = Service.GetProperty(childElem.prop("id"), item);
                                if (typeof childElem.data(Service.SYSTEM_CUSTOM) !== "undefined") {
                                    if (!childElem.hasClass(Service.SYSTEM_BIND_ELEM)) {
                                        property = Service.Transform(childElem.data(Service.SYSTEM_CUSTOM), null, property, actionBtn);
                                    }
                                }

                                //transform element instead of data provided
                                if (childElem.hasClass(Service.SYSTEM_BIND_ELEM)) {
                                    Service.Transform(childElem.data(Service.SYSTEM_CUSTOM), childElem, property, actionBtn);
                                }
                                //bind property to element as valid HTML
                                else if (childElem.hasClass(Service.SYSTEM_BIND_VALUE)) {
                                    if (childElem.is('input,select,textarea')) {
                                        childElem.val(property);
                                    }
                                    childElem.attr('data-value', property);
                                    childElem.data("value", property);
                                    if (childElem.prop("tagName") === "SELECT") {
                                        let options = childElem.find("option");
                                        childElem.prop("selectedIndex", 0);
                                        options.each(function (i) {
                                            if (this.value == property) {
                                                childElem.prop("selectedIndex", i);
                                            }
                                        });
                                    }
                                }
                                else {
                                    childElem.html(property);
                                }
                            }
                        });
                        // add the element with the bindings to the parent
                        elem.append(childClone);
                    });
                }

                if (typeof elem.data(Service.SYSTEM_CUSTOM) !== "undefined") {
                    elem = Service.Transform(elem.data(Service.SYSTEM_CUSTOM), elem, actionBtn);
                }
            }
            else {
                let property = Service.GetProperty(elem.prop("id"), data);
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
                    elem.data("value", property);
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
            }
        }
    });

    //bind meta data
    let elems_meta = component.find(`.${Service.SYSTEM_BIND_META}`);
    jQuery.each(elems_meta, function () {
        let elem = jQuery(this);
        if (elem.prop("tagName") === "IMG") {
            if (typeof elem.prop("id") !== "undefined") {
                elem.prop("src", Service.GetProperty(elem.prop("id"), Service.MetaData));
            }
        }
        else {
            if (typeof elem.prop("id") !== "undefined") {
                let property = Service.GetProperty(elem.prop("id"), Service.MetaData);
                if (typeof elem.data(Service.SYSTEM_CUSTOM) !== "undefined") {
                    let func = Service.Transformation[elem.data(Service.SYSTEM_CUSTOM)];
                    if (typeof func !== "undefined") {
                        property = func(property);
                    }
                }
                elem.html(property);
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

        //if element is a select list build it out using select list builder
        if (elem[0].type === 'select-one') {
            let list = elem.data(Service.SYSTEM_LIST);
            if (typeof list !== "undefined") {
                //get dropdown list elements from storage
                let listGroup = Service.ModelData.List[list];
                if (typeof listGroup !== "undefined") {
                    Service.SelectListBuilder(elem, listGroup);
                }
            }
        }

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
            case 'hidden':
                elem.data("value", el);
                elem.val(el);
                break;
            case 'color':
                elem.data("value", el);
                elem.val(el);
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
            case 'datetime':
            case 'datetime-local':
            case 'email':
            {
                elem.data("value", el);
                elem.val(el);
                break;
            }
            case 'number':
                elem.data("value", el);
                elem.val(el);
                break;
            case 'month':
            case 'range':
            case 'search':
            case 'tel':
            case 'time':
            case 'url':
            case 'week':
            case 'text':
                elem.data("value", el);
                elem.val(el);
                break;
            case 'textarea':
                elem.data("value", el);
                elem.val(el);
                break;
            case 'password':
                elem.data("value", el);
                elem.val(el);
                break;
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
        }
    }
    for (let x = 0; (els && x < els.length); x++) {
        Service.TriggerEvents(jQuery(els[x]));
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
 * list from a primary one (eg. Selecting a country and
 * retrieving associated states)
 *
 * @param elem the element selected
 * @param target the element to update with created select list
 */
Service.AddProperty("ListUpdate", function (elem, target) {
    elem = jQuery(elem);
    if (elem.val()) {
        let url = elem.data(Service.SYSTEM_URL);
        if(typeof url !== "undefined"){
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
        }else{
            const dataList = elem.data(Service.SYSTEM_ACTION);
            if(typeof dataList !== "undefined"){
                let data = Service.ModelData.List[dataList];
                if(typeof data !== "undefined"){
                    data = data[elem.val()];
                    if(typeof data !== "undefined"){
                        Service.SelectListBuilder(jQuery(target), data, elem)
                    }
                }
            }
        }
    }
});

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
 * this function is responsible for loading html templates
 * into the panel location specified. if no location
 * is specified the default is used.
 *
 * @param elem the panel selected to be loaded
 * @param target location where it should be placed
 */
Service.AddProperty("LoadPanel", function (elem, actionBtn, target) {
    return new Promise((resolve) => {
        if (typeof elem !== "undefined" && typeof elem === "object") {
            const tContainer = jQuery("<div></div>");
            let action = elem.data(Service.SYSTEM_ACTION);
            //check if a data function is defined by convention
            if(!Service.Data.hasOwnProperty(action)){
                action = `${actionBtn[0].dataset[Service.SYSTEM_ACTION]}-data`;
            }
            if (Service.Data.hasOwnProperty(action)) {
                Service.Data[action](elem, actionBtn).then(() => {
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
                    //add elem as LoadedPanel for further reference
                    Service.LoadedPanel = elem;
                    tContainer.empty().remove();
                    return resolve(true);
                });
            }
            else{
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
                //add elem as LoadedPanel for further reference
                Service.LoadedPanel = elem;
                tContainer.empty().remove();
                return resolve(true);
            }
        }
        resolve(false);
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
    if (emptyList) elem.empty();
    const defaultOption = elem.data("default");
    if(defaultOption){
        elem.append(`<option data-value="" value=""> ${defaultOption} </option>`);
    }
    jQuery.each(list, function () {
        elem.append(`<option data-value="${this.Value}" value="${this.Value}"> ${this.Text} </option>`);
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
            //add hash tag if not present. element lookup is always by id
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
            resolve(element);
        } else {
            const container = jQuery("<div></div>");
            container.append(Service.DefaultElementHandler(actionBtn));
            resolve(container);
        }
    });
});

/**
 * -- Find Local Element --
 * this function retrieves templates from the
 * template tag and ensures they are recognized by the DOM
 *
 * @param name name of the element to retrieve
 * @param actionBtn object triggering action
 */
Service.AddProperty("FindLocalElement", function (name, actionBtn = null) {
    let templateContent = jQuery('template').prop('content');
    templateContent = jQuery(templateContent);
    //add hash tag if not present. element lookup is always by id
    if (name.substring(0, 1) !== "#") name = `#${name}`;
    let item = templateContent.find(name);
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
        return element;
    } else {
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
                    property = Service.Transformation[item](property, actionBtn);
                } else if (Controller.hasOwnProperty(item)) {
                    property = Controller[item](property, actionBtn);
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
 * -- Bootstrap --
 * this function defines default process for loading the DOM.
 * It searches for the defined main container and loads the
 * defined panel into it
 */
Service.AddProperty("Bootstrap", function(link = null){
    Service.ModelData.List = {};

    setTimeout(async function(){
        await Controller.PanelSelect(document.getElementById(`${MainContainer}`));
        if(link !== null) await Controller.PanelSelect(link[0]);
    },1000);
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
Controller.AddProperty("FormSubmit",function(elem,e){
    //prevent default action for submit button
    if(typeof e !== "undefined"){
        e.preventDefault();
    }else{
        window.event.preventDefault();
    }
    //exit if another submission is in progress
    if(Service.ActionLoading) return false;
    const ActionButton = jQuery(elem);
    Service.ActionLoading = true;
    Service.CanSubmitForm = true;
    let target = ActionButton.data(Service.SYSTEM_TARGET);
    let custom = ActionButton.data(Service.SYSTEM_CUSTOM);
    let complete = ActionButton.data(Service.SYSTEM_COMPLETE);
    let requestHeaders = ActionButton.data(Service.SYSTEM_HEADERS);
    let site_url = "";
    let method = "";
    let params = new FormData();
    let headers = [];
    let data = [];

    //load the form from target specified. if not
    //load the parent form element
    if(typeof target === "undefined"){
        target = "";
        Service.LoadedForm = jQuery(ActionButton.parents('form'));
    }
    else{
        const url = ActionButton.data(Service.SYSTEM_ACTION);
        const method = ActionButton.data(Service.SYSTEM_METHOD);
        if (target.substring(0, 1) !== "#") target = `#${target}`;
        const targetContainer = jQuery(document).find(target);
        let form = (targetContainer.is("form")) ? targetContainer : targetContainer.find("form");
        if (form.length > 0) {
            Service.LoadedForm = form;
            if(typeof url !== "undefined") form.attr("action",url);
            if(typeof method !== "undefined") form.attr("method",method);
        } else {
            const formContent = targetContainer.clone();
            form = jQuery("<form></form>",
                {
                    action: url,
                    method: method
                });
            form.append(formContent.children());
            //jQuery does not clone selects.....say its to expensive
            const selects = targetContainer.find("select");
            jQuery(selects).each(function (i) {
                form.find("select").eq(i).val(jQuery(this).val());
            });
            //targetContainer.empty().append(form);
            Service.LoadedForm = form;
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



    //retrieve form fields and submission data from loaded form
    //exclude file input from search...handled separately below
    data = jQuery(Service.LoadedForm.serializeArray());
    jQuery.each(data,function(){
        params.append(this.name,this.value);
    });
    site_url = Service.LoadedForm[0].action;
    method = Service.LoadedForm[0].method;

    if(typeof site_url === "undefined") return false;
    if(typeof method === "undefined") method = "POST";
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
        params = Service.ExecuteSubmitTransformation(custom,Service.LoadedForm,params);

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

    //determine how the form submission should be processed
    //if a specific action was specified we use that
    //otherwise we use the default server request
    let ex = Service.Action[target];
    if(typeof ex !== "undefined") ex({
        params,
        success,
        error,
        headers,
        complete,
        site: site_url,
        request: method,
        actionBtn: ActionButton,
        component: Service.LoadedForm
    });
    else Service.ServerRequest({
        params,
        success,
        error,
        headers,
        complete,
        site: site_url,
        request: method,
        actionBtn: ActionButton,
        component: Service.LoadedForm
    });
});

/**
 * -- File Select --
 * Handles file selection and preview. It will only execute if
 * there is no other action in progress. Behaviour is to
 * locate the container with the file input and image,
 * execute click function on file input to launch dialog,
 * and setup the preview for showing when selected.
 */
Controller.AddProperty("FileSelect",function(elem){
    //if there is a triggered action do not execute
    if(Service.ActionLoading) return false;
    const ActionButton = jQuery(elem);
    Service.ActionLoading = true;
    let target = ActionButton.data(Service.SYSTEM_ACTION);
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
        Service.FindElement(action, ActionButton).then((elem) =>{
            Service.LoadedModal = elem;

            //format modal... has to be structured a specific way
            //to work
            if (!Service.LoadedModal.hasClass("modal")) {
                Service.LoadedModal = Service.DefaultModalHandler(elem,ActionButton);
            }
            //place modal on the DOM
            const modalContainer = jQuery(`#${ModalContainer}`);
            modalContainer.empty().append(Service.LoadedModal);
            //update modal attributes
            const dataAttributes = ActionButton.data();
            const filterList = [Service.SYSTEM_ACTION,Service.SYSTEM_COMPLETE];
            jQuery.each(dataAttributes,function(key,value){
                //filter out action and custom attribute
                // these are defined on the modal
                if(jQuery.inArray(key,filterList) === -1){
                    Service.LoadedModal.data(key,value);
                }
            });
            //execute custom modifications
            Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_CUSTOM),Service.LoadedModal,ActionButton).then(() => {
                // launch modal
                Service.LaunchModal(Service.LoadedModal,ActionButton).then(() => {
                    //execute complete modifications
                    Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_COMPLETE),Service.LoadedModal,ActionButton).then(() => {
                        Service.ModalLoading = false;
                    });
                });
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
    //locate panel
    Service.FindElement(ActionButton.data(Service.SYSTEM_ACTION), ActionButton).then((panel) =>{
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
        //execute custom modifications
        Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_CUSTOM),Service.LoadedPanel,ActionButton).then(() => {
            //load panel unto the DOM
            Service.LoadPanel(panel,ActionButton,ActionButton.data(Service.SYSTEM_TARGET)).then(() =>{
                //execute complete modifications
                Service.ExecuteCustom(ActionButton.data(Service.SYSTEM_COMPLETE),Service.LoadedPanel,ActionButton).then(() => {
                    //remove action from loading list.......
                    const index = Service.PanelLoading.indexOf(action);
                    Service.PanelLoading.splice(index,1);
                });
            });
        });
    });
});

/**
 * -- Reload Panel --
 * this function reloads the current panel
 */
Controller.AddProperty("ReloadPanel",function(){
    const btn = jQuery("<button></button>",{
        type:"button",
        "data-notification":"false"
    });
    Service.LoadPanel(Service.LoadedPanel,btn);
});

/**
 * -- Get Select List --
 * this function gets items from Service.ModelData.List based
 * on the id provided
 */
Controller.AddProperty("UpdateSecondaryList", function(elem){
    elem = jQuery(elem);
    elem.data(Service.SYSTEM_NOTIFICATION,false);
    const target = jQuery(document).find(`#${elem.data(Service.SYSTEM_TARGET)}`);
    if(target){
        Service.ListUpdate(elem,target);
    }
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
