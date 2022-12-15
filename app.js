const fetchURL = async (i, term) => {
  return await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=50&offset=${
      i && i * 50 - 1
    }&time_range=${term}`,
    {
      headers: {
        Authorization: `Bearer ${location.hash.split("=")[1].split("&")[0]}`,
      },
    }
  ).then((response) => response.json())
}

const createImage = async () => {
  const width = localStorage.getItem("width") || 5
  const height = localStorage.getItem("height") || 5

  const quality = localStorage.getItem("quality")
  const term = localStorage.getItem("term")

  const urls = new Set()

  for (let i = 0; i < 3; i++) {
    const response = await fetchURL(i, term)

    response.items.forEach((item) => {
      if (item.album.images.length > 0)
        urls.add(item.album.images.find(({ width }) => width == quality).url)
    })
  }

  const canvas = document.querySelector("canvas")
  canvas.width = width * quality
  canvas.height = height * quality

  Array.from(urls).forEach((url, i) => {
    const img = document.createElement("img")

    img.src = url

    img.onload = () => {
      canvas
        .getContext("2d")
        .drawImage(
          img,
          (i % width) * quality,
          ((i - (i % width)) / width) * quality,
          quality,
          quality
        )
    }
  })
}

if (location.hash) {
  document.getElementById("before").hidden = true
  document.getElementById("after").hidden = false

  createImage()
}

document.querySelector("button").addEventListener("click", () => {
  ;["width", "height", "quality", "term"].forEach((field) => {
    localStorage.setItem(field, document.querySelector(`#${field}`).value)
  })

  location.href =
    "https://accounts.spotify.com/authorize?" +
    [
      "client_id=f0cdb4dde1aa46179c245e8216036aa9",
      "response_type=token",
      `redirect_uri=${
        location.hostname == "localhost"
          ? "http://localhost:3000/"
          : "https://thetic.netlify.app/"
      }`,
      "scope=user-top-read",
    ].join("&")
})
