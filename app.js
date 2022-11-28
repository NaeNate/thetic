const createImage = async () => {
  let quality

  switch (localStorage.getItem("quality")) {
    case "h":
      quality = 640
      break
    case "m":
      quality = 300
      break
    case "l":
      quality = 64
      break
  }

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
  canvas.width = width * quality
  canvas.height = height * quality

  items.forEach((item, i) => {
    const img = document.createElement("img")

    img.src = item.album.images.filter((image) => {
      return image.width === quality
    })[0].url

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

document.querySelector("button").addEventListener("click", () => {
  localStorage.setItem("width", document.querySelector("#width").value)
  localStorage.setItem("height", document.querySelector("#height").value)
  localStorage.setItem("quality", document.querySelector("select").value)

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
