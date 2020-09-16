/**
 * -- Custom --
 * Add methods that will be used by inline 'onclick' or 'onchange'
 * actions. If default implementations need to be overwritten, do that here
 * as well. A jQuery 'ready' function is defined where global bootstrapping
 * of the page can be placed.
 */

//overriding the title for application
//Service.Title = "Default Application";


//defining a default alert notification handler
Service.AlertNotification = function(notification){
    swal(notification.Title,notification.Message,notification.Status);
};
//defining a default toaster notification handler
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
Service.Bootstrap = function(){
    Service.ModelData.List = {};

    if(sessionStorage.getItem('GenderList') !== null){
        Service.ModelData.List['Gender'] = JSON.parse(sessionStorage.getItem('GenderList'));
    }
    else{
        const data = [
            { Value: 1, Text: "Male"},
            { Value: 2, Text: "Female"}
        ];
        Service.ModelData.List['Gender'] = data;
        sessionStorage.setItem('GenderList',JSON.stringify(data));
    }
    setTimeout(async function(){
        const link = jQuery("<a>");
        link.attr("data-action","form");
        link.attr("data-target","SmallTarget");
        await Controller.PanelSelect(document.getElementById(`${MainContainer}`));
        await Controller.PanelSelect(link[0]);
    },1000);
};

jQuery(function(){
    Service.Bootstrap();
});
