document.addEventListener("DOMContentLoaded", async function () {
  document.getElementById("download-btn").addEventListener("click", () => {
    const element = document.querySelector(".resume");
    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: "resume.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  });
});
