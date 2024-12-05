document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("theme-toggle");
  const currentTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    toggleSwitch.checked = true;
  }
  toggleSwitch.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  });
  const container = document.getElementById("text-container");
  const textLines = container.textContent.split("\n");
  const cardContainer = container.parentElement;
  const tocList = document.getElementById("toc-list");
  let currentDepartment = "";
  let departmentCounts = {};
  textLines.forEach((line) => {
    line = line.trim();
    if (line.endsWith(":") && !line.includes("http")) {
      currentDepartment = line.replace(":", "");
      const departmentID = currentDepartment.toLowerCase().replace(/\s+/g, "-");
      const departmentDiv = document.createElement("div");
      departmentDiv.className = "department-title";
      departmentDiv.id = departmentID;
      departmentDiv.textContent = currentDepartment;
      cardContainer.appendChild(departmentDiv);
      departmentCounts[currentDepartment] = 0;
    } else {
      const jobPattern = /^\d+\.\s(.+):\s(https?:\/\/\S+)$/;
      const match = line.match(jobPattern);
      if (match && currentDepartment) {
        departmentCounts[currentDepartment]++;
        const jobTitle = match[1].trim();
        const jobLink = match[2].trim();
        const jobCard = document.createElement("div");
        jobCard.className = "job-card";
        jobCard.onclick = () => window.open(jobLink, "_blank");
        const titleDiv = document.createElement("div");
        titleDiv.className = "job-title";
        titleDiv.textContent = jobTitle;
        const linkDiv = document.createElement("div");
        linkDiv.className = "job-link";
        linkDiv.textContent = "Copy Referral Link";
        const successIndicator = document.createElement("div");
        successIndicator.className = "clipboard-success";
        successIndicator.textContent = "Copied!";
        linkDiv.onclick = (event) => {
          event.stopPropagation();
          navigator.clipboard.writeText(jobLink).then(
            () => {
              successIndicator.style.display = "block";
              setTimeout(() => {
                successIndicator.style.display = "none";
              }, 2000);
            },
            () => {
              alert("Failed to copy the link.");
            }
          );
        };
        linkDiv.appendChild(successIndicator);
        jobCard.appendChild(titleDiv);
        jobCard.appendChild(linkDiv);
        cardContainer.appendChild(jobCard);
      }
    }
  });
  // Calculate total jobs
  let totalJobs = 0;
  Object.keys(departmentCounts).forEach((department) => {
    totalJobs += departmentCounts[department];
  });
  // Update the total job count in the HTML
  document.querySelector(
    ".title-container h3"
  ).textContent = `${totalJobs} open positions`;
  Object.keys(departmentCounts).forEach((department) => {
    const departmentID = department.toLowerCase().replace(/\s+/g, "-");
    const tocItem = document.createElement("li");
    const tocLink = document.createElement("a");
    tocLink.className = "toc-link";
    tocLink.href = `#${departmentID}`;
    tocLink.textContent = `${department} (${departmentCounts[department]})`;
    tocItem.appendChild(tocLink);
    tocList.appendChild(tocItem);
  });

  // Scroll to Top Button
  const scrollToTopButton = document.getElementById("scrollToTopButton");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollToTopButton.style.display = "flex";
    } else {
      scrollToTopButton.style.display = "none";
    }
  });

  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
