import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogService } from "@nebular/theme";
import { ErrorReqComponent } from "src/app/components/error-req/error-req.component";
import { SucessReqComponent } from "src/app/components/sucess-req/sucess-req.component";
import { CnpjService } from "src/app/service/cnpj-service.service";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-integradora-pix",
  templateUrl: "./integradora-pix.component.html",
  styleUrls: ["./integradora-pix.component.scss"],
})
export class IntegradoraPixComponent {
  integradoraPixForm: FormGroup;
  invalidFields: string[] = [];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private cnpjService: CnpjService,
    private dialogService: NbDialogService
  ) {
    this.integradoraPixForm = this.fb.group({
      razao_social: ["", [Validators.required]],
      contato: ["", Validators.required],
      fone_contato: [""],
    });
  }

  ngOnInit(): void {
    // Listen for changes to update invalid fields list
    this.integradoraPixForm.statusChanges.subscribe(() => {
      this.checkInvalidFields();
    });
  }

  // Function to check invalid fields in the form
  checkInvalidFields(): void {
    this.invalidFields = [];
    Object.keys(this.integradoraPixForm.controls).forEach((key) => {
      const control = this.integradoraPixForm.get(key);
      if (control && control.invalid && control.touched) {
        this.invalidFields.push(key);
      }
    });
  }

  // Function to handle form submission
  onSubmit(): void {
    if (this.integradoraPixForm.valid) {
      try {
        const formData = this.integradoraPixForm.value;
        this.supabaseService
          .inserirIntegraPix(formData)
          .subscribe((it) => console.log(it));
        console.log("Form Submitted", formData);
        this.open(true);
      } catch (error) {
        this.openError(true);
      }
    } else {
      this.checkInvalidFields();
    }
  }

  open(hasBackdrop: boolean) {
    this.dialogService.open(SucessReqComponent, { hasBackdrop });
  }

  openError(hasBackdrop: boolean) {
    this.dialogService.open(ErrorReqComponent, { hasBackdrop });
  }
}
