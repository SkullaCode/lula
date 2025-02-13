//overriding the title for application
Service.Title = "Default Testing Application";


//defining a default alert notification handler
/**
 *
 * @param {Result} notification
 */
Service.AlertNotification = function(notification){
    swal(notification.Status.toUpperCase(),notification.Message,notification.Status);
};
//defining a default toaster notification handler
/**
 *
 * @param {Result} notification
 */
Service.ToasterNotification = function(notification){
    const title = (notification.Status === "success")
        ? "Success!" : "Error!";
    VanillaToasts.create({
        title: title,
        text: notification.Message,
        type: notification.Status,
        timeout: 5000
    });
    jQuery("#vanillatoasts-container").css("z-index",2050);
};

Service.Modification.SelectedLink = function(component,actionBtn){
    $(document).find(".nav-link").removeClass("active");
    actionBtn.parents(".nav-link").addClass("active");
};
Service.Modification.SetDefaultLink = function(component, actionBtn){
    $(document).find(".default-link").addClass("active");
};
