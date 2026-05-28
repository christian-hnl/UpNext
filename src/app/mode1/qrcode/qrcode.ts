import {Component, Input, input, signal} from "@angular/core";
import {QRCodeComponent} from "angularx-qrcode";

@Component({
  selector: "app-qrcode",
    imports: [
        QRCodeComponent
    ],
  templateUrl: "./qrcode.html",
  styleUrl: "./qrcode.scss",
})
export class Qrcode {

  @Input() sessionLink: string = '';

}
