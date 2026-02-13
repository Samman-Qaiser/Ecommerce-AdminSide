
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const handleDownloadInvoice = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // PDF generate karne ka function (with or without logo)
  const generatePDF = (logoImage = null) => {
    // === LOGO (agar available ho) ===
    if (logoImage) {
      try {
        doc.addImage(logoImage, "JPEG", 14, 10, 30, 30);
      } catch (err) {
        console.log("Logo add nahi ho saka:", err);
      }
    }

    // === COMPANY INFO ===
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Doritaaga", pageWidth - 14, 20, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Doritaaga Ecommerce Store", pageWidth - 14, 26, { align: "right" });
    doc.text("GST: 06AKWPY3989Q1ZF", pageWidth - 14, 32, { align: "right" });
    doc.text("Haryana, India", pageWidth - 14, 38, { align: "right" });
    doc.text("support@yourstore.com", pageWidth - 14, 44, { align: "right" });

    doc.setDrawColor(200);
    doc.line(14, 50, pageWidth - 14, 50);

    // === INVOICE TITLE ===
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 14, 60);

    // === ORDER INFO ===
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: ${order.orderNumber}`, 14, 70);
    doc.text(
      `Date: ${order.createdAt?.toDate().toLocaleDateString("en-GB") || ""}`,
      14,
      78
    );
    doc.text(`Customer: ${order?.userDetails?.fullName || ""}`, 14, 88);
    doc.text(`Email: ${order?.userDetails?.email || ""}`, 14, 96);

    // === PRODUCTS TABLE ===
    autoTable(doc, {
      startY: 105,
      head: [["Product", "Qty", "Unit Price", "Total"]],
      body: order.items?.map((item) => [
        item.name,
        item.quantity,
        `Rs. ${item.price?.toLocaleString()}`,
        `Rs. ${(item.price * item.quantity).toLocaleString()}`,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: 255,
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // === TOTALS ===
    doc.setFontSize(11);
    doc.text(
      `Subtotal: Rs. ${(order.subtotal || 0).toLocaleString()}`,
      pageWidth - 14,
      finalY,
      { align: "right" }
    );
    doc.text(
      `Shipping: Rs. ${(order.shippingCost || 0).toLocaleString()}`,
      pageWidth - 14,
      finalY + 8,
      { align: "right" }
    );
    doc.text(
      `Tax: Rs. ${(order.tax || 0).toLocaleString()}`,
      pageWidth - 14,
      finalY + 16,
      { align: "right" }
    );

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Total: Rs. ${(order.total || 0).toLocaleString()}`,
      pageWidth - 14,
      finalY + 28,
      { align: "right" }
    );

    // === FOOTER ===
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for shopping with us!", pageWidth / 2, 285, {
      align: "center",
    });
    doc.text("This is a computer-generated invoice.", pageWidth / 2, 292, {
      align: "center",
    });

    // === SAVE PDF ===
    doc.save(`invoice_${order.orderNumber}.pdf`);
  };

  // === TRY TO LOAD LOGO ===
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const base64Image = canvas.toDataURL('image/jpeg');
        
        generatePDF(base64Image);
      } catch (err) {
        console.log("Canvas error:", err);
        generatePDF(); // Bina logo ke generate karo
      }
    };

    img.onerror = () => {
      console.log("Logo load nahi hui, PDF bina logo ke ban rahi hai");
      generatePDF(); // Bina logo ke generate karo
    };

    // Logo path - check karo yeh sahi hai
    img.src = "/logo.jpeg"; // Ya tumhara actual path
    
    // Backup: agar 2 second mein load nahi hui toh bina logo ke generate karo
    setTimeout(() => {
      if (!img.complete) {
        console.log("Logo timeout, PDF generating...");
        img.onload = null;
        img.onerror = null;
        generatePDF();
      }
    }, 2000);
    
  } catch (err) {
    console.log("Image load error:", err);
    generatePDF(); // Bina logo ke generate karo
  }
};
export default handleDownloadInvoice