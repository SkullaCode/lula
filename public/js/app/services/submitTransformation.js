/**
 * -- SubmitTransformation --
 * Add a method to the submit transformation executor if you want to transform the value of a form
 * element before it is submitted to the server for processing. use the 'data-action' attribute on
 * the element triggering the submission to add the method(s) that should be executed. if there needs
 * to be more than one method called, use the pipe (|) character to separate them.
*/

Service.SubmitTransformation.TransformFormStage1 = function(component,params){
    alert("form is being transformed..... stage 1");
    return params;
};

Service.SubmitTransformation.AddMethod("transform-form-stage-2",function(component,params){
    alert("form is being transformed..... stage 2");
    return params;
});
