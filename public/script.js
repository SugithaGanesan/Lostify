console.log("Lostify Script Loaded");
document.getElementById("searchBox")?.addEventListener("input", loadItems);
document.getElementById("statusFilter")?.addEventListener("change", loadItems);

// ✅ Backend URLs (Updated to Render)
const BASE_URL = "https://lostify-backend-2w1e.onrender.com";
const ITEMS_API = "https://lostify-backend-2w1e.onrender.com/api/items";
const UPLOAD_API = "https://lostify-backend-2w1e.onrender.com/api/upload";
const FEEDBACK_API = "https://lostify-backend-2w1e.onrender.com/api/feedback";


// ✅ Load Items
async function loadItems() {
  try {
    document.getElementById("loader").style.display = "block";  // ✅ Show loader
    const res = await fetch(ITEMS_API);
    const items = await res.json();
    const container = document.getElementById("items-container");
    container.innerHTML = "";
    document.getElementById("loader").style.display = "none";   // ✅ Hide loader

    const searchTerm = document.getElementById("searchBox")?.value.toLowerCase() || "";
    const filterStatus = document.getElementById("statusFilter")?.value || "";

    const filteredItems = items.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm);
      const matchesStatus = filterStatus === "" || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    if (filteredItems.length === 0) {
      container.innerHTML = "<p>No items found.</p>";
      return;
    }

    filteredItems.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "item-card";
      div.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.description || ""}</p>
        <p><strong>Status:</strong> ${item.status}</p>
        ${item.imageUrl ? `<img src="${item.imageUrl}" width="150">` : ""}
        <hr>
      `;

      if (item.status === "found") {
        div.innerHTML += `
          <button onclick="downloadCert('${item.title}')">Get Certificate</button>
          <button onclick="markReturned('${item._id}')">Mark as Returned</button>
        `;
      }

      container.appendChild(div);
      setTimeout(() => div.classList.add("show"), index * 100);
    });
  } catch (err) {
    document.getElementById("loader").textContent = "⚠️ Failed to load items";
    console.error("Error loading items:", err);
  }
}

// ✅ Handle Upload Form
const uploadForm = document.getElementById("uploadForm");
if (uploadForm) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value;
    const status = document.getElementById("status").value;
    const imageFile = document.getElementById("image").files[0];

    let imageUrl = "";

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await fetch(UPLOAD_API, {
          method: "POST",
          body: formData
        });

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const newItem = { title, description, location, status, imageUrl };

      await fetch(ITEMS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });

      alert("Item uploaded successfully!");
      document.getElementById("uploadForm").reset();
      loadItems();
    } catch (err) {
      console.error("Error uploading item:", err);
      alert("Upload failed. Check console for details.");
    }
  });
}

// ✅ Load Feedback
async function loadFeedback() {
  try {
    const res = await fetch(FEEDBACK_API);
    const feedbacks = await res.json();
    const container = document.getElementById("feedback-container");
    if (!container) return;

    container.innerHTML = "<h3>Recent Feedback</h3>";

    if (feedbacks.length === 0) {
      container.innerHTML += "<p>No feedback yet.</p>";
      return;
    }

    let total = 0;
    feedbacks.forEach(f => {
      total += f.rating;
      const div = document.createElement("div");
      div.className = "feedback-card";
      div.innerHTML = `<strong>${f.name}</strong> - ${f.rating}⭐ <br>${f.comment || ""}<hr>`;
      container.appendChild(div);
    });

    const avg = (total / feedbacks.length).toFixed(1);
    container.innerHTML = `<h3>Average Rating: ${avg}⭐</h3>` + container.innerHTML;
  } catch (err) {
    console.error("Error loading feedback:", err);
  }
}

// ✅ Handle Feedback Form
const feedbackForm = document.getElementById("feedbackForm");
if (feedbackForm) {
  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("fname").value;
    const rating = document.getElementById("frating").value;
    const comment = document.getElementById("fcomment").value;

    await fetch(FEEDBACK_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating, comment })
    });

    alert("Feedback submitted!");
    document.getElementById("feedbackForm").reset();
    loadFeedback();
  });
}

// ✅ Load Stats
async function loadStats() {
  try {
    const res = await fetch(`${ITEMS_API}/count`);
    const data = await res.json();
    const stats = document.querySelector('.stats');
    if (stats) {
      stats.textContent = `🔢 ${data.returned} items reunited out of ${data.total} uploaded!`;
    }
  } catch (err) {
    console.error("Error loading stats:", err);
  }
}

// ✅ Certificate Download
function downloadCert(itemTitle) {
  const name = prompt("Enter your name for the certificate:");
  if (!name) return;
  window.open(`${BASE_URL}/api/certificate/${encodeURIComponent(name)}/${encodeURIComponent(itemTitle)}`);
}

// ✅ Mark Returned
async function markReturned(id) {
  const confirmAction = confirm("Are you sure you want to mark this item as returned?");
  if (!confirmAction) return;

  await fetch(`${ITEMS_API}/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "returned" })
  });

  alert("Item marked as returned!");
  loadItems();
  loadStats();
}

// ✅ Load everything on page load
document.addEventListener("DOMContentLoaded", () => {
  loadItems();
  loadFeedback();
  loadStats();
});
