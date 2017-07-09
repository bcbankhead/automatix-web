"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var template = (function () {
    //Public Properties exposes these things for 1 and 2 way binding
    function template() {
    }
    template.prototype.ngOnInit = function () {
        //do something
    };
    ;
    return template;
}());
template = __decorate([
    core_1.Component({
        selector: 'my-heroes',
        templateUrl: './heroes.component.html',
        styleUrls: ['./heroes.component.css']
    })
], template);
exports.template = template;
//# sourceMappingURL=template.component.js.map