import { Component } from "@angular/core";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: "app-declaracao-residencia",
  templateUrl: "./declaracao-residencia.component.html",
  styleUrls: ["./declaracao-residencia.component.scss"],
})
export class DeclaracaoResidenciaComponent {
  generatePDF() {
    // Esconder o botão antes de gerar o PDF
    const button = document.querySelector("button");
    button?.classList.add("hidden");

    const data = document.getElementById("pdf-content");
    html2canvas(data!).then((canvas) => {
      const imgWidth = 210; // Largura padrão de PDF em mm (A4)
      const pageHeight = 297; // Altura de uma página A4
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Adicionar mais páginas se o conteúdo for maior que uma página A4
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("declaracao_residencia.pdf");

      // Mostrar o botão novamente depois de gerar o PDF
      button?.classList.remove("hidden");
    });
  }
}
