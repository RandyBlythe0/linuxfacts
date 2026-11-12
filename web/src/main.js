(function () {
  const config = window.LINUXFACTS_CONFIG || {};
  const API_BASE_URL = (config.API_BASE_URL || "http://localhost:8787").replace(/\/$/, "");

  const factText = document.getElementById("fact-text");
  const factCategory = document.getElementById("fact-category");
  const factId = document.getElementById("fact-id");
  const factMeta = document.getElementById("fact-meta");
  const factSource = document.getElementById("fact-source");
  const factError = document.getElementById("fact-error");
  const apiBase = document.getElementById("api-base");
  const newFactBtn = document.getElementById("new-fact");
  const loadAllBtn = document.getElementById("load-all");
  const allFactsSection = document.getElementById("all-facts");
  const factsList = document.getElementById("facts-list");

  apiBase.textContent = API_BASE_URL;

  function setError(message) {
    if (!message) {
      factError.hidden = true;
      factError.textContent = "";
      return;
    }
    factError.hidden = false;
    factError.textContent = message;
  }

  async function fetchJson(path) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Accept": "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }
    return res.json();
  }

  function renderFact(fact) {
    factText.textContent = fact.fact;
    factCategory.textContent = fact.category || "fact";
    factId.textContent = fact.id != null ? `#${fact.id}` : "";

    if (fact.status) {
      factMeta.hidden = false;
      factMeta.textContent = `Status: ${fact.status.replace(/_/g, " ")}`;
    } else {
      factMeta.hidden = true;
      factMeta.textContent = "";
    }

    if (fact.source) {
      factSource.hidden = false;
      factSource.innerHTML = `Source: <a href="${fact.source}" target="_blank" rel="noopener noreferrer">${fact.source}</a>`;
    } else {
      factSource.hidden = true;
      factSource.innerHTML = "";
    }
  }

  async function loadRandomFact() {
    newFactBtn.disabled = true;
    setError("");
    try {
      const data = await fetchJson("/api/facts/random");
      renderFact(data.fact);
    } catch (err) {
      setError("Could not load a fact. Make sure the API is running and API_BASE_URL is correct.");
      console.error(err);
    } finally {
      newFactBtn.disabled = false;
    }
  }

  async function loadAllFacts() {
    loadAllBtn.disabled = true;
    setError("");
    try {
      const data = await fetchJson("/api/facts");
      factsList.innerHTML = "";
      (data.facts || []).forEach((fact) => {
        const li = document.createElement("li");

        const meta = document.createElement("div");
        meta.className = "meta";
        meta.textContent = `#${fact.id} · ${fact.category || "fact"}${fact.status ? ` · ${fact.status.replace(/_/g, " ")}` : ""}`;

        const text = document.createElement("div");
        text.textContent = fact.fact;

        li.appendChild(meta);
        li.appendChild(text);

        if (fact.source) {
          const source = document.createElement("div");
          source.className = "meta";
          const link = document.createElement("a");
          link.href = fact.source;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = fact.source;
          link.style.color = "var(--accent)";
          source.appendChild(document.createTextNode("Source: "));
          source.appendChild(link);
          li.appendChild(source);
        }

        factsList.appendChild(li);
      });
      allFactsSection.hidden = false;
    } catch (err) {
      setError("Could not load facts list. Make sure the API is running.");
      console.error(err);
    } finally {
      loadAllBtn.disabled = false;
    }
  }

  newFactBtn.addEventListener("click", loadRandomFact);
  loadAllBtn.addEventListener("click", loadAllFacts);

  loadRandomFact();
})();
