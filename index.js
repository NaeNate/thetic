const width = localStorage.getItem("width")
const height = localStorage.getItem("height")

const createImage = async () => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${width * height}`,
    {
      headers: {
        Authorization: `Bearer ${location.href.split("=")[1].split("&")[0]}`,
      },
    }
  )

  const items = (await response.json()).items

  const canvas = document.getElementById("c")
  canvas.width = width * 300
  canvas.height = height * 300

  items.forEach((item, i) => {
    const img = document.createElement("img")
    img.src = item.album.images[1].url
    img.onload = () => {
      canvas
        .getContext("2d")
        .drawImage(img, (i % width) * 300, ((i - (i % width)) / width) * 300)
    }
  })
}

if (!location.hash) {
  document.getElementById("before").hidden = false
} else {
  document.getElementById("after").hidden = false

  createImage()
}

document.getElementById("form").onsubmit = (e) => {
  e.preventDefault()

  localStorage.setItem("width", document.getElementById("width").value)
  localStorage.setItem("height", document.getElementById("height").value)

  location.href =
    "https://accounts.spotify.com/authorize?" +
    [
      "response_type=token",
      "client_id=f0f48392cf764a439e0e8fbe72ef2f36",
      "scope=user-top-read",
      `redirect_uri=${encodeURIComponent(
        location.href.includes("thetic")
          ? "https://thetic.netlify.app/"
          : "http://localhost:3000/"
      )}`,
    ].join("&")
}
