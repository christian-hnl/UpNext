import {Component, input} from "@angular/core";
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
  sessionLink = input<string>("No data")

}
