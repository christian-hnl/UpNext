import {Component, input, signal} from "@angular/core";
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
  sessionLink = signal("sigfriedschweigl")


  generateQR(qrdata: string){
    this.sessionLink.set(qrdata);
  }

}
