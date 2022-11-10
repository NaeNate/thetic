const createImage = async () => {
  const width = localStorage.getItem("width")
  const height = localStorage.getItem("height")

  const { items } = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${width * height}`,
    {
      headers: {
        Authorization: `Bearer ${location.hash.split("=")[1].split("&")[0]}`,
      },
    }
  ).then((response) => response.json())

  const canvas = document.querySelector("canvas")
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

if (location.hash) {
  document.getElementById("before").hidden = true
  document.getElementById("after").hidden = false

  createImage()
}

document.querySelector("button").addEventListener("click", () => {
  document.querySelectorAll("input").forEach(({ id, value }) => {
    localStorage.setItem(id, value)
  })

  location.href =
    "https://accounts.spotify.com/authorize?" +
    [
      "client_id=f0cdb4dde1aa46179c245e8216036aa9",
      "response_type=token",
      "redirect_uri=http://localhost:3000/",
      "scope=user-top-read",
    ].join("&")
})
