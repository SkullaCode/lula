
/**
 * -- Error Handler --
 * This function is responsible for handling all requests
 * which return 400 or 500 level status codes
 *
 * @param j
 * @param d
 * @param e
 * @constructor
 */
Service.AddProperty("ErrorHandler",function(j,d,e){
    if(Service.LoadedForm !== null){
        Service.LoadedForm.find('input,select,textarea,button')
            .prop("disabled",false) // enable disabled for properties
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

    let message = {
        Code: j.statusText,
        Entity: "Application"
    };
    if(j.responseText.length > 0)
        try{
            message = JSON.parse(j.responseText);
        }
    catch(e){

    }


    //add status codes and how they should be treated here
    switch(j.status){
        case 500: {
            Service.NotificationHandler(message,"INTERNAL_SERVER_ERROR");
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
            Service.NotificationHandler(message,"NOT_FOUND");
            break;
        }
    }
    if(Service.SubmitButton !== null){
        Service.SubmitButton.prop("disabled",false);
        Service.SubmitButton = null;
    }
});

/**
 * -- Notification Handler --
 * This function handles default implementation for notification
 * system.
 * @param obj
 * @param status
 */
Service.AddProperty("NotificationHandler",function(obj,status){

});

/**
 * -- Server Request --
 * This function handles all regular ajax requests
 *
 * @param site the URL that the request is to target
 * @param params parameters that should be sent with the request
 * @param request type of the request either "POST" or "GET" etc
 * @param success function that should be executed on success
 * @param error function that should be executed on error
 * @param hasFile boolean that determines if a file is in the form or not
 */
//todo work out how to incorporate submitting files
Service.AddProperty("ServerRequest",function(site,params,request,success,error,hasFile=false){
    request = (request === undefined || request === null || !request)
        ? 'POST'
        : request.toUpperCase();

    // fix: throws an exception if a POST request is sent
    //without a body
    if(params === null){
        params = {};
    }
    //disable form fields so that they cannot be edited
    //while submission is taking place
    if(Service.LoadedForm !== null){
        Service.LoadedForm.find('input,select,textarea').prop("disabled",true);
    }
    //disable the button that triggered the action so that request cannot
    //be duplicated.
    if(Service.SubmitButton !== null){
        Service.SubmitButton.prop("disabled",true);
    }

    let ajax_params = {
        url 		: site,
        type 		: request,
        success 	: function(data,status,jqXHR){
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

                }
            }
            res.success = status;
            res.message = jqXHR.statusText;
            res.data = data;
            //execute the success callback with results received.
            (typeof success === 'string') ? window[success](res) : success(res)
        },
        error       : error,
        beforeSend  : function(xhr){
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
    };
    //list request types that require message body
    //and determine if the current request is in
    //the list.
    let requestTypes = ['POST','PUT','HEAD'];
    if(requestTypes.indexOf(request.toUpperCase()) >= 0){
        ajax_params.data = params;
    }
    jQuery.ajax(ajax_params);
});

/**
 * -- LaunchModal --
 * This function handles default implementation for
 * launching a modal
 *
 * @constructor
 */
Service.AddProperty("LaunchModal",function(){
    Service.LoadedModal.modal();
    const action = Service.LoadedModal.data("action");
    if(typeof action === "string"){
        let func = Service.Data[action];
        if(typeof func !== "undefined") func(Service.LoadedModal);
        else Service.Data[DefaultModalListing](Service.LoadedModal);
    }
    Service.LoadedModal.on('hide.bs.modal',function(e){
        if(Service.SubmitButton !== null){
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }
    });
    Service.LoadedModal.on('hidden.bs.modal',function(){
        //todo determine if a request
        // is in progress and only remove after
        // it is complete

        Service.LoadedModal.remove();
        Service.LoadedModal = null;
        Service.SubmitButton = null;
        Service.Data.Store = {};
        jQuery(`.${ModalContainer}`).empty();
    });
});

/**
 * -- BindByID --
 * this function is responsible for binding the data
 * in 'Service.ModelData' to the elements of the desired
 * component. only components with the class 'bind'
 * or 'bind-loop' are handled by this function
 *
 * @param component element that will have its elements bound
 * @param data data set from which values will be used in binding
 */
Service.AddProperty("Bind",function(component, data){
    let elems = component.find(".bind");
    jQuery.each(elems,function(){
        let elem = jQuery(this);

        if(elem.prop("tagName") === "SELECT"){
            let list = elem.data("list");
            if(typeof list !== "undefined"){
                let listGroup = Service.ModelData.List[list];
                if(typeof listGroup !== "undefined"){
                    elem.empty();
                    elem.append("<option value=\"\"> --Select-- </option>");
                    jQuery.each(listGroup, function () {
                        elem.append("<option value=\""+this.Value+"\">"+this.Text+"</option>");
                    });
                }
            }
        }
        // if the element is an image bind the value to image source
        if(elem.prop("tagName") === "IMG"){
            if(typeof elem.data("property") !== "undefined"){
                elem.prop("src",Service.GetProperty(elem.data("property"),data));
            }
            else if(typeof elem.prop("id") !== "undefined"){
                elem.prop("src",Service.GetProperty(elem.prop("id"),data));
            }
        }
        else {
            if(typeof elem.data("property") !== "undefined"){
                let property = Service.GetProperty(elem.data("property"),data);
                //determine if a transformation method is present on the element
                if(typeof elem.data("action") !== "undefined"){
                    property = Service.Transform(elem.data("action"),property);
                }
                //bind property to element as valid HTML
                if(elem.hasClass('bind-value')){
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
            else if(typeof elem.data("loop") !== "undefined"){
                let property = Service.GetProperty(elem.data("loop"),data);

                //get the looped element
                let child = elem.children();
                elem.empty();
                if(typeof property === "object" && property !== null && property.length > 0){
                    property.forEach(function(item){
                        //make copy of the looped element....
                        //we do not use the original
                        let childClone = child.clone();
                        //find all the elements that should be bound
                        let childElems = childClone.find(".bind-loop");
                        $.each(childElems,function() {
                            let childElem = $(this);
                            if(typeof childElem.data("property") !== "undefined"){
                                let property = Service.GetProperty(childElem.data("property"),item);
                                if(typeof childElem.data("action") !== "undefined"){
                                    property = Service.Transform(childElem.data("action"),property);
                                }
                                //bind property to element as valid HTML
                                if(childElem.hasClass('bind-value')){
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
                                if(typeof childElem.data("action") !== "undefined"){
                                    property = Service.Transform(childElem.data("action"),property);
                                }
                                //bind property to element as valid HTML
                                if(childElem.hasClass('bind-value')){
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

                if(typeof elem.data("action") !== "undefined"){
                    elem = Service.Transform(elem.data("action"),elem);
                }
            }
            else{
                let property = Service.GetProperty(elem.prop("id"),data);
                if(typeof elem.data("action") !== "undefined"){
                    property = Service.Transform(elem.data("action"),property);
                }
                //bind property to element as valid HTML
                if(elem.hasClass('bind-value')){
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
    let elems_meta = component.find(".bind-meta");
    $.each(elems_meta,function(){
        let elem = $(this);
        if(elem.prop("tagName") === "IMG"){
            if(typeof elem.prop("id") !== "undefined"){
                elem.prop("src",Service.GetProperty(elem.prop("id"),Service.MetaData));
            }
        }
        else {
            if(typeof elem.prop("id") !== "undefined"){
                let property = Service.GetProperty(elem.prop("id"),Service.MetaData);
                if(typeof elem.data("action") !== "undefined"){
                    let func = Service.Transformation[elem.data("action")];
                    if(typeof func !== "undefined"){
                        property = func(property);
                    }
                }
                elem.html(property);
            }
        }
    });
});

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

Service.AddProperty("ListUpdate",function(elem,target){
    if(elem.value.length > 0){
        Service.ServerRequest(`/${elem.dataset["url"]}/${elem.value}`,{},"GET",function(result){
            target = jQuery(target);
            target.empty();
            target.append(`<option value="">--Select--</option>`);
            jQuery.each(result.data, function () {
                let selected = (parseInt(target.data().value) === parseInt(this.Value)) ? "selected" : "";
                target.append(`<option value="${this.Value}" ${selected}> ${this.Text}</option>`);
            });
        },Service.ErrorHandler);
    }
});

Service.AddProperty("TriggerEvents",function(elem){
    let click = elem.prop("onclick");
    let change = elem.prop("onchange");
    if(click !== null)
        elem.click();

    if(change !== null)
        elem.change();
});

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

Service.AddProperty("FormSubmitSuccessHandler",function(data){
    Service.LoadedForm.find('input,select,textarea,button')
        .prop("disabled",false) //enable disabled form elements
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
    Service.SubmitButton.prop("disabled",false);
    let closeOnComplete = Service.SubmitButton.hasClass(Service.SYSTEM_CLOSE_ON_COMPLETE);
    Service.LoadedForm = null;
    if(data.success === false){
        Service.NotificationHandler(data.message);
    }
    else {
        Service.FormSubmitDataHandler(data.data);
    }
    Service.SubmitButton = null;
    if(closeOnComplete)
        if (Service.LoadedModal !== null) Service.LoadedModal.modal('hide');
});

Service.AddProperty("FormSubmitDataHandler",function(data){

});

Service.AddProperty("LoadPanel",function(elem,target=null){
    if(typeof elem !== "undefined"){
        let action = elem.data(Service.SYSTEM_ACTION);
        let func = Service.Data[action];
        if(typeof func !== "undefined") func(elem);
        else Service.Data[Service.SYSTEM_DEFAULT_PANEL_DATA](elem);

        // we have to place panel on the DOM before we load it.....
        // idk if its a javascript thing or jQuery thing
        Service.ContainerPanel = jQuery("#container-panel");
        Service.ContainerPanel.empty().append(elem);
        let elem_id = (target == null) ? jQuery("#MainContainer") : jQuery(`#${target}`);
        elem_id.css("display","none");
        elem_id.empty();
        elem_id.html(elem).fadeIn("slow");
        Service.LoadedPanel = elem;
        Service.ContainerPanel.empty();
        Service.ContainerPanel = null;
        Service.SubmitButton = null;
        Service.ActionButton = null;
    }
});

Service.AddProperty("LoadLayout",function(layout,panel){
    let action = layout.data(Service.SYSTEM_ACTION);
    let func = Service.Data[action];
    if(typeof func !== "undefined")
        func(layout);

    jQuery('#webapp-layout').empty().append(layout);
    Service.LoadPanel(panel);
});

Service.AddProperty("SelectListBuilder",function(elem,list,holder = "-- Select --"){
    elem.empty();
    if(typeof holder === "string"){
        elem.append(`<option value=""> ${holder} </option>`);
    }
    if(typeof holder === "function"){
        elem.append(`<option value=""> ${holder()} </option>`);
    }
    jQuery.each(list, function () {
        elem.append(`<option data-value="${this.Value}" value="${this.Value}+"> ${this.Text} </option>`);
    });
});

Service.AddProperty("FindElement",function(name){
    let templateContent = jQuery('template').prop('content');
    templateContent = jQuery(templateContent);
    let item = templateContent.find(name);
    if(item.length > 0){
        let clone = item.clone();
        const action = clone.data(Service.SYSTEM_ACTION);
        const custom = clone.data(Service.SYSTEM_CUSTOM);
        let element = jQuery(clone.html());
        if(element.length !== 1){
            element = jQuery("<div></div>").append(clone.html())
        }
        if(typeof action !== "undefined")element.data(Service.SYSTEM_ACTION,action);
        if(typeof custom !== "undefined")element.data(Service.SYSTEM_CUSTOM,custom);
        return element;
    }
    return jQuery();
});

Service.AddProperty("Transform",function(action,component){
    action = action.split("|");
    action.forEach(function(item){
        let func = Service.Transformation[item];
        if(typeof func !== "undefined"){
            component = func(component);
        }
    });
    return component;
});

Service.AddProperty("ExecuteCustom",function(action,component){
    action = action.split("|");
    action.forEach(function(item){
        let func = Service.Modification[item];
        if(typeof func !== "undefined"){
            component = func(component);
        }
    });
    return component;
});

Service.AddProperty("ExecuteSubmitTransformation",function(action,component,params){
    action = action.split("|");
    action.forEach(function(item){
        let func = Service.SubmitTransformation[item];
        if(typeof func !== "undefined"){
            params = func(component,params);
        }
    });
    return params;
});
