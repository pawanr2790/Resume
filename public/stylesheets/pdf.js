window.onload = function () {
  document.getElementById("download").addEventListener("click", () => {
    const resume = this.document.getElementById("resume");
    console.log(resume);
    console.log(window);
    var opt = {
      margin: 0.2,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 75 },
      html2canvas: { scale: 2 },
      border: {
        top: "2in",
        right: "1in",
        bottom: "2in",
        left: "1.5in",
      },
      fitToPage: true,
      enableLinks: true,
      jsPDF: { unit: "in", format: "A3", orientation: "portrait" },
    };
    html2pdf().from(resume).set(opt).save();
  });
};
