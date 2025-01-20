import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { SplashScreen } from "@capacitor/splash-screen";
import { CapacitorMlkitDocumentScanner } from "capacitor-mlkit-document-scanner";
import { Capacitor } from "@capacitor/core";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  scannerForm: FormGroup;
  scanResult: any = null;
  scannedImage: SafeUrl | null = null; // Typ: SafeUrl für sichere Anzeige

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    console.log("AppComponent wird initialisiert...");
    this.initializeApp();
    this.scannerForm = this.fb.group({
      pageLimit: [0, [Validators.min(0)]],
      galleryImportAllowed: [true],
      scannerMode: ["SCANNER_MODE_FULL"],
      resultFormat: ["PDF"],
      lowerQuality: [0, [Validators.min(0), Validators.max(100)]],
    });
    console.log("Formular wurde erstellt:", this.scannerForm.value);
  }

  initializeApp() {
    console.log("SplashScreen wird ausgeblendet...");
    SplashScreen.hide();
  }

  async onStartScan() {
    console.log("Scan gestartet...");
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
      docId: "testDocId"
    };

    console.log("Scanner-Optionen:", JSON.stringify(options));

    try {
      const result = await CapacitorMlkitDocumentScanner.startScan(options);
      this.scanResult = result;
      console.log("Scan erfolgreich:", JSON.stringify(result));

      // Prüfen, ob pages ein String ist:
      let pages = result.pages;
      if (typeof pages === "string") {
        pages = JSON.parse(pages);
      }

      // Jetzt ist `pages` wirklich ein Array
      console.log("Bild-URI:", JSON.stringify(pages[0]));

      const fileUri = `file://${pages[0].imageUri}`;
      console.log("File-URI erstellt:", fileUri);

      //this.scannedImage = this.sanitizer.bypassSecurityTrustUrl(Capacitor.convertFileSrc(fileUri));
      this.scannedImage = Capacitor.convertFileSrc(fileUri);
      console.log("Sichere URL erstellt und Bild gespeichert.");

    } catch (error) {
      console.error("Fehler beim Scannen:", error);
    }

  }
}
