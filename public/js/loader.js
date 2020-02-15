const urls = [
    "public/js/app/services/varObjects.js",
    "public/js/app/services/functions.js",
    "public/js/app/services/custom/action.js",
    "public/js/app/services/custom/custom.js",
    "public/js/app/services/custom/data.js",
    "public/js/app/services/custom/modification.js",
    "public/js/app/services/custom/submitTransformation.js",
    "public/js/app/services/custom/transformation.js",
    "public/js/app/services/app.js"
];
for(const i in urls){
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = urls[i];
    document.getElementsByTagName("head")[0].appendChild(script);
}
