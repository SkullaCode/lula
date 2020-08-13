
/**
 * -- Error Handler --
 * This function is responsible for handling all requests
 * which return 400 or 500 level status codes
 */
Service.AddProperty("ErrorHandler",function(result){
    let notificationType = "alert";
    //manipulate form if present
    if(Service.LoadedForm !== null){
        Service.LoadedForm.find('input,select,textarea,button')
            .each(function(){
                //find elements that have the class 'clear-error' which
                //indicates they should be cleared and clear them.
                let elem = jQuery(this);
                if(elem.hasClass(Service.SYSTEM_CLEAR_ERROR)){
                    if(elem.prop("type") === "select-one"){
                        elem.prop("selectedIndex",0);
                    }
                    else if(elem.is("input")){
                        elem.val("");
                    }
                    else if(elem.is("textarea")){
                        elem.val("");
                    }
                }
            });
    }
    //set custom notification type if present
    if(typeof result.actionBtn.data(Service.SYSTEM_NOTIFICATION_ON_ERROR) !== "undefined"){
        notificationType = result.actionBtn.data(Service.SYSTEM_NOTIFICATION_ON_ERROR);
    }

    //define and format data from server or use default
    //implementation
    const data = Service.ErrorDataHandler(result,notificationType);
    
    //add status codes and how they should be treated here
    switch(result.request.status){
        case 500: {
            Service.NotificationHandler({
                status: "error",
                message: result.message,
                data,
                actionBtn: result.actionBtn,
                notificationType
            });
            break;
        }
        case 401:{
            location.href = location.origin;
            break;
        }
        case 403:{
            location.href = location.origin;
            break;
        }
        case 404:{
            Service.NotificationHandler({
                status: "error",
                message: "Oops!",
                data,
                actionBtn: result.actionBtn,
                notificationType
            });
            break;
        }
        default:{
            Service.NotificationHandler({
                status:"error",
                message: "Oops!",
                data,
                actionBtn: result.actionBtn,
                notificationType
            });
        }
    }
});

/**
 * -- Success Handler --
 * This function handles successful responses
 * from calls to the server by default.
 *
 * @param result object containing success handler parameters
 */
Service.AddProperty("SuccessHandler",function(result){

    //trigger notification event
    result.notificationType = result.actionBtn.data(Service.SYSTEM_NOTIFICATION_ON_SUCCESS) || "toaster";
    Service.NotificationHandler(result);

    //check if a complete action was specified and execute it
    let custom =result.actionBtn.data(Service.SYSTEM_COMPLETE);
    if(typeof custom !== "undefined"){
        Service.ExecuteCustom(custom,{
            panel:Service.LoadedPanel,
            form:Service.LoadedForm,
            modal:Service.LoadedModal
        },result.actionBtn,result);
    }
});

/**
 * -- Form Submit Success Handler --
 * This function handles successful responses
 * from calls to the server by default.
 *
 * @param result object containing success handler parameters
 */
Service.AddProperty("FormSubmitSuccessHandler",function(result){
    //manipulate form if present
    if(Service.LoadedForm !== null){
        Service.LoadedForm.find('input,select,textarea,button')
            .each(function(){
                //find elements that have the class 'clear-success' which
                //indicates they should be cleared and clear them.
                let elem = jQuery(this);
                if(elem.hasClass(Service.SYSTEM_CLEAR_SUCCESS)){
                    if(elem.prop("type") === "select-one"){
                        elem.prop("selectedIndex",0);
                    }
                    else if(elem.is("input")){
                        elem.val("");
                    }
                    else if(elem.is("textarea")){
                        elem.val("");
                    }
                }
            });
    }

    //trigger notification event
    result.notificationType = result.actionBtn.data(Service.SYSTEM_NOTIFICATION_ON_SUCCESS) || "toaster";
    Service.NotificationHandler(result);

    let custom =result.actionBtn.data(Service.SYSTEM_COMPLETE);
    if(typeof custom !== "undefined"){
        Service.ExecuteCustom(custom,{
            panel:Service.LoadedPanel,
            form:Service.LoadedForm,
            modal:Service.LoadedModal
        },result.actionBtn,result);
    }
});

/**
 * -- Notification Handler --
 * This function handles the default implementation for notifications
 *
 * @param result object containing notification parameters
 */
Service.AddProperty("NotificationHandler",function(result){
    switch(result.notificationType){
        case "alert":{
            if(typeof Service.AlertNotification === "function"){
                Service.AlertNotification(result);
            }
            else{
                alert(result.message)
            }
            break;
        }
        case "toaster":{
            if(typeof Service.ToasterNotification === "function"){
                Service.ToasterNotification(result);
            }
            else{
                alert(result.message);
            }
            break;
        }
        case "none":{
            break;
        }
        default:{
            if(result.status === "success"){
                if(typeof Service.ToasterNotification === "function"){
                    Service.ToasterNotification(result);
                }
                else{
                    alert(result.message);
                }
            }
            else{
                if(typeof Service.AlertNotification === "function"){
                    Service.AlertNotification(result);
                }
                else{
                    alert(result.message)
                }
            }
        }
    }
});

/**
 * -- Server Request --
 * This function handles ajax requests
 *
 * @param requirements object containing request parameters
 */
Service.AddProperty("ServerRequest",function(requirements){
    //ensure there is a request type
    requirements.request = (typeof requirements.request === "undefined" || requirements.request === null || !requirements.request)
        ? 'POST'
        : requirements.request.toUpperCase();

    //ensure there are request headers
    if(typeof requirements.headers === "undefined" || requirements.headers === null || !requirements.headers){
        requirements.headers = [];
    }

    //ensure there are handlers for success and error results
    if(typeof requirements.success === "undefined" || requirements.success === null || !requirements.success){
       requirements.success = Service.SuccessHandler;
    }

    if(typeof requirements.error === "undefined" || requirements.error === null || !requirements.error){
        requirements.error = Service.ErrorHandler;
    }

    // fix: throws an exception if a POST request is sent
    //without a body
    if(requirements.params === null){
        requirements.params = {};
    }

    //ensure request data is FormData
    //todo fix if conditional
/*    if (typeof requirements.params !== FormData) {
        const p = new FormData();
        jQuery.each(requirements.params, function (name,value) {
            p.append(name, value);
        });
        requirements.params = p;
    }*/
    //disable form input and controls while request is
    //processed by the server
    Service.LoadingStateOn(requirements.actionBtn);

    const successFunction = function(data,status,jqXHR){
       //enable disabled form controls
        Service.LoadingStateOff(requirements.actionBtn);
        //check if reload header is set and reload the page
        //if it is
        if(jqXHR.getResponseHeader("X-Reload")){
            location.reload();
            return;
        }
        //check if the redirect header is set and redirect
        //the page if it is
        if(jqXHR.getResponseHeader("X-Redirect")){
            location.href = jqXHR.getResponseHeader("X-Redirect");
            return;
        }
        let res = {};
        //ensure data is in JSON format
        if(typeof data === 'string' && data.length > 0){
            try{
                data = JSON.parse(data);
            }
            catch(e){
                data = {};
            }
        }
        res.status = status;
        res.message = jqXHR.statusText;
        res.data = data;
        res.request = jqXHR;
        res.actionBtn = requirements.actionBtn;
        //execute the success callback with results received.
        requirements.success(res);
        Service.ActionLoading = false;
    };

    let ajax_params = {
        url 		: requirements.site,
        type 		: requirements.request,
        success 	: successFunction,
        error       : function(request, status, error){
            //jQuery sometimes throws a parse error but the response is successful
            if(request.status === 200){
                successFunction("","success",request);
                return;
            }
            //enable disabled elements
           Service.LoadingStateOff(requirements.actionBtn);
            requirements.error({
                request,
                status,
                message: error,
                actionBtn: requirements.actionBtn
            });
            Service.ActionLoading = false;
        },
        //execute specified actions before request is sent
        beforeSend  : function(xhr){
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if(requirements.headers.length > 0){
                jQuery.each(requirements.headers,function(){
                    xhr.setRequestHeader(this.Name,this.Value);
                });
            }
        }
    };
    //list request types that require message body
    //and determine if the current request is in
    //the list.
    let requestTypes = ['POST','PUT','HEAD','DELETE'];
    if(requestTypes.indexOf(requirements.request.toUpperCase()) >= 0){
        ajax_params.data = requirements.params;
    }
    ajax_params.processData = false;
    ajax_params.contentType = false;
    jQuery.ajax(ajax_params);
});

/**
 * -- LaunchModal --
 * This function handles default implementation for
 * launching a modal
 *
 */
Service.AddProperty("LaunchModal",function(){
    Service.LoadedModal.modal();
    const action = Service.LoadedModal.data(Service.SYSTEM_ACTION);
    if(typeof action === "string"){
        let func = Service.Data[action];
        if(typeof func !== "undefined") func(Service.LoadedModal);
    }
    Service.LoadedModal.on('hide.bs.modal',function(e){

    });
    Service.LoadedModal.on('hidden.bs.modal',function(){
        Service.LoadedModal.remove();
        Service.LoadedModal = null;
        jQuery(`.${ModalContainer}`).empty();
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
Service.AddProperty("Bind",function(component, data){
    let elems = component.find(`.${Service.SYSTEM_BIND}`);
    jQuery.each(elems,function(){
        let elem = jQuery(this);

        //if the element is a select list we build it out
        if(elem.prop("tagName") === "SELECT"){
            let list = elem.data(Service.SYSTEM_LIST);
            if(typeof list !== "undefined"){
                let listGroup = Service.ModelData.List[list];
                if(typeof listGroup !== "undefined"){
                    Service.SelectListBuilder(elem,listGroup);
                }
            }
        }
        // if the element is an image bind the value to image source
        if(elem.prop("tagName") === "IMG"){
            if(typeof elem.data(Service.SYSTEM_PROPERTY) !== "undefined"){
                elem.prop("src",Service.GetProperty(elem.data(Service.SYSTEM_PROPERTY),data));
            }
            else if(typeof elem.prop("id") !== "undefined"){
                elem.prop("src",Service.GetProperty(elem.prop("id"),data));
            }
        }
        else {
            if(typeof elem.data(Service.SYSTEM_PROPERTY) !== "undefined"){
                let property = Service.GetProperty(elem.data(Service.SYSTEM_PROPERTY),data);
                //determine if a transformation method is present on the element
                if(typeof elem.data(Service.SYSTEM_CUSTOM) !== "undefined"){
                    property = Service.Transform(elem.data(Service.SYSTEM_CUSTOM),property);
                }
                //bind property to element as valid HTML
                if(elem.hasClass(Service.SYSTEM_BIND_VALUE)){
                    if(elem.is('input,select,textarea')){
                        elem.val(property);
                    }
                    elem.attr('data-value',property);
                    elem.data("value",property);
                    if(elem.prop("tagName") === "SELECT"){
                        let options = elem.find("option");
                        elem.prop("selectedIndex",0);
                        options.each(function(i){
                            if(this.value == property){
                                elem.prop("selectedIndex",i);
                            }
                        });
                    }
                }
                else{
                    elem.html(property);
                }
            }
            else if(typeof elem.data(Service.SYSTEM_LOOP) !== "undefined"){
                let property = Service.GetProperty(elem.data(Service.SYSTEM_LOOP),data);

                //get the looped element
                let child = elem.children();
                elem.empty();
                if(typeof property === "object" && property !== null && property.length > 0){
                    property.forEach(function(item){
                        //make copy of the looped element....
                        //we do not use the original
                        let childClone = child.clone();
                        //find all the elements that should be bound
                        let childElems = childClone.find(`.${Service.SYSTEM_BIND_LOOP}`);
                        $.each(childElems,function() {
                            let childElem = jQuery(this);
                            if(typeof childElem.data(Service.SYSTEM_PROPERTY) !== "undefined"){
                                let property = Service.GetProperty(childElem.data(Service.SYSTEM_PROPERTY),item);
                                if(typeof childElem.data(Service.SYSTEM_CUSTOM) !== "undefined"){
                                    property = Service.Transform(childElem.data(Service.SYSTEM_CUSTOM),property);
                                }
                                //bind property to element as valid HTML
                                if(childElem.hasClass(Service.SYSTEM_BIND_VALUE)){
                                    if(childElem.is('input,select,textarea')){
                                        childElem.val(property);
                                    }
                                    childElem.attr('data-value',property);
                                    childElem.data("value",property);
                                    if(childElem.prop("tagName") === "SELECT"){
                                        let options = childElem.find("option");
                                        childElem.prop("selectedIndex",0);
                                        options.each(function(i){
                                            if(this.value == property){
                                                childElem.prop("selectedIndex",i);
                                            }
                                        });
                                    }
                                }
                                else{
                                    childElem.html(property);
                                }
                            }
                            else{
                                let property = Service.GetProperty(childElem.prop("id"),item);
                                if(typeof childElem.data(Service.SYSTEM_CUSTOM) !== "undefined"){
                                    property = Service.Transform(childElem.data(Service.SYSTEM_CUSTOM),property);
                                }
                                //bind property to element as valid HTML
                                if(childElem.hasClass(Service.SYSTEM_BIND_VALUE)){
                                    if(childElem.is('input,select,textarea')){
                                        childElem.val(property);
                                    }
                                    childElem.attr('data-value',property);
                                    childElem.data("value",property);
                                    if(childElem.prop("tagName") === "SELECT"){
                                        let options = childElem.find("option");
                                        childElem.prop("selectedIndex",0);
                                        options.each(function(i){
                                            if(this.value == property){
                                                childElem.prop("selectedIndex",i);
                                            }
                                        });
                                    }
                                }
                                else{
                                    childElem.html(property);
                                }
                            }
                        });
                        // add the element with the bindings to the parent
                        elem.append(childClone);
                    });
                }

                if(typeof elem.data(Service.SYSTEM_CUSTOM) !== "undefined"){
                    elem = Service.Transform(elem.data(Service.SYSTEM_CUSTOM),elem);
                }
            }
            else{
                let property = Service.GetProperty(elem.prop("id"),data);
                if(typeof elem.data(Service.SYSTEM_CUSTOM) !== "undefined"){
                    property = Service.Transform(elem.data(Service.SYSTEM_CUSTOM),property);
                }
                //bind property to element as valid HTML
                if(elem.hasClass(Service.SYSTEM_BIND_VALUE)){
                    if(elem.is('input,select,textarea')){
                        elem.val(property);
                    }
                    elem.attr('data-value',property);
                    elem.data("value",property);
                    if(elem.prop("tagName") === "SELECT"){
                        let options = elem.find("option");
                        elem.prop("selectedIndex",0);
                        options.each(function(i){
                            if(this.value == property){
                                elem.prop("selectedIndex",i);
                            }
                        });
                    }
                }
                else{
                    elem.html(property);
                }
            }
        }
    });

    //bind meta data
    let elems_meta = component.find(`.${Service.SYSTEM_BIND_META}`);
    jQuery.each(elems_meta,function(){
        let elem = jQuery(this);
        if(elem.prop("tagName") === "IMG"){
            if(typeof elem.prop("id") !== "undefined"){
                elem.prop("src",Service.GetProperty(elem.prop("id"),Service.MetaData));
            }
        }
        else {
            if(typeof elem.prop("id") !== "undefined"){
                let property = Service.GetProperty(elem.prop("id"),Service.MetaData);
                if(typeof elem.data(Service.SYSTEM_ACTION) !== "undefined"){
                    let func = Service.Transformation[elem.data(Service.SYSTEM_CUSTOM)];
                    if(typeof func !== "undefined"){
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
Service.AddProperty("BindForm",function(form, ds){
    if(ds === null) return;
    if(typeof form === "undefined") return;
    let els = jQuery(form).find('input,select,textarea');
    if(els.length <= 0) return;

    for(let x=0; x<els.length; x++){
        let el = null;
        let elem = jQuery(els[x]);
        el = Service.GetProperty(elem.prop("id"),ds);

        if(elem[0].type === 'select-one'){
            let list = elem.data(Service.SYSTEM_LIST);
            if(typeof list !== "undefined"){
                let listGroup = Service.ModelData.List[list];
                if(typeof listGroup !== "undefined"){
                    Service.SelectListBuilder(elem,listGroup);
                }
            }
        }

        if(
            el === null ||
            typeof el === "undefined" ||
            typeof el === "object"
        )
            continue;

        switch(elem[0].type){
            case 'checkbox':
                elem.prop('checked', (el == elem.val()));
                break;
            case 'radio':
                elem.prop('checked', (el == elem.val()));
                break;
            case 'hidden':
                elem.data("value",el);
                elem.val(el);
                break;
            case 'color':
                elem.data("value",el);
                elem.val(el);
                break;
            case 'date':
                let dob = new Date(el);
                let day = ("0" + dob.getDate()).slice(-2);
                let month = ("0" + (dob.getMonth() + 1)).slice(-2);
                dob = dob.getFullYear() + "-" + (month) + "-" + (day);
                elem.data("value",dob);
                elem.val(dob);
                break;
            case 'datetime':
            case 'datetime-local':
            case 'email':
                elem.data("value",el);
                elem.val(el);
                break;
            case 'number':
                elem.data("value",el);
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
                elem.data("value",el);
                elem.val(el);
                break;
            case 'textarea':
                elem.data("value",el);
                elem.val(el);
                break;
            case 'password':
                elem.data("value",el);
                elem.val(el);
                break;
            case 'select-one':
                elem.data("value",el);
                let options = elem.find("option");
                elem.prop("selectedIndex",0);
                options.each(function(i){
                    if(this.value == el){
                        elem.prop("selectedIndex",i);
                    }
                });
                break;
            case 'select-multiple':
                break;
        }
    }
    for(let x=0; (els && x < els.length); x++) {
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
Service.AddProperty("GetProperty",function(id,data){
    if(id === null) return data;
    if(typeof id === 'undefined') return data;
    id = id.split(".");
    let property = data;
    if(typeof property === "undefined") return null;
    for(let i=0; i<id.length; i++){
        if(id[i].length <= 0)
            break;
        property = property[id[i]];
        if(property === null){
            break;
        }
        if(typeof property === 'undefined')
            break;
        if(typeof property === 'object')
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
Service.AddProperty("ListUpdate",function(elem,target,actionBtn){
    if(elem.value.length > 0){
        const site = `/${elem.dataset[Service.SYSTEM_URL]}/${elem.value}`;
        const method = "GET";
        const params = {};
        const success = function(result){Service.SelectListBuilder(jQuery(target),result.data,result.actionBtn);};
       Service.ServerRequest({
           site,method,params,success
       });
    }
});

/**
 * -- Trigger Events --
 * this function triggers onclick and onchange events if
 * present on the element passed to it
 *
 * @param elem element on which to trigger events
 */
Service.AddProperty("TriggerEvents",function(elem){
    let click = elem.prop("onclick");
    let change = elem.prop("onchange");
    let blur = elem.prop("onblur");
    if( click   !== null ) elem.click();
    if( change  !== null ) elem.change();
    if( blur    !== null ) elem.blur();
});

/**
 * -- Image Preview --
 * this function allows an image preview when a file
 * is selected
 *
 * @param input the file input element
 * @param target the img element to show the preview
 */
Service.AddProperty("ImagePreview",function(input, target) {
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
Service.AddProperty("LoadPanel",function(elem,target=null){
    if(typeof elem !== "undefined" && typeof elem === "object"){
        let action = elem.data(Service.SYSTEM_ACTION);
        if(Service.Data.hasOwnProperty(action)) Service.Data[action](elem);

        // we have to place panel on the DOM before we load it.....
        // idk if its a javascript thing or jQuery thing
        Service.ContainerPanel = jQuery("#container-panel");
        Service.ContainerPanel.empty().append(elem);
        let elem_id = (target === null) ? jQuery(`#${MainContainer}`) : jQuery(`#${target}`);
        Service.LoadPanelTransition(elem_id,elem);
        Service.ContainerPanel.empty();
        Service.ContainerPanel = null;
        Service.LoadedPanel = elem;
        return true;
    }
    return false;
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
Service.AddProperty("SelectListBuilder",function(elem,list, actionBtn, emptyList = true){
    if(emptyList) elem.empty();
    jQuery.each(list, function () {
        elem.append(`<option data-value="${this.Value}" value="${this.Value}"> ${this.Text} </option>`);
    });
});

/**
 * -- Find Element --
 * this function retrieves templates from the
 * template tag and ensures they are recognized by the DOM
 *
 * @param name name of the element to retrieve
 */
Service.AddProperty("FindElement",function(name){
    let templateContent = jQuery('template').prop('content');
    templateContent = jQuery(templateContent);
    //add hash tag if not present. element lookup is always by id
    if(name.substring(0,1) !== "#") name = `#${name}`;
    let item = templateContent.find(name);
    if(item.length > 0){
        /**
         * todo cloning the first item in the list... need to ensure
         * that highest order divs are selected
         **/
        let clone = jQuery(item[0]).clone();
        const action = clone.data(Service.SYSTEM_ACTION);
        let element = jQuery(clone.html());
        //ensure we have one root element
        if(element.length !== 1){
            element = jQuery("<div></div>").append(clone.html())
        }
        //add system actions as data properties
        if(typeof action !== "undefined")element.data(Service.SYSTEM_ACTION,action);
        return element;
    }
    return jQuery("<div></div>");
});

/**
 * -- Execute Custom --
 * this function automates the execution of modifications to
 * panels or modals that have been loaded
 *
 * @param action names of the custom actions to execute
 * @param component panel or modal on which to apply custom actions
 */
Service.AddProperty("ExecuteCustom",function(action,component,actionBtn,result=null){
    action = action.split("|");
    action.forEach(function(item){
        if(Service.Modification.hasOwnProperty(item)){
            Service.Modification[item](component,actionBtn,result);
        }
        else if(Controller.hasOwnProperty(item)){
            Controller[item](component,actionBtn,result);
        }
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
Service.AddProperty("Transform",function(action,component,actionBtn){
    action = action.split("|");
    action.forEach(function(item){
        if(Service.Transformation.hasOwnProperty(item)){
            component = Service.Transformation[item](component,actionBtn);
        }
        else if(Controller.hasOwnProperty(item)){
            component = Controller[item](component,actionBtn);
        }
    });
    return component;
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
Service.AddProperty("ExecuteSubmitTransformation",function(action,component,params,actionBtn){
    action = action.split("|");
    action.forEach(function(item){
        if(Service.SubmitTransformation.hasOwnProperty(item)){
            params = Service.SubmitTransformation[item](component,params,actionBtn);
        }
        else if(Controller.hasOwnProperty(item)){
            component = Controller[item](component,params,actionBtn);
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
Service.AddProperty("LoadingStateOn",function(ActionButton){
    //disable form fields so that they cannot be edited
    //while submission is taking place
    if(Service.LoadedForm !== null){
        Service.LoadedForm.find('input,select,textarea').prop("disabled",true);
    }
    //disable the button that triggered the action so that request cannot
    //be duplicated.
    ActionButton.prop("disabled",true);
});

/**
 * -- Loading State Off --
 * this function defines what should happen when
 * a request is executed by the server and a response
 * received
 */
Service.AddProperty("LoadingStateOff",function(ActionButton){
    //enable disabled elements
    if(Service.LoadedForm !== null){
        Service.LoadedForm.find('input,select,textarea').prop("disabled",false);
    }
    ActionButton.prop("disabled",false);
});

/**
 * -- Load Panel Transition
 * this function defines the process of placing the panel
 * within the specified container
 */
Service.AddProperty("LoadPanelTransition",function(container,panel,actionBtn = null){
    container.css("display","none");
    container.empty();
    container.html(panel).fadeIn("slow");
});

Service.AddProperty("ErrorDataHandler", function(result,notificationType){
    let data = {
        Code: result.request.statusText,
        Entity: "Application",
        notificationType: notificationType
    };
    if(result.request.responseText.length > 0){
        try{
            data = JSON.parse(result.request.responseText);
        }
        catch(e){
            data.Code = "An error occurred on the server";
            data.Entity = "Application";
        }
    }
    return data;
});
