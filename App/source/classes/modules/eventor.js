// declare dependency to angular (similar to import in java)
define(['frameworks/angular'], function (Angular) {

    // Create new empty app/module named 'eventor'
    var Eventor = Angular.module('eventor', []);

    // export module to use it in other classes
    return Eventor;
});