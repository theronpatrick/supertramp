console.log("Gunnison v2")

const WORKER_URL = "https://gunnison.therondevelopment.workers.dev"

const secretEl = document.getElementById("secret")
secretEl.value = sessionStorage.getItem("upload_secret") || ""
secretEl.addEventListener("input", () => {
  sessionStorage.setItem("upload_secret", secretEl.value)
})

async function download() {
  const secret = secretEl.value.trim()
  const tweetUrl = document.getElementById("tweetUrl").value.trim()
  const name = document.getElementById("name").value.trim()
  const btn = document.getElementById("btn")

  setStatus("", "")

  if (!secret) return setStatus("error", "enter your secret")
  if (!tweetUrl.includes("/status/")) return setStatus("error", "enter a valid tweet url")
  if (!name) return setStatus("error", "enter a filename")

  btn.disabled = true
  setStatus("", "fetching video...")

  try {
    const res = await fetch(`${WORKER_URL}/download`, {
      method: "POST",
      headers: {
        "X-Upload-Secret": secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tweetUrl, name }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || res.status)
    setStatus("ok", `done!\nkey: ${json.key}`)
  } catch (err) {
    setStatus("error", `failed:\n${err.message}`)
  } finally {
    btn.disabled = false
  }
}

function setStatus(type, msg) {
  const el = document.getElementById("status")
  el.className = type
  el.textContent = msg
}
