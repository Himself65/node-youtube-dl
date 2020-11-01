const path = require('path')
const fs = require('fs')
const ytdl = require('..')

function playlist (url) {
  'use strict'
  const video = ytdl(url)

  video.on('error', function error (err) {
    console.log(err.stack)
  })

  let size = 0
  video.on('info', function (info) {
    size = info.size
    const output = path.resolve(__dirname, '/', size + '.mp4')
    video.pipe(fs.createWriteStream(output))
  })

  let pos = 0
  video.on('data', function data (chunk) {
    pos += chunk.length
    // `size` should not be 0 here.
    if (size) {
      const percent = ((pos / size) * 100).toFixed(2)
      process.stdout.cursorTo(0)
      process.stdout.clearLine(1)
      process.stdout.write(percent + '%')
    }
  })

  video.on('next', playlist)
}

playlist('https://www.youtube.com/playlist?list=PLEFA9E9D96CB7F807')
