import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SplashScreen } from "@capacitor/splash-screen";
import { CapacitorMlkitDocumentScanner } from "capacitor-mlkit-document-scanner";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  scannerForm: FormGroup;

  // Hier halten wir das Ergebnis nach erfolgreichem Scan:
  scanResult: any = null;
  constructor(private fb: FormBuilder) {
    this.initializeApp();
    this.scannerForm = this.fb.group({
      pageLimit: [0, [Validators.min(0)]],
      galleryImportAllowed: [true],
      scannerMode: ["SCANNER_MODE_FULL"],
      resultFormat: ["PDF"],
      lowerQuality: [0, [Validators.min(0), Validators.max(100)]],
    });
  }

  initializeApp() {
    /* To make sure we provide the fastest app loading experience
       for our users, hide the splash screen automatically
       when the app is ready to be used:

        https://capacitor.ionicframework.com/docs/apis/splash-screen#hiding-the-splash-screen
    */
    SplashScreen.hide();
  }

  async onStartScan() {
    if (!this.scannerForm.valid) {
      console.log("Formular ist ungültig. Bitte Eingaben prüfen.");
      return;
    }

    const options = {
      pageLimit: this.scannerForm.value.pageLimit,
      galleryImportAllowed: this.scannerForm.value.galleryImportAllowed,
      scannerMode: this.scannerForm.value.scannerMode,
      resultFormat: this.scannerForm.value.resultFormat,
      lowerQuality: this.scannerForm.value.lowerQuality,
    };

    try {
      // Plugin-Funktion aufrufen:
      // startScan(options) gibt ein Promise<ScanResult> zurück
      const result = await CapacitorMlkitDocumentScanner.startScan(options);
      this.scanResult = result;
      console.log("Scan erfolgreich:", result);
    } catch (error) {
      console.error("Fehler beim Scannen:", error);
    }
  }
}
