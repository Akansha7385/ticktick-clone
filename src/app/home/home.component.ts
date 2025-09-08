import { Component } from "@angular/core";
import { Sidemenu } from "../sidemenu/sidemenu";
import { CommonModule } from "@angular/common";
import { BodyComponent } from "../body-component/body.component";

@Component({
    selector:'home-component',
    templateUrl:'./home.component.html',
    standalone:true,
    imports: [Sidemenu, CommonModule, BodyComponent]
})
export class HomeComponent{
    constructor(){};
}
