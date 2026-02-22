console.log("Gunnison v4")

const WORKER_URL = "https://gunnison.therondevelopment.workers.dev"

const secretEl = document.getElementById("secret")
secretEl.value = localStorage.getItem("upload_secret") || ""
secretEl.addEventListener("input", () => {
  localStorage.setItem("upload_secret", secretEl.value)
})

async function download() {
  const secret = secretEl.value.trim()
  const tweetUrl = document.getElementById("tweetUrl").value.trim()
  const name = document.getElementById("name").value.trim()
  const btn = document.getElementById("btn")

  setStatus("", "")

  if (!secret) return setStatus("error", "enter your secret")
  if (!tweetUrl.includes("/status/")) return setStatus("error", "enter a valid tweet url")

  const tweetId = tweetUrl.match(/\/status\/(\d+)/)?.[1]
  const resolvedName = name || tweetId

  btn.disabled = true
  setStatus("", "fetching video...")

  try {
    const res = await fetch(`${WORKER_URL}/download`, {
      method: "POST",
      headers: {
        "X-Upload-Secret": secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tweetUrl, name: resolvedName }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || res.status)
    setStatus("ok", `done! <a href="${json.watchUrl}" target="_blank">${json.watchUrl}</a>`, true)
  } catch (err) {
    setStatus("error", `failed:\n${err.message}`)
  } finally {
    btn.disabled = false
  }
}

function setStatus(type, msg, html = false) {
  const el = document.getElementById("status")
  el.className = type
  if (html) el.innerHTML = msg
  else el.textContent = msg
}
