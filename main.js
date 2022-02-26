const handleFiles = (e) => {
  const [file] = document.querySelector("input[type=file]").files;
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(reader.result, "text/xml");

      const folders = xmlDoc.querySelectorAll("Folder");

      let convertedData = [];

      folders.forEach((folder) => {
        let data = {
          title: folder.firstElementChild.textContent,
          points: [],
        };

        const placemarks = folder.querySelectorAll("Placemark");

        placemarks.forEach((placemark) => {
          let coordinates = placemark.querySelector("coordinates").textContent.split(",");

          let point = {
            text: placemark.firstElementChild.textContent, // title of the place
            lat: coordinates[1].replace(/\s+/g, ""), // 47.6154276
            lng: coordinates[0].replace(/\s+/g, ""), // -122.3497142
          };

          data.points.push(point);
        });
        convertedData.push(data);
      });
      content.innerHTML = JSON.stringify(convertedData, null, 4);
      copyBtn.classList.remove("hidden");
    },
    false
  );

  if (file) reader.readAsText(file);
};
const content = document.querySelector("#kmlContent");
const inputElement = document.getElementById("inputElement");
inputElement.addEventListener("change", handleFiles, false);

const copyBtn = document.querySelector("#copy");
copyBtn.addEventListener("click", () => copyToClipboard(content.textContent));

// write the array to the user's clipboard
const copyToClipboard = async (string) => {
  navigator.clipboard
    .writeText(string)
    .then(() => (copyBtn.innerText = "Copied!"))
    .then(() =>
      setTimeout(() => {
        copyBtn.innerText = "Copy to clipboard";
      }, 1000)
    )
    .catch((err) => alert("Can't copy to clipboard.", err));
};
