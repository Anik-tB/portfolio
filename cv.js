const printButton = document.querySelector("#print-cv");
const params = new URLSearchParams(window.location.search);

const triggerPrint = () => {
  window.print();
};

if (printButton) {
  printButton.addEventListener("click", triggerPrint);
}

if (params.get("download") === "1") {
  window.addEventListener("load", () => {
    window.setTimeout(triggerPrint, 300);
  });
}
