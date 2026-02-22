const WORKER_URL = "https://gunnison.workers.dev"

const secretEl = document.getElementById("secret")
secretEl.value = sessionStorage.getItem("upload_secret") || ""
secretEl.addEventListener("input", () => {
  sessionStorage.setItem("upload_secret", secretEl.value)
})

async function upload() {
  const secret = secretEl.value.trim()
  const blobUrl = document.getElementById("blobUrl").value.trim()
  const name = document.getElementById("name").value.trim()
  const btn = document.getElementById("btn")

  setStatus("", "")

  if (!secret) return setStatus("error", "enter your secret")
  if (!blobUrl.startsWith("blob:")) return setStatus("error", "url must start with blob:")
  if (!name) return setStatus("error", "enter a filename")

  btn.disabled = true
  setStatus("", "fetching blob from browser...")

  let blob
  try {
    const res = await fetch(blobUrl)
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
    blob = await res.blob()
  } catch (err) {
    btn.disabled = false
    return setStatus("error", `could not fetch blob:\n${err.message}`)
  }

  setStatus("", `uploading ${(blob.size / 1024 / 1024).toFixed(1)} MB to r2...`)

  try {
    const res = await fetch(`${WORKER_URL}/upload?name=${encodeURIComponent(name)}`, {
      method: "POST",
      headers: { "X-Upload-Secret": secret },
      body: blob,
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || res.status)
    setStatus("ok", `done!\nkey: ${json.key}`)
  } catch (err) {
    return setStatus("error", `upload failed:\n${err.message}`)
  } finally {
    btn.disabled = false
  }
}

function setStatus(type, msg) {
  const el = document.getElementById("status")
  el.className = type
  el.textContent = msg
}
