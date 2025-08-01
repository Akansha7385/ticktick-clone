import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'button-app',
    templateUrl: './button.html',
    imports: [ButtonModule]
})
export class Button {}