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
Service.AddProperty("ErrorMessageHandler", function(request,error,actionBtn){
    return error;
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
    if(request.responseJSON.length > 0){
        return request.responseJSON;
    }
    if (request.responseText.length > 0) {
        try {
            data = JSON.parse(request.responseText);
        }
        catch (e) {
            data = {};
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
    //Request kept for backward compatibilty
    //Will be removed in the future
    if(typeof requirements.Method !== "undefined" && requirements.Method !== null && !requirements.Method){
        requirements.Request = requirements.Method;
    }

    //ensure there are request headers
    if (typeof requirements.Headers === "undefined" || requirements.Headers === null || !requirements.Headers) {
        requirements.Headers = [];
    }

    //ensure there are handlers for success and error results
    if (typeof requirements.SuccessHandler === "undefined" || requirements.SuccessHandler === null || !requirements.SuccessHandler) {
        requirements.SuccessHandler = Service.SuccessHandler;
    }

    if (typeof requirements.ErrorHandler === "undefined" || requirements.ErrorHandler === null || !requirements.ErrorHandler) {
        requirements.ErrorHandler = Service.ErrorHandler;
    }

    if (typeof requirements.Component === "undefined" || requirements.Component === null || !requirements.Component) {
        requirements.Component = jQuery("<div></div>");
    }

    if (typeof requirements.ResponseType === "undefined" || requirements.ResponseType === null || !requirements.ResponseType) {
        requirements.ResponseType = "json";
    }

    if (typeof requirements.ActionBtn === "undefined" || requirements.ActionBtn === null || !requirements.ActionBtn) {
        requirements.ActionBtn = jQuery("<button></button>", { type: "button" });
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
        if (typeof requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION) === "undefined" ||
            requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION) === "true" ||
            requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION) === "success"
        ) {
            //determine default notification handling mechanism
            res.NotificationType = requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION_ON_SUCCESS) || TOASTER_NOTIFICATION_TYPE;
            Service.NotificationHandler(res);
        }

        //execute the success callback with results received.
        requirements.SuccessHandler(res);
        if(requirements.Complete === null){
            requirements.Complete = requirements.ActionBtn.Data(Service.SYSTEM_COMPLETE)
        }
        Service.ExecuteCustom(requirements.Complete, requirements.Component, requirements.ActionBtn, res).then(() => {
            Service.ActionLoading = false;
        });
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

        //redirect to login if access error


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
        if(requirements.Complete === null){
            requirements.Complete = requirements.ActionBtn.data(Service.SYSTEM_COMPLETE);
        }
        Service.ExecuteCustom(requirements.Complete, requirements.Component, requirements.ActionBtn, res).then(() => {
            //add status codes and how they should be treated here
            if (typeof requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION) === "undefined" ||
                requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION) === "true" ||
                requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION) === "error"
            ) {
                res.NotificationType = requirements.ActionBtn.data(Service.SYSTEM_NOTIFICATION_ON_ERROR) || ALERT_NOTIFICATION_TYPE;
                Service.NotificationHandler(res);
            }
            Service.ActionLoading = false;
        });
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
           if(typeof func === "undefined"){
               func = Service.Data[`${action}-data`];
           }
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
                if(typeof listGroup === "undefined"){
                    //lets see if the list is in the data provided
                    listGroup = Service.GetProperty(list,ds)
                }
                if (typeof listGroup !== "undefined" && listGroup !== null && listGroup.length > 0) {
                    Service.SelectListBuilder(elem, listGroup);
                }else{
                    if(elem.data(Service.SYSTEM_DEFAULT)){
                        Service.SelectListBuilder(elem, []);
                    }
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
    setTimeout(async function(){
        await Controller.PanelSelect(document.getElementById(`${MainContainer}`));
        if(link !== null) await Controller.PanelSelect(link[0]);
    },1000);
});

/**
 * -- FormData --
 * this function converts a regular JavaScript
 * object to a FormData one
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
