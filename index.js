/* Luma | v1.1.0 */

(async () => {
   const allowed = [
      "id",
      "applyUrl",
      "title",
      "departmentId",
      "department",
      "employmentTypeId",
      "employmentType",
      "siteId",
      "site",
      "country",
      "languageCode",
      "description",
      "requirements",
      "responsibilities",
      "benefits",
      "link"
   ];

   const luma = document.querySelector(".js-luma");
   if (!luma) return;

   const nodes = Array.from(luma.querySelectorAll("[data-luma]"));
   if (!nodes.length) return;

   const filtered = nodes.filter(n => allowed.includes(n.dataset.luma));
   const fields = filtered.map(({ dataset }) => dataset.luma === 'link' ? 'applyUrl' : dataset.luma);

   const query = new URLSearchParams(fields.map((f) => ["fields", f])).toString();
   const req = await fetch("https://luma-api.uiloco.workers.dev/?" + query);

   if (!req.ok) {
      luma.textContent = "Error loading jobs.";
      return;
   }

   const jobs = await req.json();

   let lastNode = luma;

   jobs.forEach((job, idx) => {
      const clone = idx === 0 ? luma : luma.cloneNode(true);

      Array.from(clone.querySelectorAll("[data-luma]")).forEach((node) => {
         const key = node.dataset.luma;
         if (allowed.includes(key)) {
            if (key === 'link') {
               const link = job["applyUrl"].split('/apply')[0]
               node.setAttribute('href', link)
            } else {
               node.innerHTML = job[key]?? "";
            }
         }
      });

      if (idx > 0) {
         lastNode.after(clone);
         lastNode = clone;
      }
   });
})();
