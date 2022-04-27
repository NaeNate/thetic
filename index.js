const createImage = async () => {
  const width = localStorage.getItem("width")
  const height = localStorage.getItem("height")

  const findQuality = () => {
    switch (localStorage.getItem("quality")) {
      case "l":
        return 64
      case "m":
        return 300
      case "h":
        return 640
    }
  }

  const quality = findQuality()

  const response = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${width * height}`,
    {
      headers: {
        Authorization: `Bearer ${location.href.split("=")[1].split("&")[0]}`,
      },
    }
  )

  const items = (await response.json()).items

  const canvas = document.querySelector("canvas")
  canvas.width = width * quality
  canvas.height = height * quality

  items.forEach((item, i) => {
    const img = document.createElement("img")

    img.src = item.album.images.filter(
      (albumImage) => albumImage.height === quality
    )[0].url

    img.onload = () => {
      canvas
        .getContext("2d")
        .drawImage(
          img,
          (i % width) * quality,
          ((i - (i % width)) / width) * quality
        )
    }
  })
}

if (location.hash) {
  document.getElementById("before").hidden = true
  document.getElementById("after").hidden = false

  createImage()
}

document.querySelector("button").onclick = () => {
  localStorage.setItem("width", document.getElementById("width").value)
  localStorage.setItem("height", document.getElementById("height").value)
  localStorage.setItem("quality", document.querySelector("select").value)

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
