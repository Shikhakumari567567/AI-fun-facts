const factBtn = document.getElementById("factBtn");
const status = document.getElementById("status");
const result = document.getElementById("result");
const factText = document.getElementById("factText");

factBtn.addEventListener("click", async () => {
  factBtn.disabled = true;
  status.textContent = "Generating a fun fact...";
  result.hidden = true;

  try {
    // Call the backend API
    const response = await fetch("/fun-fact");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    // Display the generated fact
    factText.textContent = data.fact;
    result.hidden = false;
    status.textContent = "Here is your fun fact!";
  } catch (error) {
    status.textContent = error.message;
  } finally {
    factBtn.disabled = false;
  }
});
